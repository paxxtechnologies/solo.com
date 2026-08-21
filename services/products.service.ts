import { API_ENDPOINTS } from '@/config/api';
import api from '@/lib/api';
import type { Product } from '@/lib/mock-data';
import type {
    ApiResponse,
    PaginatedResponse,
    ProductSortOption,
    PublicProductDetail,
    PublicProductListParams,
    PublicProductSummary,
    PublicProductVariant,
} from '@/types/product.types';

const PLACEHOLDER_IMAGE = '/placeholder.svg';

function buildParams(params: Record<string, string | number | boolean | undefined>) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            searchParams.set(key, String(value));
        }
    });

    return searchParams;
}

function categoryNameToSlug(categoryName: string | null | undefined) {
    return (categoryName ?? '')
        .trim()
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function groupVariants(variants: PublicProductVariant[] | null | undefined): Product['variants'] {
    if (!variants?.length) {
        return [];
    }

    const colorOptions = new Map<string, { id?: string; value: string; stock: number }>();
    const storageOptions = new Map<string, { id?: string; value: string; priceOverride?: number; stock: number }>();

    variants.forEach((variant) => {
        if (variant.color) {
            const existing = colorOptions.get(variant.color);
            colorOptions.set(variant.color, {
                id: variant.id,
                value: variant.color,
                stock: (existing?.stock ?? 0) + variant.stockQty,
            });
        }

        if (variant.storage) {
            const existing = storageOptions.get(variant.storage);
            storageOptions.set(variant.storage, {
                id: variant.id,
                value: variant.storage,
                priceOverride: variant.priceModifier ? variant.priceModifier : undefined,
                stock: (existing?.stock ?? 0) + variant.stockQty,
            });
        }
    });

    return [
        colorOptions.size > 0
            ? { name: 'Color', options: Array.from(colorOptions.values()) }
            : null,
        storageOptions.size > 0
            ? { name: 'Storage', options: Array.from(storageOptions.values()) }
            : null,
    ].filter(Boolean) as Product['variants'];
}

export function mapSummaryToProduct(product: PublicProductSummary): Product {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        images: [product.primaryImageUrl || PLACEHOLDER_IMAGE],
        price: product.activePrice,
        salePrice:
            product.basePrice > product.activePrice ? product.basePrice : undefined,
        brand: product.brand ?? '',
        category: categoryNameToSlug(product.categoryName),
        stockQty: product.stockQty,
        rating: product.averageRating,
        reviewCount: product.reviewCount,
        isBnplEligible: true,
        badges: product.hasActiveFlashDeal ? ['flash'] : [],
    };
}

export function mapDetailToProduct(product: PublicProductDetail): Product {
    const sortedImages = [...(product.images ?? [])].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return a.displayOrder - b.displayOrder;
    });

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        images: sortedImages.length
            ? sortedImages.map((image) => image.imageUrl || PLACEHOLDER_IMAGE)
            : [PLACEHOLDER_IMAGE],
        price: product.activePrice,
        salePrice:
            product.basePrice > product.activePrice ? product.basePrice : undefined,
        brand: product.brand ?? '',
        category: product.categorySlug || categoryNameToSlug(product.categoryName),
        stockQty: product.stockQty,
        rating: product.averageRating,
        reviewCount: product.reviewCount,
        isBnplEligible: true,
        badges: [],
        description: product.description ?? undefined,
        specifications:
            product.specifications?.map((spec) => ({
                key: spec.specKey ?? '',
                value: spec.specValue ?? '',
            })) ?? [],
        variants: groupVariants(product.variants),
    };
}

async function getPagedProducts(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined> = {}
) {
    const response = await api.get<ApiResponse<PaginatedResponse<PublicProductSummary>>>(
        endpoint,
        { params: buildParams(params) }
    );
    return {
        ...response.data.data,
        items: (response.data.data.items ?? []).map(mapSummaryToProduct),
    };
}

export const publicProductsService = {
    list(params: PublicProductListParams = {}) {
        return getPagedProducts(API_ENDPOINTS.products.base, { ...params });
    },

    byCategory(categorySlug: string, params: { limit?: number; offset?: number } = {}) {
        return getPagedProducts(API_ENDPOINTS.products.byCategory(categorySlug), {
            limit: params.limit,
            offset: params.offset,
        });
    },

    search(query: string, params: { Limit?: number; Offset?: number } = {}) {
        return getPagedProducts(API_ENDPOINTS.products.search, {
            Query: query,
            Limit: params.Limit,
            Offset: params.Offset,
        });
    },

    async bySlug(slug: string) {
        const response = await api.get<ApiResponse<PublicProductDetail>>(
            API_ENDPOINTS.products.bySlug(slug)
        );
        return mapDetailToProduct(response.data.data);
    },

    related(slug: string, limit = 8) {
        return getPagedProducts(API_ENDPOINTS.products.related(slug), { limit });
    },

    activeFlashDeals(params: { Limit?: number; Offset?: number } = {}) {
        return getPagedProducts(API_ENDPOINTS.products.activeFlashDeals, params);
    },
};

export const publicProductSort = {
    featured: 0 satisfies ProductSortOption,
    priceAsc: 1 satisfies ProductSortOption,
    priceDesc: 2 satisfies ProductSortOption,
    newest: 3 satisfies ProductSortOption,
};
