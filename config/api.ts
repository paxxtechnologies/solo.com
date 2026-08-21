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
    products: {
        base: '/api/products',
        bySlug: (slug: string) => `/api/products/${slug}`,
        search: '/api/products/search',
        related: (slug: string) => `/api/products/${slug}/related`,
        byCategory: (categorySlug: string) => `/api/products/category/${categorySlug}`,
        activeFlashDeals: '/api/products/flash-deals/active',
        byBrand: (brand: string) => `/api/products/brand/${brand}`,
    },
    orders: {
        base: '/api/Orders',
    },
    payments: {
        base: '/api/Payments',
        verify: (reference: string) => `/api/Payments/verify/${encodeURIComponent(reference)}`,
    },
    promotions: {
        query: '/api/Promotions/query',
    },
    admin: {
        categories: {
            base: '/api/admin/categories',
        },
        products: {
            base: '/api/admin/products',
            byId: (id: string) => `/api/admin/products/${id}`,
            status: (id: string) => `/api/admin/products/${id}/status`,
            lowStock: '/api/admin/products/low-stock',
            images: (productId: string) => `/api/admin/products/${productId}/images`,
            imageById: (imageId: string) => `/api/admin/products/images/${imageId}`,
            variants: (productId: string) => `/api/admin/products/${productId}/variants`,
            variantById: (variantId: string) => `/api/admin/products/variants/${variantId}`,
            specifications: (productId: string) =>
                `/api/admin/products/${productId}/specifications`,
        },
    },
} as const;
