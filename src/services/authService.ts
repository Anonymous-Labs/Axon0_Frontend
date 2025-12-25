import axios from 'axios';
import { LoginRequest, SignupRequest, TokenResponse, User } from '../types/auth';

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

export const authService = {
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
    return response.data;
  },

  async signup(userData: SignupRequest): Promise<User> {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  },

  async getCurrentUser(token?: string): Promise<User> {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(`${API_BASE_URL}/auth/me`, { headers });
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
  },
};

export const apiKeyService = {
  async createApiKey(keyData: {
    name: string;
    description?: string;
    permissions: string[];
    expires_at?: string;
  }): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/api/v1/api-keys/`, keyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getApiKeys(): Promise<any[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/v1/api-keys/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async deleteApiKey(keyId: number): Promise<void> {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/api/v1/api-keys/${keyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default authService;
