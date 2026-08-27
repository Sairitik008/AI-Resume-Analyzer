// ─── Shared API Response Envelopes ──────────────────────────────────────────
export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string>;
}

// ─── Auth Domain Types ───────────────────────────────────────────────────────
export interface User {
    id: number;
    name: string;
    email: string;
}

/** Returned by GET /api/auth/me — includes account creation date */
export interface UserDetail extends User {
    created_at: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };
