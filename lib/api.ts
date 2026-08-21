import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/config/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // sends httpOnly cookie on every request
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => config,
    (error: AxiosError) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiErrorResponse>) => {
        return Promise.reject(ApiRequestError.fromAxiosError(error));
    }
);

export default api;

// Shared error response shape
export interface ApiErrorResponse {
    success: false;
    statusCode: number;
    message: string;
    errors: string[] | null;
    data?: unknown;
}

export class ApiRequestError extends Error {
    statusCode?: number;
    errors: string[] | null;
    data: unknown;

    constructor(message: string, response?: ApiErrorResponse) {
        super(message);
        this.name = 'ApiRequestError';
        this.statusCode = response?.statusCode;
        this.errors = response?.errors ?? null;
        this.data = response?.data;
    }

    static fromAxiosError(error: AxiosError<ApiErrorResponse>) {
        const response = error.response?.data;
        const message =
            response?.errors?.[0] ??
            response?.message ??
            error.message ??
            'Something went wrong';

        return new ApiRequestError(message, response);
    }
}
