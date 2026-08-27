import apiClient from './apiClient';
import type { ApiSuccessResponse, AuthResponse, LoginPayload, RegisterPayload, UserDetail } from '../types/auth.types';

export async function loginUser(payload: LoginPayload): Promise<ApiSuccessResponse<AuthResponse>> {
    const res = await apiClient.post<ApiSuccessResponse<AuthResponse>>('/api/auth/login', payload);
    return res.data;
}

export async function registerUser(payload: RegisterPayload): Promise<ApiSuccessResponse<{ message: string }>> {
    const res = await apiClient.post<ApiSuccessResponse<{ message: string }>>('/api/auth/register', payload);
    return res.data;
}

export async function getMe(): Promise<ApiSuccessResponse<UserDetail>> {
    const res = await apiClient.get<ApiSuccessResponse<UserDetail>>('/api/auth/me');
    return res.data;
}
