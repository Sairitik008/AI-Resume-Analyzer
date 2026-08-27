// ─── Analysis Domain Types ────────────────────────────────────────────────────

/** Returned by GET /api/analyses (list) */
export interface AnalysisListItem {
    id: number;
    match_score: number;
    created_at: string;
    resume_filename: string;
    jd_title: string;
}

/** Returned by GET /api/analyses/:id (detail) and POST /api/analyses */
export interface AnalysisDetail {
    id: number;
    match_score: number;
    skills_matched: number;
    total_skills: number;
    skills_detected: string[];   // matched skills (names known)
    feedback_text: string;
    recommendations_text: string;
    created_at: string;
    resume_filename: string;
    jd_title: string;
    // ATS parsability fields
    ats_score?: number;
    missing_sections?: string[];
    has_email?: boolean;
    has_phone?: boolean;
    has_dates?: boolean;
    quantification_ratio?: number;
    word_count?: number;
    length_flag?: 'too_short' | 'too_long' | 'ok';
    suggested_resources?: { skill: string; name: string; provider: string; url: string }[];
    improvement_summary?: { priority: number; issue: string; action: string; severity: 'high' | 'medium' | 'low' }[];
}

/** Payload for POST /api/analyses */
export interface CreateAnalysisPayload {
    resume_id: number;
    job_description_id: number;
}
