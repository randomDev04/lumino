import axios, { AxiosError } from "axios";
import {
    ApiErrorResponse,
    NetworkErrorType,
    NormalizedError,
} from "./types/api.types";

// ─── Status → type mapping ────────────────────────────────────────────────────

const HTTP_STATUS_MAP: Record<number, NetworkErrorType> = {
  400: "VALIDATION_ERROR",
  401: "AUTH_ERROR",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "VALIDATION_ERROR",
  500: "SERVER_ERROR",
  502: "SERVER_ERROR",
  503: "SERVER_ERROR",
};

// ─── Fallback messages ────────────────────────────────────────────────────────
// Only used when backend doesn't return a message

const FALLBACK_MESSAGES: Record<NetworkErrorType, string> = {
  NETWORK_ERROR: "No internet connection. Please check your network.",
  TIMEOUT: "Request timed out. Please try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  AUTH_ERROR: "Session expired. Please log in again.",
  FORBIDDEN: "You don't have permission to do this.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  CONFLICT: "This action conflicts with existing data.",
  UNKNOWN: "An unexpected error occurred.",
};

// ─── Core classifier ──────────────────────────────────────────────────────────

export const normalizeError = (error: unknown): NormalizedError => {
  // Axios error (has response from server) ──────────────────────────
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Network failure (no response received)
    if (!axiosError.response) {
      const isTimeout = axiosError.code === "ECONNABORTED";
      const type: NetworkErrorType = isTimeout ? "TIMEOUT" : "NETWORK_ERROR";

      return {
        message: FALLBACK_MESSAGES[type],
        code: type,
        status: 0,
        raw: error,
      };
    }

    const { status, data } = axiosError.response;
    const errorType: NetworkErrorType = HTTP_STATUS_MAP[status] ?? "UNKNOWN";

    // Backend returned a structured error body
    const serverMessage = data?.message;
    const serverCode = data?.code ?? errorType;
    const fieldErrors = data?.error;

    return {
      message: serverMessage || FALLBACK_MESSAGES[errorType],
      code: serverCode,
      status,
      ...(fieldErrors ? { fieldErrors } : {}),
      raw: error,
    };
  }

  // ── Non-Axios JS error (throw new Error(...)) ───────────────────────
  if (error instanceof Error) {
    return {
      message: error.message || FALLBACK_MESSAGES.UNKNOWN,
      code: "UNKNOWN",
      status: 0,
      raw: error,
    };
  }

  // ── Unknown throw (string, object, etc.) ────────────────────────────
  return {
    message: FALLBACK_MESSAGES.UNKNOWN,
    code: "UNKNOWN",
    status: 0,
    raw: error,
  };
};

// ─── Guard helpers (used in thunks) ──────────────────────────────────────────

export const isNetworkError = (e: NormalizedError) => e.status === 0;
export const isAuthError = (e: NormalizedError) => e.status === 401;
export const isValidationError = (e: NormalizedError) =>
  e.status === 400 || e.status === 422;
