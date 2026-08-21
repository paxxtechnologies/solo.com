export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string | null;
    data: T;
    errors: string[] | null;
}

export interface PaginatedResponse<T> {
    total: number;
    limit: number;
    offset: number;
    items: T[];
}

export interface AdminCategory {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    imageUrl: string | null;
}

export interface AdminCategoryListResponse {
    items: AdminCategory[];
}

export interface AdminProductListParams {
    Search?: string;
    CategoryId?: string;
    IsActive?: boolean;
    Limit?: number;
    Offset?: number;
}

export interface AdminLowStockProductParams {
    Threshold?: number;
    Limit?: number;
    Offset?: number;
}

export interface AdminProductSummary {
    id: string;
    slug: string;
    name: string;
    brand: string | null;
    model: string | null;
    categoryName: string;
    primaryImageUrl: string | null;
    basePrice: number;
    activePrice: number;
    stockQty: number;
    isActive: boolean;
    isInStock: boolean;
    averageRating: number;
    reviewCount: number;
    popularity: number;
    hasActiveFlashDeal: boolean;
}

export interface AdminProduct {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    brand: string | null;
    model: string | null;
    categoryId: string;
    categoryName: string;
    categorySlug: string;
    basePrice: number;
    activePrice: number;
    stockQty: number;
    isActive: boolean;
    averageRating: number;
    reviewCount: number;
    createdAt: string;
    images: AdminProductImage[];
    variants: AdminProductVariant[];
    specifications: AdminProductSpecification[];
}

export interface AdminProductVariantInput {
    sku?: string;
    color?: string;
    storage?: string;
    priceModifier?: number;
    stockQty?: number;
}

export interface AdminProductVariant extends AdminProductVariantInput {
    id: string;
}

export interface AdminProductImage {
    id: string;
    imageUrl: string;
    publicId: string;
    isPrimary: boolean;
    displayOrder: number;
}

export interface AdminProductSpecificationInput {
    specKey: string;
    specValue: string;
}

export interface AdminProductSpecification extends AdminProductSpecificationInput {
    id: string;
}

export interface CreateAdminProductPayload {
    slug?: string;
    name: string;
    description?: string;
    brand?: string;
    model?: string;
    categoryId: string;
    basePrice: number;
    stockQty: number;
    isActive?: boolean;
    images?: Array<File | Blob>;
    variants?: AdminProductVariantInput[];
    specifications?: AdminProductSpecificationInput[];
}

export interface UpdateAdminProductPayload {
    productId?: string;
    slug?: string;
    name?: string;
    description?: string;
    brand?: string;
    model?: string;
    categoryId?: string;
    basePrice?: number;
    stockQty?: number;
}

export interface UpdateAdminProductStatusPayload {
    productId?: string;
    isActive: boolean;
}

export interface AdminProductStatusResponse {
    productId: string;
    slug: string;
    name: string;
    isActive: boolean;
}

export interface PublicProductListParams {
    CategoryId?: string;
    Brand?: string;
    MinPrice?: number;
    MaxPrice?: number;
    Rating?: number;
    InStock?: boolean;
    SortBy?: ProductSortOption;
    Limit?: number;
    Offset?: number;
}

export type ProductSortOption = 0 | 1 | 2 | 3 | 4;

export interface PublicProductSummary {
    id: string;
    slug: string;
    name: string;
    brand: string | null;
    model: string | null;
    categoryName: string | null;
    primaryImageUrl: string | null;
    basePrice: number;
    activePrice: number;
    stockQty: number;
    isActive: boolean;
    isInStock: boolean;
    averageRating: number;
    reviewCount: number;
    popularity: number;
    hasActiveFlashDeal: boolean;
}

export interface PublicProductImage {
    id: string;
    imageUrl: string | null;
    publicId: string | null;
    isPrimary: boolean;
    displayOrder: number;
}

export interface PublicProductVariant {
    id: string;
    sku: string | null;
    color: string | null;
    storage: string | null;
    priceModifier: number;
    stockQty: number;
}

export interface PublicProductSpecification {
    id: string;
    specKey: string | null;
    specValue: string | null;
}

export interface PublicProductDetail {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    brand: string | null;
    model: string | null;
    categoryId: string;
    categoryName: string | null;
    categorySlug: string | null;
    basePrice: number;
    activePrice: number;
    stockQty: number;
    isActive: boolean;
    averageRating: number;
    reviewCount: number;
    createdAt: string;
    images: PublicProductImage[] | null;
    variants: PublicProductVariant[] | null;
    specifications: PublicProductSpecification[] | null;
}

export interface CreateAdminProductVariantPayload extends AdminProductVariantInput {
    productId?: string;
}

export interface UpdateAdminProductVariantPayload
    extends Partial<AdminProductVariantInput> {
    variantId?: string;
}

export interface DeleteAdminProductVariantResponse {
    productId: string;
    variantId: string;
    sku: string;
}

export interface UploadAdminProductImagesPayload {
    productId?: string;
    files: Array<File | Blob>;
    startingDisplayOrder?: number;
    primaryImageIndex?: number;
}

export interface UploadAdminProductImagesResponse {
    productId: string;
    images: AdminProductImage[];
}

export interface UpdateAdminProductImagePayload {
    imageId?: string;
    isPrimary?: boolean;
    displayOrder?: number;
}

export interface ReplaceAdminProductSpecificationsPayload {
    productId?: string;
    specifications: AdminProductSpecificationInput[];
}

export interface ReplaceAdminProductSpecificationsResponse {
    productId: string;
    specifications: AdminProductSpecification[];
}
