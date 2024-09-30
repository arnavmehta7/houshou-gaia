from datetime import datetime
import os
import traceback
from dotenv import load_dotenv
import uuid
from typing import List
from fastapi import FastAPI, HTTPException, Path, Query
from pydantic import BaseModel
from pymongo import MongoClient
import faiss
from sentence_transformers import SentenceTransformer
from pymongo.server_api import ServerApi
import requests
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

EMBEDDINGS_DIR = "embeddings"
os.makedirs(EMBEDDINGS_DIR, exist_ok=True)


embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
mongo_client = MongoClient(os.environ["MONGODB_URI"], server_api=ServerApi("1"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = mongo_client["database"]

# all collections
models_collection = db["models"]
pools_collection = db["pools"]

question_answer_collection = db["question_answer"]


def generate_response(content: str) -> str:
    url = "https://llama.us.gaianet.network/v1/chat/completions"
    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
    data = {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": content}
        ],
        "model": "Meta-Llama-3-8B-Instruct-Q5_K_M"
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        response_data = response.json()
        return response_data['choices'][0]['message']['content']
    except requests.exceptions.RequestException as e:
        print(f"Error generating response: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating response.")



# Pydantic models
class CreateModelPayload(BaseModel):
    messages: List[str]
    address: str
    model_name: str


# Endpoint to create a model


# Endpoint to create a model
@app.post("/create-model")
def create_model(payload: CreateModelPayload):
    messages = payload.messages
    address = payload.address

    if len(messages) % 2 != 0:
        raise HTTPException(
            status_code=400, detail="Messages should contain question-answer pairs."
        )

    # Generate embeddings
    embeddings = embedding_model.encode(messages, convert_to_numpy=True)

    # Create FAISS index
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)

    # Save index to disk with unique model ID
    model_id = str(uuid.uuid4())
    faiss.write_index(index, os.path.join(EMBEDDINGS_DIR, f"{model_id}.index"))

    # Generate API key
    api_key = str(uuid.uuid4())

    # Store in MongoDB
    models_collection.insert_one(
        {
            "address": address,
            "model_id": model_id,
            "api_key": api_key,
            "messages": messages,  # Store messages with the model
            "model_name": payload.model_name
        }
    )

    return {"model_id": model_id, "api_key": api_key, "model_name": payload.model_name}

# Endpoint to list models for an address
@app.get("/list_models")
def list_models(address: str = Query(...)):
    records = models_collection.find({"address": address})
    models = [{"model_id": r["model_id"], "api_key": r["api_key"], "model_name": r.get("model_name")} for r in records]
    return models


class PredictPayload(BaseModel):
    api_key: str
    query: str


# Endpoint to make a prediction
# Endpoint to make a prediction
@app.post("/predict/{model_id}")
def predict(model_id: str = Path(...), payload: PredictPayload = None):
    api_key = payload.api_key
    query = payload.query

    # Authenticate API key
    record = models_collection.find_one({"model_id": model_id, "api_key": api_key})
    if not record:
        raise HTTPException(status_code=401, detail="Invalid API key or model ID.")

    # Load FAISS index
    try:
        index = faiss.read_index(os.path.join(EMBEDDINGS_DIR, f"{model_id}.index"))
    except:
        raise HTTPException(status_code=500, detail="Model index not found.")

    # Retrieve stored messages
    all_messages = record.get("messages", [])
    if not all_messages:
        raise HTTPException(status_code=500, detail="No messages found for this model.")

    # Encode the query
    query_embedding = embedding_model.encode([query], convert_to_numpy=True)

    # Search in FAISS index
    k = 5  # Number of nearest neighbors
    print(f">>> Searching for {k} nearest neighbors... for query '{query}'")
    distances, indices = index.search(query_embedding, k)
    indices = indices[0]
    print(f">>> indices: {indices}")

    # Retrieve relevant messages based on indices
    retrieved_messages = []
    for idx in indices:
        if 0 <= idx < len(all_messages):
            retrieved_messages.append(all_messages[idx])
        else:
            print(f"Index {idx} is out of bounds for messages list.")

    context = "\n".join(retrieved_messages)
    content = f"Context: {context}\nQuestion: {query}\nAnswer the question based on the context."
    print(f">>> content: {content}")


    # Generate response using GaiaNet's LLM API
    answer = generate_response(content)


    # answer = response.content
    print(f">>> answer: {answer}")
    return {"answer": answer}



class CreatePoolPayload(BaseModel):
    uuid: str
    pool_amount: float
    start_time: datetime
    end_time: datetime
    name: str
    description: str
    image: str
    address: str
    questions: List[str]


@app.post("/create-pool")
def create_pool(payload: CreatePoolPayload):
    # Validate that start_time is before end_time
    if payload.start_time >= payload.end_time:
        raise HTTPException(
            status_code=400, detail="start_time must be before end_time."
        )

    # Prepare the pool data
    pool_data = {
        "pool_id": payload.uuid,
        "pool_amount": payload.pool_amount,
        "start_time": payload.start_time,
        "end_time": payload.end_time,
        "name": payload.name,
        "description": payload.description,
        "image": payload.image,
        "address": payload.address,
        "questions": {
            i: question for i, question in enumerate(payload.questions)
        }
    }

    # Store the pool data in MongoDB
    question_answer_collection.insert_one(pool_data)
    return {"pool_id": pool_id, "message": "Pool created successfully."}

@app.post("/submit-answer/{pool_id}/{question_id}")
def submit_answer(pool_id: str = Path(...), question_id: int = Path(...), payload: PredictPayload = None):
    query = payload.query

    # Authenticate API key
    record = pools_collection.find_one({"pool_id": pool_id})
    if not record:
        raise HTTPException(status_code=401, detail="Invalid pool ID.")

    # Retrieve stored questions
    all_questions = record.get("questions", {})
    if not all_questions:
        raise HTTPException(status_code=500, detail="No questions found for this pool.")

    # Retrieve the question based on question_id
    question = all_questions.get(question_id)
    if not question:
        raise HTTPException(status_code=500, detail="Question not found for this pool.")

    # Check if the question matches the query
    if question != query:
        raise HTTPException(status_code=400, detail="Question does not match the query.")

    # Store the answer in the pool data
    pools_collection.update_one(
        {"pool_id": pool_id},
        {"$set": {f"questions.{question_id}.answer": query}}
    )

    return {"message": "Answer submitted successfully."}

@app.get("/get-pool/{pool_id}")
def get_pool(pool_id: str):
    # Find the pool in the collection
    pool = pools_collection.find_one({"pool_id": pool_id})
    
    # If no pool is found, return an empty list
    if not pool:
        return {"message": "Pool not found.", "pool": {}}
    
    # Format the pool data
    formatted_pool = {
        "pool_id": pool["pool_id"],
        "pool_amount": pool["pool_amount"],
        "start_time": pool["start_time"],
        "end_time": pool["end_time"],
        "name": pool["name"],
        "description": pool["description"],
        "image": pool["image"],
        "address": pool.get("address"),
        "questions": pool["questions"],
    }
    
    return {"pool": formatted_pool}


class StoreQuestionSolutionPayload(BaseModel):
    question: str
    solution: str
    address: str

@app.post("/store-question-answer/{pool_id}")
def store_question_answer(pool_id: str = Path(...), payload: StoreQuestionSolutionPayload = None):
    # Prepare the pool data
    data = {
        "pool_id": pool_id,
        "question": payload.question,
        "solution": payload.solution,
        "address": payload.address 
    }

    # Store the pool data in MongoDB
    question_answer_collection.insert_one(data)
    return {"pool_id": pool_id, "message": "Pool created successfully."}

class GetPoolsAnswersPayload(BaseModel):
    pool_id: str

@app.post("/get-pools-answers")
def get_pools_answers(payload: GetPoolsAnswersPayload):
    # Find the pool in the collection
    # question_answer_collection.find({"pool_id": pool_id})
    answers = list(question_answer_collection.find({"pool_id": payload.pool_id}))
    
    # If no pool is found, return an empty list
    if not answers:
        return {"message": "Pool not found.", "answers": []}
    
    # Format the pool data
    formatted_answers = [
        {
            "question": answer["question"],
            "solution": answer["solution"],
            "address": answer.get("address"),
        }
        for answer in answers
    ]
    
    return {"answers": formatted_answers}

class FindPoolsParticipatedPayload(BaseModel):
    address: str
    
@app.post("/find-pools-participated")
def find_pools_participated(address: FindPoolsParticipatedPayload):
    # Find the pool in the collection
    answers = list(question_answer_collection.find({"address": address.address}))
    
    # If no pool is found, return an empty list
    if not answers:
        return {"message": "Pool not found.", "answers": []}
    
    print(f">>> answers: {answers}")
    pools_participated = set()

    for answer in answers:
        pools_participated.add(answer["pool_id"])
    print(f">>> pools_participated: {pools_participated}")
    return {"pools_participated": list(pools_participated)}
    

# New endpoint to retrieve all pools
@app.get("/get-pools")
def get_pools():
    # Find all pools in the collection
    pools = list(pools_collection.find())

    # If no pools are found, return an empty list
    if not pools:
        return {"message": "No pools found.", "pools": []}

    # Format the pools data
    formatted_pools = [
        {
            "pool_id": pool["pool_id"],
            "pool_amount": pool["pool_amount"],
            "start_time": pool["start_time"],
            "end_time": pool["end_time"],
            "name": pool["name"],
            "description": pool["description"],
            "image": pool["image"],
            "address": pool.get("address"),
            "questions": pool["questions"],
        }
        for pool in pools
    ]

    return {"pools": formatted_pools}



if __name__ == "__main__":
    import uvicorn

    try:
        uvicorn.run(app, host="0.0.0.0", port=8000)
    except Exception as e:
        print(e, traceback.format_exc())
