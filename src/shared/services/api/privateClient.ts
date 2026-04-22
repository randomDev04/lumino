import { useAuthStore } from "@/features/auth/store/auth.store";
import { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { createAxiosInstance } from "./apiCore";
import { normalizeError } from "./apiErrorHandler";
import { ApiResponse } from "./types/api.types";

// ─── Token refresh state ──────────────────────────────────────────────────────

let isRefreshing = false;
let failedRefreshQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];
const processRefreshQueue = (error: unknown, token: string | null) => {
  failedRefreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!),
  );
  failedRefreshQueue = [];
};

// ─── Force logout ─────────────────────────────────────────────────────────────

const forceLogout = () => {
  useAuthStore.getState().clearSession();
  //   showToast.sessionExpired();
};

// ─── Instance ─────────────────────────────────────────────────────────────────

const privateAxios = createAxiosInstance();

// ─── Request interceptor ──────────────────────────────────────────────────────

privateAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(normalizeError(error)),
);

// ─── Response interceptor ─────────────────────────────────────────────────────

privateAxios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // ── 401 → attempt token refresh ────────────────────────────────────
    const isUnauthorized = error.response?.status === 401;
    const isAlreadyRetried = originalConfig?._retry;

    if (isUnauthorized && !isAlreadyRetried && originalConfig) {
      originalConfig._retry = true;

      // Another refresh already in flight — queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRefreshQueue.push({
            resolve: (token) => {
              originalConfig.headers["token"] = token;
              resolve(privateAxios(originalConfig));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) throw new Error("No refresh token available");

        // Raw axios — bypass this interceptor to avoid infinite loop
        const { default: axios } = await import("axios");
        const { data } = await axios.post<
          ApiResponse<{ token: string; refreshToken: string }>
        >(`${privateAxios.defaults.baseURL}/users/refresh-token`, {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = data.data;

        // Zustand persist writes to MMKV automatically
        useAuthStore
          .getState()
          .setSession(newToken, newRefreshToken, useAuthStore.getState().user!);

        processRefreshQueue(null, newToken);

        originalConfig.headers["token"] = newToken;
        return privateAxios(originalConfig);
      } catch (refreshError) {
        processRefreshQueue(refreshError, null);
        forceLogout();
        return Promise.reject(normalizeError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    // ── All other errors → normalize and reject ────────────────────────
    return Promise.reject(normalizeError(error));
  },
);

// ─── Client interface ─────────────────────────────────────────────────────────

export const privateClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await privateAxios.get<ApiResponse<T>>(url, config);
    return res.data.data;
  },

  post: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const res = await privateAxios.post<ApiResponse<T>>(url, body, config);
    return res.data.data;
  },

  put: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const res = await privateAxios.put<ApiResponse<T>>(url, body, config);
    return res.data.data;
  },

  patch: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const res = await privateAxios.patch<ApiResponse<T>>(url, body, config);
    return res.data.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await privateAxios.delete<ApiResponse<T>>(url, config);
    return res.data.data;
  },
};
