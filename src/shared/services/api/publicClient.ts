import { AxiosRequestConfig } from "axios";
import { createAxiosInstance } from "./apiCore";
import { normalizeError } from "./apiErrorHandler";
import { ApiResponse } from "./types/api.types";

const publicAxios = createAxiosInstance();

// ─── Response interceptor ─────────────────────────────────────────────────────

publicAxios.interceptors.response.use(
  (response) => response, // pass through — unwrapping done in publicClient methods
  (error) => Promise.reject(normalizeError(error)),
  // NormalizedError is now what every .catch() receives
);

// ─── Public client interface ──────────────────────────────────────────────────
// Unwraps ApiResponse<T> so services get T directly

export const publicClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await publicAxios.get<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  post: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await publicAxios.post<ApiResponse<T>>(url, body, config);
    return response.data.data;
  },

  put: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await publicAxios.put<ApiResponse<T>>(url, body, config);
    return response.data.data;
  },

  patch: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await publicAxios.patch<ApiResponse<T>>(url, body, config);
    return response.data.data;
  },
};
