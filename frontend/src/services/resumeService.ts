import apiClient from './apiClient';
import type { ApiSuccessResponse } from '../types/auth.types';
import type { Resume, ResumeDetail } from '../types/resume.types';

export async function uploadResume(
    file: File,
    onUploadProgress?: (percent: number) => void
): Promise<ApiSuccessResponse<Resume>> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post<ApiSuccessResponse<Resume>>('/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
            if (onUploadProgress && evt.total) {
                onUploadProgress(Math.round((evt.loaded * 100) / evt.total));
            }
        },
    });
    return res.data;
}

export async function getResumes(): Promise<ApiSuccessResponse<Resume[]>> {
    const res = await apiClient.get<ApiSuccessResponse<Resume[]>>('/api/resumes');
    return res.data;
}

export async function getResumeById(id: number): Promise<ApiSuccessResponse<ResumeDetail>> {
    const res = await apiClient.get<ApiSuccessResponse<ResumeDetail>>(`/api/resumes/${id}`);
    return res.data;
}
