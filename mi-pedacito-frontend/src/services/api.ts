import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token a todas las peticiones
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores globalmente
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token inválido o expirado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async register(data: { username: string; email: string; password: string; timezone?: string; location?: { lat: number; lng: number } }) {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateLocation(location: { lat: number; lng: number; timezone?: string }) {
    const response = await this.api.put('/auth/location', location);
    return response.data;
  }

  async getPartner() {
    const response = await this.api.get('/auth/partner');
    return response.data;
  }

  // Photos
  async uploadPhoto(formData: FormData) {
    const response = await this.api.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getAllPhotos(limit = 50, skip = 0) {
    const response = await this.api.get(`/photos?limit=${limit}&skip=${skip}`);
    return response.data;
  }

  async getMemoryLane() {
    const response = await this.api.get('/photos/memory-lane');
    return response.data;
  }

  async deletePhoto(photoId: string) {
    const response = await this.api.delete(`/photos/${photoId}`);
    return response.data;
  }

  // Voice Messages
  async uploadVoiceMessage(formData: FormData) {
    const response = await this.api.post('/voice/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getAllVoiceMessages(limit = 50, skip = 0) {
    const response = await this.api.get(`/voice?limit=${limit}&skip=${skip}`);
    return response.data;
  }

  async getUnplayedMessages() {
    const response = await this.api.get('/voice/unplayed');
    return response.data;
  }

  async markAsPlayed(messageId: string) {
    const response = await this.api.put(`/voice/${messageId}/played`);
    return response.data;
  }

  async deleteVoiceMessage(messageId: string) {
    const response = await this.api.delete(`/voice/${messageId}`);
    return response.data;
  }
}

const apiService = new ApiService();
export default apiService;
