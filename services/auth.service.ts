import api from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import type {
    ApiResponse,
    AuthResponseData,
    RegisterResponseData,
    LoginPayload,
    RegisterPayload,
    ForgotPasswordPayload,
    ResetPasswordPayload,
    VerifyEmailPayload,
    UserProfile,
} from '@/types/auth.types';

export const authService = {
    login: (payload: LoginPayload) =>
        api.post<ApiResponse<AuthResponseData>>(
            API_ENDPOINTS.auth.login,
            payload
        ),

    register: (payload: RegisterPayload) =>
        api.post<ApiResponse<RegisterResponseData>>(
            API_ENDPOINTS.auth.register,
            payload
        ),

    logout: () =>
        api.post<ApiResponse<null>>(API_ENDPOINTS.auth.logout, {}),

    forgotPassword: (payload: ForgotPasswordPayload) =>
        api.post<ApiResponse<null>>(
            API_ENDPOINTS.auth.forgotPassword,
            payload
        ),

    resetPassword: (payload: ResetPasswordPayload) =>
        api.post<ApiResponse<null>>(
            API_ENDPOINTS.auth.resetPassword,
            payload
        ),

    verifyEmailPost: (payload: VerifyEmailPayload) =>
        api.post<ApiResponse<{ email: string; emailVerified: boolean }>>(
            API_ENDPOINTS.auth.verifyEmail,
            payload
        ),

    verifyEmailGet: (email: string, token: string) =>
        api.get<ApiResponse<{ email: string; emailVerified: boolean }>>(
            API_ENDPOINTS.auth.verifyEmail,
            { params: { email, token } }
        ),

    getMe: () =>
        api.get<ApiResponse<UserProfile>>(API_ENDPOINTS.users.me),
};