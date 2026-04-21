// Every successful backend response wraps data in this shape
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// Every failed backend response wrap error in this shape
export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string; // e.g "TOKEN_EXPIRED", "PRODUCT_NOT_FOUND"
  error?: Record<string, string>; // field-level validation errors
}

// What our error handler always resolves to - no raw Axios types leak out
export interface NormalizedError {
  message: string; // user-facing message
  code: string; // machine-readable code
  status: number; // HTTP status (0 = network error)
  fieldErrors?: Record<string, string>; // for form validation
  raw?: unknown; // original error, for logging only
}

// Network status types
export type NetworkErrorType =
  | "NETWORK_ERROR" // no internet / DNS fail
  | "TIMEOUT" // request exceeded timeout
  | "SERVER_ERROR" // 5xx
  | "AUTH_ERROR" // 401
  | "FORBIDDEN" // 403
  | "NOT_FOUND" // 404
  | "VALIDATION_ERROR" // 422 / 400 with field errors
  | "CONFLICT" // 409
  | "UNKNOWN";
