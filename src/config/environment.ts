/**
 * Environment configuration for the frontend application.
 * 
 * Environment variables should be prefixed with VITE_ to be accessible.
 * Create a .env file in the root directory with your configuration.
 * 
 * Example .env:
 * VITE_API_BASE_URL=http://localhost:8000
 * VITE_ENVIRONMENT=development
 */

interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  enableLogging: boolean;
  appName: string;
  appVersion: string;
}

/**
 * Get application configuration from environment variables.
 * 
 * @returns AppConfig object with all configuration values
 */
const getConfig = (): AppConfig => {
  const env = import.meta.env;

  // Validate required environment variables
  const apiBaseUrl = env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    console.warn(
      'VITE_API_BASE_URL is not set. Using default: http://localhost:8000'
    );
  }

  const environment = (env.VITE_ENVIRONMENT || 'development') as AppConfig['environment'];
  if (!['development', 'staging', 'production'].includes(environment)) {
    console.warn(
      `Invalid VITE_ENVIRONMENT: ${environment}. Using 'development' as default.`
    );
  }

  return {
    apiBaseUrl: apiBaseUrl || 'http://localhost:8000',
    environment: environment === 'development' || environment === 'staging' || environment === 'production'
      ? environment
      : 'development',
    enableLogging: env.VITE_ENABLE_LOGGING === 'true' || environment === 'development',
    appName: env.VITE_APP_NAME || 'AXON Memory System',
    appVersion: env.VITE_APP_VERSION || '0.1.0',
  };
};

/**
 * Application configuration object.
 * Access this throughout the application instead of directly using import.meta.env
 */
export const config = getConfig();

/**
 * Check if the application is running in development mode.
 */
export const isDevelopment = config.environment === 'development';

/**
 * Check if the application is running in production mode.
 */
export const isProduction = config.environment === 'production';

