import axios, { type AxiosInstance } from "axios";
import { ENV } from "@/app/config/env.config";
import { getAuthToken } from "@/app/lib/utils";

// Create axios instance with base configuration
const httpClient: AxiosInstance = axios.create({
  baseURL: ENV.SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to dynamically add auth token to every request
httpClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { httpClient };
