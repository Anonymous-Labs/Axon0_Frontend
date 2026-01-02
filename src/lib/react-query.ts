/**
 * React Query configuration and setup.
 */
import { QueryClient } from '@tanstack/react-query';
import { config } from '../config/environment';

/**
 * Configured React Query client with default options.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Query keys factory for consistent cache key management.
 */
export const queryKeys = {
  memories: {
    all: ['memories'] as const,
    lists: () => [...queryKeys.memories.all, 'list'] as const,
    list: (filters: { limit?: number; offset?: number }) =>
      [...queryKeys.memories.lists(), filters] as const,
    details: () => [...queryKeys.memories.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.memories.details(), id] as const,
    search: (query: string) => [...queryKeys.memories.all, 'search', query] as const,
    stats: () => [...queryKeys.memories.all, 'stats'] as const,
  },
  apiKeys: {
    all: ['apiKeys'] as const,
    lists: () => [...queryKeys.apiKeys.all, 'list'] as const,
  },
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
} as const;

