/**
 * Centralized error handling service for production.
 */
import { isAxiosError, getErrorMessage } from '../utils/typeGuards';
import { config } from '../config/environment';

export interface ErrorInfo {
  message: string;
  code?: string;
  status?: number;
  userFriendly: string;
}

/**
 * Handle and format errors for user display.
 */
export class ErrorService {
  /**
   * Get user-friendly error message from error.
   */
  static getUserFriendlyError(error: unknown): ErrorInfo {
    const errorMessage = getErrorMessage(error);
    
    // Network errors
    if (isAxiosError(error)) {
      if (!error.response) {
        return {
          message: errorMessage,
          code: 'NETWORK_ERROR',
          userFriendly: 'Unable to connect to the server. Please check your internet connection and try again.',
        };
      }
      
      const status = error.response.status;
      
      // Handle specific status codes
      switch (status) {
        case 400:
          return {
            message: errorMessage,
            code: 'VALIDATION_ERROR',
            status,
            userFriendly: error.response.data?.detail || 'Invalid request. Please check your input and try again.',
          };
        case 401:
          return {
            message: errorMessage,
            code: 'UNAUTHORIZED',
            status,
            userFriendly: 'Your session has expired. Please log in again.',
          };
        case 403:
          return {
            message: errorMessage,
            code: 'FORBIDDEN',
            status,
            userFriendly: 'You do not have permission to perform this action.',
          };
        case 404:
          return {
            message: errorMessage,
            code: 'NOT_FOUND',
            status,
            userFriendly: 'The requested resource was not found.',
          };
        case 429:
          return {
            message: errorMessage,
            code: 'RATE_LIMIT',
            status,
            userFriendly: 'Too many requests. Please wait a moment and try again.',
          };
        case 500:
        case 502:
        case 503:
          return {
            message: errorMessage,
            code: 'SERVER_ERROR',
            status,
            userFriendly: 'Server error occurred. Please try again later or contact support if the problem persists.',
          };
        default:
          return {
            message: errorMessage,
            code: 'UNKNOWN_ERROR',
            status,
            userFriendly: 'An unexpected error occurred. Please try again.',
          };
      }
    }
    
    // Generic error
    return {
      message: errorMessage,
      code: 'UNKNOWN_ERROR',
      userFriendly: 'An unexpected error occurred. Please try again.',
    };
  }
  
  /**
   * Log error for monitoring (only in development or if enabled).
   */
  static logError(error: unknown, context?: string): void {
    if (config.enableLogging) {
      const errorInfo = this.getUserFriendlyError(error);
      console.error(`Error${context ? ` in ${context}` : ''}:`, {
        message: errorInfo.message,
        code: errorInfo.code,
        status: errorInfo.status,
      });
    }
  }
  
  /**
   * Show error to user (can be extended with toast notifications).
   */
  static showError(error: unknown, context?: string): string {
    const errorInfo = this.getUserFriendlyError(error);
    this.logError(error, context);
    return errorInfo.userFriendly;
  }
}

