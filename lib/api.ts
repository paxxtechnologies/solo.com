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
        const message =
            error.response?.data?.errors?.[0] ??
            error.response?.data?.message ??
            'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

export default api;

// Shared error response shape
export interface ApiErrorResponse {
    success: false;
    statusCode: number;
    message: string;
    errors: string[] | null;
}