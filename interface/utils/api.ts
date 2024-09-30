import axios from "axios";

export interface CreateModelPayload {
  messages: string[];
  address: string;
  model_name: string;
}

export interface PredictPayload {
  api_key: string;
  query: string;
}

export interface CreatePoolPayload {
  pool_amount: number;
  start_time: string; // ISO 8601 datetime string
  end_time: string; // ISO 8601 datetime string
  name: string;
  description: string;
  image: string;
  address: string;
  questions: string[];
}

export interface CreateModelResponse {
  model_id: string;
  api_key: string;
  model_name: string
}

export interface ModelInfo {
  model_id: string;
  api_key: string;
  model_name: string;
}

export interface PredictResponse {
  answer: string;
}

export interface Pool {
  pool_id: string;
  pool_amount: number;
  start_time: string; // ISO 8601 datetime string
  end_time: string; // ISO 8601 datetime string
  name: string;
  description: string;
  image: string;
  address?: string;
  questions: { [key: number]: string };
}

export interface GetPoolResponse {
  pool: Pool;
  message?: string; // Optional
}

export interface SubmitAnswerPayload {
  query: string;
}

export interface GetPoolsResponse {
  pools: Pool[];
  message?: string; // Optional
}

const API_BASE_URL = "http://localhost:8000";
async function createModel(
  payload: CreateModelPayload
): Promise<CreateModelResponse> {
  const response = await axios.post<CreateModelResponse>(
    `${API_BASE_URL}/create-model`,
    payload
  );
  return response.data;
}

async function listModels(address: string): Promise<ModelInfo[]> {
  const response = await axios.get<ModelInfo[]>(`${API_BASE_URL}/list_models`, {
    params: { address },
  });
  return response.data;
}

// TODO: We could remove the need for api key here soon
async function predict(
  modelId: string,
  payload: PredictPayload
): Promise<string> {
  const response = await axios.post<PredictResponse>(
    `${API_BASE_URL}/predict/${modelId}`,
    payload
  );
  return response.data.answer;
}

async function createPool(
  payload: CreatePoolPayload
): Promise<Pool> {
  const response = await axios.post<Pool>(
    `${API_BASE_URL}/create-pool`,
    payload
  );
  return response.data;
}

async function getPools(): Promise<GetPoolsResponse> {
  const response = await axios.get<GetPoolsResponse>(
    `${API_BASE_URL}/get-pools`
  );
  return response.data;
}

async function getPool(poolId: string): Promise<GetPoolResponse> {
  const response = await axios.get<GetPoolResponse>(
    `${API_BASE_URL}/get-pool/${poolId}`
  );
  return response.data;
}

async function submitAnswer(
  poolId: string,
  questionId: number,
  payload: SubmitAnswerPayload
): Promise<void> {
  await axios.post(
    `${API_BASE_URL}/submit-answer/${poolId}/${questionId}`,
    payload
  );
}
// ... existing code ...

export interface StoreQuestionSolutionPayload {
  question: string;
  solution: string;
  address?: string;
}

export interface GetPoolsAnswersPayload {
  pool_id: string;
}

export interface Answer {
  question: string;
  solution: string;
  address?: string;
}

export interface GetPoolsAnswersResponse {
  answers: Answer[];
  message?: string;
}


async function storeQuestionAnswer(
  poolId: string,
  payload: StoreQuestionSolutionPayload
): Promise<{ pool_id: string; message: string }> {
  const response = await axios.post(
    `${API_BASE_URL}/store-question-answer/${poolId}`,
    payload
  );
  return response.data;
}

async function getPoolsAnswers(
  payload: GetPoolsAnswersPayload
): Promise<GetPoolsAnswersResponse> {
  const response = await axios.post<GetPoolsAnswersResponse>(
    `${API_BASE_URL}/get-pools-answers`,
    payload
  );
  return response.data;
}

export { createModel, listModels, predict, createPool, getPools, getPool, submitAnswer, storeQuestionAnswer, getPoolsAnswers };