export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const API_ENDPOINTS = {
    auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        google: '/api/auth/google',
        logout: '/api/auth/logout',
        forgotPassword: '/api/auth/forgot-password',
        resetPassword: '/api/auth/reset-password',
        verifyEmail: '/api/auth/verify-email',
    },
    users: {
        me: '/api/users/me',
    },
} as const;