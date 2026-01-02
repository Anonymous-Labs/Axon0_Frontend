/**
 * Type guard utilities for runtime type checking.
 */

/**
 * Type guard to check if a value is an Error instance.
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Type guard to check if a value is an API error with status code.
 */
export function isApiError(error: unknown): error is { message: string; status: number; response?: { data?: unknown } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error &&
    typeof (error as { message: unknown }).message === 'string' &&
    typeof (error as { status: unknown }).status === 'number'
  );
}

/**
 * Type guard to check if a value is an Axios error.
 */
export function isAxiosError(error: unknown): error is {
  response?: { status: number; data?: unknown };
  message: string;
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

/**
 * Type guard to check if a value is a string.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if a value is a number.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard to check if a value is a non-empty string.
 */
export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

/**
 * Type guard to check if a value is a valid email format.
 */
export function isEmail(value: unknown): value is string {
  if (!isString(value)) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Get error message from unknown error type.
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (isApiError(error)) {
    return error.message;
  }
  if (isAxiosError(error)) {
    return error.message || 'Network error occurred';
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

