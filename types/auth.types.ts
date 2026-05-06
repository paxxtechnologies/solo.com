// ── Raw API response wrapper ──────────────────────────────────────────────────
export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string | null;
    data: T;
    errors: string[] | null;
}

// ── Auth data returned on login / register ────────────────────────────────────
export interface AuthResponseData {
    authenticatedUserId: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    name: string | null;
    token: string;
    expiresAt: string;
    isAdmin: boolean;
    referralCode: string;
}

// ── Auth data returned on register ────────────────────────────────────
export type RegisterResponseData = Omit<AuthResponseData, 'token' | 'expiresAt'>;

// ── User profile from GET /api/users/me ───────────────────────────────────────
export interface UserProfile {
    profileUserId: string;
    email: string;
    role: string;
    isAdmin: boolean;
    firstName: string;
    lastName: string;
    name: string | null;
    phoneNumber: string;
    whatsappNumber: string;
    referralCode: string;
    isActive: boolean;
    createdAt: string;
}

// ── Request payloads ──────────────────────────────────────────────────────────
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    whatsappNumber: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    email: string;
    token: string;
    newPassword: string;
}

export interface VerifyEmailPayload {
    email: string;
    token: string;
}

export interface GoogleAuthPayload {
    idToken: string;
}

// ── Zustand store shape ───────────────────────────────────────────────────────
export interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: UserProfile) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
}