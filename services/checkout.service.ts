import { API_ENDPOINTS } from '@/config/api';
import api, { ApiRequestError } from '@/lib/api';
import type {
    ApiResponse,
    CreateOrderData,
    CreateOrderPayload,
    PaymentData,
    PromotionValidationData,
} from '@/types/checkout.types';

function getApiErrorMessage(error: unknown) {
    if (error instanceof ApiRequestError) {
        const dataMessage =
            error.data &&
            typeof error.data === 'object' &&
            'message' in error.data &&
            typeof error.data.message === 'string'
                ? error.data.message
                : null;

        return dataMessage ?? error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Something went wrong';
}

export const checkoutService = {
    async validatePromotion(code: string, cartSubtotal: number) {
        try {
            const response = await api.post<ApiResponse<PromotionValidationData>>(
                API_ENDPOINTS.promotions.query,
                { code, cartSubtotal }
            );
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error));
        }
    },

    createOrder(payload: CreateOrderPayload) {
        return api.post<ApiResponse<CreateOrderData>>(API_ENDPOINTS.orders.base, payload);
    },

    verifyPayment(reference: string) {
        return api.get<ApiResponse<PaymentData>>(API_ENDPOINTS.payments.verify(reference));
    },
};
