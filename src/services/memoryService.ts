import axios from 'axios';
import { Memory, MemoryCreate, MemoryUpdate, MemorySearch, MemorySearchResponse, MemoryStats, FeedbackCreate, Feedback } from '../types/memory';
import { config } from '../config/environment';
import { ErrorService } from './errorService';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Unauthorized (token expired)
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const memoryService = {
  async createMemory(memoryData: MemoryCreate): Promise<Memory> {
    try {
      const response = await api.post('/api/v1/memories/', memoryData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = ErrorService.showError(error, 'createMemory');
      throw new Error(errorMessage);
    }
  },

  async getMemory(memoryId: number): Promise<Memory> {
    try {
      const response = await api.get(`/api/v1/memories/${memoryId}`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = ErrorService.showError(error, 'getMemory');
      throw new Error(errorMessage);
    }
  },

  async updateMemory(memoryId: number, memoryData: MemoryUpdate): Promise<Memory> {
    try {
      const response = await api.put(`/api/v1/memories/${memoryId}`, memoryData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = ErrorService.showError(error, 'updateMemory');
      throw new Error(errorMessage);
    }
  },

  async deleteMemory(memoryId: number): Promise<void> {
    try {
      await api.delete(`/api/v1/memories/${memoryId}`);
    } catch (error: unknown) {
      const errorMessage = ErrorService.showError(error, 'deleteMemory');
      throw new Error(errorMessage);
    }
  },

  async getMemories(limit: number = 10, offset: number = 0): Promise<Memory[]> {
    try {
      const response = await api.get('/api/v1/memories/', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error: unknown) {
      const errorMessage = ErrorService.showError(error, 'getMemories');
      throw new Error(errorMessage);
    }
  },

  async searchMemories(searchData: MemorySearch): Promise<MemorySearchResponse> {
    try {
      const response = await api.post('/api/v1/memories/search', searchData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = ErrorService.showError(error, 'searchMemories');
      throw new Error(errorMessage);
    }
  },

  async addFeedback(memoryId: number, feedbackData: FeedbackCreate): Promise<Feedback> {
    try {
      const response = await api.post(`/api/v1/memories/${memoryId}/feedback`, feedbackData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = ErrorService.showError(error, 'addFeedback');
      throw new Error(errorMessage);
    }
  },

  async getMemoryStats(): Promise<MemoryStats> {
    try {
      const response = await api.get('/api/v1/memories/stats/overview');
      return response.data;
    } catch (error: unknown) {
      const errorMessage = ErrorService.showError(error, 'getMemoryStats');
      throw new Error(errorMessage);
    }
  },
};

export default memoryService;
