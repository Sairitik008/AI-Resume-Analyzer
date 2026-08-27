import apiClient from './apiClient';
import type { ApiSuccessResponse } from '../types/auth.types';
import type { DashboardSummary } from '../types/dashboard.types';

export async function getDashboardSummary(): Promise<ApiSuccessResponse<DashboardSummary>> {
    const res = await apiClient.get<ApiSuccessResponse<DashboardSummary>>('/api/dashboard/summary');
    return res.data;
}
