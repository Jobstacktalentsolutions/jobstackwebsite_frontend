import axios, { type AxiosInstance } from "axios";
import { ENV } from "@/app/config/env.config";
import { getAccessToken } from "../lib/cookies";

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
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;
    if (isFormData && config.headers) {
      if (typeof (config.headers as any).delete === "function") {
        (config.headers as any).delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { httpClient };
