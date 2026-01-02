/**
 * Custom hooks for memory operations using React Query.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memoryService } from '../services/memoryService';
import { queryKeys } from '../lib/react-query';
import type { Memory, MemoryCreate, MemoryUpdate, MemorySearch, MemoryStats } from '../types/memory';

/**
 * Hook to fetch all memories for the current user.
 */
export const useMemories = (limit: number = 10, offset: number = 0) => {
  return useQuery({
    queryKey: queryKeys.memories.list({ limit, offset }),
    queryFn: () => memoryService.getMemories(limit, offset),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

/**
 * Hook to fetch a single memory by ID.
 */
export const useMemory = (memoryId: number | null) => {
  return useQuery({
    queryKey: queryKeys.memories.detail(memoryId!),
    queryFn: () => memoryService.getMemory(memoryId!),
    enabled: memoryId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to search memories.
 */
export const useSearchMemories = (searchParams: MemorySearch, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.memories.search(JSON.stringify(searchParams)),
    queryFn: () => memoryService.searchMemories(searchParams),
    enabled: enabled && !!searchParams.query,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get memory statistics.
 */
export const useMemoryStats = () => {
  return useQuery({
    queryKey: queryKeys.memories.stats(),
    queryFn: () => memoryService.getMemoryStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new memory.
 */
export const useCreateMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memoryData: MemoryCreate) => memoryService.createMemory(memoryData),
    onSuccess: () => {
      // Invalidate memory lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.memories.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.memories.stats() });
    },
  });
};

/**
 * Hook to update a memory.
 */
export const useUpdateMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MemoryUpdate }) =>
      memoryService.updateMemory(id, data),
    onSuccess: (data, variables) => {
      // Update the specific memory in cache
      queryClient.setQueryData(queryKeys.memories.detail(variables.id), data);
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.memories.lists() });
    },
  });
};

/**
 * Hook to delete a memory.
 */
export const useDeleteMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memoryId: number) => memoryService.deleteMemory(memoryId),
    onSuccess: (_, memoryId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.memories.detail(memoryId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.memories.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.memories.stats() });
    },
  });
};

