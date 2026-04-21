import { API_BASE_URL } from "@/shared/constants";
import { NetworkMonitor } from "@/shared/utils";
import axios, {
  AxiosInstance,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios";

const sharedConfig: CreateAxiosDefaults = {
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Exported as a factory so publicClient and privateClient
// each get their own isolated instance
export const createAxiosInstance = (
  overrides?: Partial<CreateAxiosDefaults>,
): AxiosInstance => {
  const instance = axios.create({
    ...sharedConfig,
    ...overrides,
  });

  // Adaptive timout interceptor (applied to ALL instances)
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      console.log("🚀 API REQUEST:", {
        url: config.baseURL + config.url,
        method: config.method,
        data: config.data,
      });

      // Only set if the specific request hasn't overridden timeout manually
      if (!config.timeout) {
        config.timeout = NetworkMonitor.getTimeout();
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
  return instance;
};
