import axios from "axios";

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    const apiError: ApiError = {
      status: error.response?.status ?? 0,
      message: error.response?.data?.message ?? error.message ?? "Network error",
      code: error.response?.data?.code,
    };
    return Promise.reject(apiError);
  },
);

export function useMock(): boolean {
  return import.meta.env.VITE_USE_MOCK === "true";
}

export default client;
