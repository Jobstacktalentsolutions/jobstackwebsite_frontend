import axios from "axios";
import { ENV } from "@/app/config/env.config";

export const httpClient = axios.create({
  baseURL: ENV.SERVER_URL,
  withCredentials: true,
});
