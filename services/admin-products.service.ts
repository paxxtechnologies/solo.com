import api from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import type {
    AdminLowStockProductParams,
    AdminCategoryListResponse,
    AdminProduct,
    AdminProductImage,
    AdminProductListParams,
    AdminProductStatusResponse,
    AdminProductSummary,
    ApiResponse,
    CreateAdminProductPayload,
    CreateAdminProductVariantPayload,
    DeleteAdminProductVariantResponse,
    PaginatedResponse,
    ReplaceAdminProductSpecificationsPayload,
    ReplaceAdminProductSpecificationsResponse,
    UpdateAdminProductImagePayload,
    UpdateAdminProductPayload,
    UpdateAdminProductStatusPayload,
    UpdateAdminProductVariantPayload,
    UploadAdminProductImagesPayload,
    UploadAdminProductImagesResponse,
    AdminProductVariant,
} from '@/types/product.types';

const multipartHeaders = {
    headers: { 'Content-Type': 'multipart/form-data' },
};

function appendIfDefined(formData: FormData, key: string, value: unknown) {
    if (value === undefined || value === null) {
        return;
    }

    if (value instanceof Blob) {
        formData.append(key, value);
        return;
    }

    formData.append(key, String(value));
}

function createProductFormData(payload: CreateAdminProductPayload | FormData) {
    if (payload instanceof FormData) {
        return payload;
    }

    const formData = new FormData();

    appendIfDefined(formData, 'Slug', payload.slug);
    appendIfDefined(formData, 'Name', payload.name);
    appendIfDefined(formData, 'Description', payload.description);
    appendIfDefined(formData, 'Brand', payload.brand);
    appendIfDefined(formData, 'Model', payload.model);
    appendIfDefined(formData, 'CategoryId', payload.categoryId);
    appendIfDefined(formData, 'BasePrice', payload.basePrice);
    appendIfDefined(formData, 'StockQty', payload.stockQty);
    appendIfDefined(formData, 'IsActive', payload.isActive);

    payload.images?.forEach((image) => {
        formData.append('Images', image);
    });

    payload.variants?.forEach((variant, index) => {
        appendIfDefined(formData, `Variants[${index}].Sku`, variant.sku);
        appendIfDefined(formData, `Variants[${index}].Color`, variant.color);
        appendIfDefined(formData, `Variants[${index}].Storage`, variant.storage);
        appendIfDefined(
            formData,
            `Variants[${index}].PriceModifier`,
            variant.priceModifier
        );
        appendIfDefined(formData, `Variants[${index}].StockQty`, variant.stockQty);
    });

    payload.specifications?.forEach((specification, index) => {
        appendIfDefined(
            formData,
            `Specifications[${index}].SpecKey`,
            specification.specKey
        );
        appendIfDefined(
            formData,
            `Specifications[${index}].SpecValue`,
            specification.specValue
        );
    });

    return formData;
}

function createImagesFormData(
    productId: string,
    payload: UploadAdminProductImagesPayload | FormData
) {
    if (payload instanceof FormData) {
        return payload;
    }

    const formData = new FormData();

    appendIfDefined(formData, 'ProductId', payload.productId ?? productId);
    appendIfDefined(formData, 'StartingDisplayOrder', payload.startingDisplayOrder);
    appendIfDefined(formData, 'PrimaryImageIndex', payload.primaryImageIndex);

    payload.files.forEach((file) => {
        formData.append('Files', file);
    });

    return formData;
}

export const adminProductsService = {
    listCategories: () =>
        api.get<ApiResponse<AdminCategoryListResponse>>(
            API_ENDPOINTS.admin.categories.base
        ),

    list: (params?: AdminProductListParams) =>
        api.get<ApiResponse<PaginatedResponse<AdminProductSummary>>>(
            API_ENDPOINTS.admin.products.base,
            { params }
        ),

    getById: (id: string) =>
        api.get<ApiResponse<AdminProduct>>(API_ENDPOINTS.admin.products.byId(id)),

    create: (payload: CreateAdminProductPayload | FormData) =>
        api.post<ApiResponse<AdminProduct>>(
            API_ENDPOINTS.admin.products.base,
            createProductFormData(payload),
            multipartHeaders
        ),

    update: (id: string, payload: UpdateAdminProductPayload) =>
        api.patch<ApiResponse<AdminProduct>>(API_ENDPOINTS.admin.products.byId(id), {
            ...payload,
            productId: payload.productId ?? id,
        }),

    updateStatus: (id: string, payload: UpdateAdminProductStatusPayload) =>
        api.patch<ApiResponse<AdminProductStatusResponse>>(
            API_ENDPOINTS.admin.products.status(id),
            {
                ...payload,
                productId: payload.productId ?? id,
            }
        ),

    delete: (id: string) =>
        api.delete<ApiResponse<AdminProductStatusResponse>>(
            API_ENDPOINTS.admin.products.byId(id)
        ),

    lowStock: (params?: AdminLowStockProductParams) =>
        api.get<ApiResponse<PaginatedResponse<AdminProductSummary>>>(
            API_ENDPOINTS.admin.products.lowStock,
            { params }
        ),

    createVariant: (productId: string, payload: CreateAdminProductVariantPayload) =>
        api.post<ApiResponse<AdminProductVariant>>(
            API_ENDPOINTS.admin.products.variants(productId),
            {
                ...payload,
                productId: payload.productId ?? productId,
            }
        ),

    updateVariant: (variantId: string, payload: UpdateAdminProductVariantPayload) =>
        api.patch<ApiResponse<AdminProductVariant>>(
            API_ENDPOINTS.admin.products.variantById(variantId),
            {
                ...payload,
                variantId: payload.variantId ?? variantId,
            }
        ),

    deleteVariant: (variantId: string) =>
        api.delete<ApiResponse<DeleteAdminProductVariantResponse>>(
            API_ENDPOINTS.admin.products.variantById(variantId)
        ),

    uploadImages: (
        productId: string,
        payload: UploadAdminProductImagesPayload | FormData
    ) =>
        api.post<ApiResponse<UploadAdminProductImagesResponse>>(
            API_ENDPOINTS.admin.products.images(productId),
            createImagesFormData(productId, payload),
            multipartHeaders
        ),

    updateImage: (imageId: string, payload: UpdateAdminProductImagePayload) =>
        api.patch<ApiResponse<AdminProductImage>>(
            API_ENDPOINTS.admin.products.imageById(imageId),
            {
                ...payload,
                imageId: payload.imageId ?? imageId,
            }
        ),

    deleteImage: (imageId: string) =>
        api.delete<ApiResponse<UploadAdminProductImagesResponse>>(
            API_ENDPOINTS.admin.products.imageById(imageId)
        ),

    replaceSpecifications: (
        productId: string,
        payload: ReplaceAdminProductSpecificationsPayload
    ) =>
        api.put<ApiResponse<ReplaceAdminProductSpecificationsResponse>>(
            API_ENDPOINTS.admin.products.specifications(productId),
            {
                ...payload,
                productId: payload.productId ?? productId,
            }
        ),
};
