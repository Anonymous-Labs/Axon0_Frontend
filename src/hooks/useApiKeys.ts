/**
 * Custom hooks for API key operations using React Query.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiKeyService } from '../services/authService';
import { queryKeys } from '../lib/react-query';

/**
 * Hook to fetch all API keys for the current user.
 */
export const useApiKeys = () => {
  return useQuery({
    queryKey: queryKeys.apiKeys.lists(),
    queryFn: () => apiKeyService.getApiKeys(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new API key.
 */
export const useCreateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyData: {
      name: string;
      description?: string;
      permissions: string[];
      expires_at?: string;
    }) => apiKeyService.createApiKey(keyData),
    onSuccess: () => {
      // Invalidate API keys list
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.lists() });
    },
  });
};

/**
 * Hook to delete an API key.
 */
export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: number) => apiKeyService.deleteApiKey(keyId),
    onSuccess: () => {
      // Invalidate API keys list
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.lists() });
    },
  });
};

