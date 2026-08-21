export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string | null;
    data: T;
    errors: string[] | null;
}

export interface PromotionValidationData {
    promotionId: string;
    code: string;
    type: 'percentage' | 'fixed' | 'shipping';
    value: number;
    minCartValue: number;
    cartSubtotal: number;
    discountAmount: number;
    finalAmount: number;
    isValid: boolean;
    message: string;
    expiresAt: string;
}

export interface OrderItemPayload {
    productId: string;
    variantId?: string;
    quantity: number;
}

export interface CreateOrderPayload {
    guestFirstName: string;
    guestLastName: string;
    guestEmail: string;
    guestPhone: string;
    guestStreet: string;
    guestCity: string;
    guestState: string;
    couponCode?: string;
    paymentMethod: string;
    customerNote?: string;
    items: OrderItemPayload[];
}

export interface PaymentData {
    paymentId: string;
    orderId: string;
    transactionRef: string;
    gateway: string;
    status: 'pending' | 'success' | 'failed' | 'cancelled';
    amount: number;
    authorizationUrl: string;
    accessCode: string;
    message: string;
    createdAt: string;
}

export interface CreateOrderData {
    orderId: string;
    orderNumber: string;
    paymentMethod: string;
    paymentStatus: string;
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    totalAmount: number;
    couponCode: string | null;
    payment?: PaymentData | null;
}
