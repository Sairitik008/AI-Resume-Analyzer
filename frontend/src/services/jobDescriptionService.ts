import apiClient from './apiClient';
import type { ApiSuccessResponse } from '../types/auth.types';
import type { JobDescription, JobDescriptionDetail } from '../types/jobDescription.types';

// ─── List ─────────────────────────────────────────────────────────────────────
export async function getJobDescriptions(): Promise<ApiSuccessResponse<JobDescription[]>> {
    const res = await apiClient.get<ApiSuccessResponse<JobDescription[]>>('/api/job-descriptions');
    return res.data;
}

// ─── Detail ───────────────────────────────────────────────────────────────────
export async function getJobDescriptionById(id: number): Promise<ApiSuccessResponse<JobDescriptionDetail>> {
    const res = await apiClient.get<ApiSuccessResponse<JobDescriptionDetail>>(`/api/job-descriptions/${id}`);
    return res.data;
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createJobDescription(
    title: string,
    description_text: string,
): Promise<ApiSuccessResponse<JobDescriptionDetail>> {
    const res = await apiClient.post<ApiSuccessResponse<JobDescriptionDetail>>(
        '/api/job-descriptions',
        { title, description_text },
    );
    return res.data;
}

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updateJobDescription(
    id: number,
    title: string,
    description_text: string,
): Promise<ApiSuccessResponse<JobDescriptionDetail>> {
    const res = await apiClient.put<ApiSuccessResponse<JobDescriptionDetail>>(
        `/api/job-descriptions/${id}`,
        { title, description_text },
    );
    return res.data;
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteJobDescription(id: number): Promise<ApiSuccessResponse<null>> {
    const res = await apiClient.delete<ApiSuccessResponse<null>>(`/api/job-descriptions/${id}`);
    return res.data;
}
