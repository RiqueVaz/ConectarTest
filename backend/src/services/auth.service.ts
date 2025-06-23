import api from './api';
import { LoginDto, RegisterDto, AuthResponse, User, UpdateUserDto } from '../types/user.types';

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterDto): Promise<User> {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },

  async updateProfile(data: UpdateUserDto): Promise<User> {
    const response = await api.patch<User>('/users/profile', data);
    return response.data;
  },

  async getAllUsers(filters?: { role?: string; sortBy?: string; order?: string }): Promise<User[]> {
    const response = await api.get<User[]>('/users', { params: filters });
    return response.data;
  },

  async getInactiveUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users/inactive');
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};