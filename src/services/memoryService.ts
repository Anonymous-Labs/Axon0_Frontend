import axios from 'axios';
import { Memory, MemoryCreate, MemoryUpdate, MemorySearch, MemorySearchResponse, MemoryStats, FeedbackCreate, Feedback } from '../types/memory';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const memoryService = {
  async createMemory(memoryData: MemoryCreate): Promise<Memory> {
    try {
      console.log('Making API call to create memory:', memoryData);
      const response = await api.post('/api/v1/memories/', memoryData);
      console.log('Memory created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create memory:', error);
      throw error;
    }
  },

  async getMemory(memoryId: number): Promise<Memory> {
    try {
      const response = await api.get(`/api/v1/memories/${memoryId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get memory:', error);
      throw error;
    }
  },

  async updateMemory(memoryId: number, memoryData: MemoryUpdate): Promise<Memory> {
    try {
      const response = await api.put(`/api/v1/memories/${memoryId}`, memoryData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update memory:', error);
      throw error;
    }
  },

  async deleteMemory(memoryId: number): Promise<void> {
    try {
      await api.delete(`/api/v1/memories/${memoryId}`);
    } catch (error: any) {
      console.error('Failed to delete memory:', error);
      throw error;
    }
  },

  async getMemories(limit: number = 10, offset: number = 0): Promise<Memory[]> {
    try {
      const response = await api.get('/api/v1/memories/', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to get memories:', error);
      throw error;
    }
  },

  async searchMemories(searchData: MemorySearch): Promise<MemorySearchResponse> {
    try {
      const response = await api.post('/api/v1/memories/search', searchData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to search memories:', error);
      throw error;
    }
  },

  async addFeedback(memoryId: number, feedbackData: FeedbackCreate): Promise<Feedback> {
    try {
      const response = await api.post(`/api/v1/memories/${memoryId}/feedback`, feedbackData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to add feedback:', error);
      throw error;
    }
  },

  async getMemoryStats(): Promise<MemoryStats> {
    try {
      const response = await api.get('/api/v1/memories/stats/overview');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get memory stats:', error);
      throw error;
    }
  },
};

export default memoryService;
