import apiClient from './apiClient';
import type { ApiSuccessResponse } from '../types/auth.types';
import type { AnalysisListItem, AnalysisDetail } from '../types/analysis.types';

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createAnalysis(
    resume_id: number,
    job_description_id: number,
): Promise<ApiSuccessResponse<AnalysisDetail>> {
    const res = await apiClient.post<ApiSuccessResponse<AnalysisDetail>>(
        '/api/analyses',
        { resume_id, job_description_id },
    );
    return res.data;
}

// ─── List ─────────────────────────────────────────────────────────────────────
export async function getAnalyses(): Promise<ApiSuccessResponse<AnalysisListItem[]>> {
    const res = await apiClient.get<ApiSuccessResponse<AnalysisListItem[]>>('/api/analyses');
    return res.data;
}

// ─── Detail ───────────────────────────────────────────────────────────────────
export async function getAnalysisById(id: number): Promise<ApiSuccessResponse<AnalysisDetail>> {
    const res = await apiClient.get<ApiSuccessResponse<AnalysisDetail>>(`/api/analyses/${id}`);
    return res.data;
}
