// Resume as returned by GET /api/resumes (list)
export interface Resume {
    id: number;
    original_filename: string;
    created_at: string;
}

// Resume as returned by GET /api/resumes/:id (detail)
export interface ResumeDetail extends Resume {
    extracted_text: string;
}
