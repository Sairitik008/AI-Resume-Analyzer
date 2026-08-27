// ─── Dashboard Domain Types ───────────────────────────────────────────────────

export interface MostRecentAnalysis {
    id: number;
    match_score: number;
    created_at: string;
    jd_title: string;
    resume_filename: string;
}

export interface DashboardSummary {
    total_resumes: number;
    total_job_descriptions: number;
    total_analyses: number;
    average_match_score: number | null;
    most_recent_analysis: MostRecentAnalysis | null;
}
