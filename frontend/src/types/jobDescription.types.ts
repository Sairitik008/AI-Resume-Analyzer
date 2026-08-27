// ─── Job Description Domain Types ────────────────────────────────────────────

/** Returned by GET /api/job-descriptions (list) */
export interface JobDescription {
    id: number;
    title: string;
    created_at: string;
}

/** Returned by GET /api/job-descriptions/:id (detail) */
export interface JobDescriptionDetail extends JobDescription {
    description_text: string;
}

/** Payload for create / update */
export interface JobDescriptionPayload {
    title: string;
    description_text: string;
}
