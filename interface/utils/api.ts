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
): Promise<CreateModelResponse> {
  const response = await axios.post<CreateModelResponse>(
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

export { createModel, listModels, predict, createPool, getPools };
