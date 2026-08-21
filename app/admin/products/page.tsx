"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  X,
  Upload,
  Save,
  Power,
} from "lucide-react";
import { products as mockProducts } from "@/lib/mock-data";
import { adminProductsService } from "@/services/admin-products.service";
import type {
  AdminProduct,
  AdminProductSummary,
  AdminProductVariant,
  AdminProductVariantInput,
  UpdateAdminProductPayload,
} from "@/types/product.types";

type SortField = "name" | "price" | "stock" | "created";
type SortOrder = "asc" | "desc";
type EditTab = "details" | "images" | "variants" | "specs";

interface EditProductFormState {
  slug: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  categoryId: string;
  basePrice: string;
  stockQty: string;
}

interface VariantDraftState {
  sku: string;
  color: string;
  storage: string;
  priceModifier: string;
  stockQty: string;
}

interface SpecDraftState {
  id?: string;
  specKey: string;
  specValue: string;
}

const emptyVariantDraft: VariantDraftState = {
  sku: "",
  color: "",
  storage: "",
  priceModifier: "",
  stockQty: "",
};

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("created");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EditTab>("details");
  const [detailForm, setDetailForm] = useState<EditProductFormState>({
    slug: "",
    name: "",
    description: "",
    brand: "",
    model: "",
    categoryId: "",
    basePrice: "",
    stockQty: "",
  });
  const [detailError, setDetailError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [variantDraft, setVariantDraft] = useState<VariantDraftState>(emptyVariantDraft);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusModalProduct, setStatusModalProduct] = useState<AdminProductSummary | null>(null);
  const [statusDraft, setStatusDraft] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [variantError, setVariantError] = useState<string | null>(null);
  const [specRows, setSpecRows] = useState<SpecDraftState[]>([{ specKey: "", specValue: "" }]);
  const [specError, setSpecError] = useState<string | null>(null);

  const itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminProductsService.listCategories().then((res) => res.data.data.items),
  });

  const productsQuery = useQuery({
    queryKey: ["admin-products", searchQuery, categoryFilter, currentPage],
    queryFn: () =>
      adminProductsService
        .list({
          Search: searchQuery || undefined,
          CategoryId: categoryFilter === "all" ? undefined : categoryFilter,
          Limit: itemsPerPage,
          Offset: offset,
        })
        .then((res) => res.data.data),
    retry: 1,
  });

  const editProductQuery = useQuery({
    queryKey: ["admin-product", editingProductId],
    queryFn: () => adminProductsService.getById(editingProductId!).then((res) => res.data.data),
    enabled: Boolean(isEditModalOpen && editingProductId),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => adminProductsService.delete(id),
    onSuccess: () => {
      setSelectedProducts([]);
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminProductsService.updateStatus(id, { isActive }),
    onSuccess: () => {
      setIsStatusModalOpen(false);
      setStatusModalProduct(null);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: (payload: UpdateAdminProductPayload) =>
      adminProductsService.update(editingProductId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product", editingProductId] });
      setDetailError(null);
      closeEditModal();
    },
  });

  const uploadImagesMutation = useMutation({
    mutationFn: (files: File[]) =>
      adminProductsService.uploadImages(editingProductId!, {
        productId: editingProductId!,
        files,
        primaryImageIndex: 0,
        startingDisplayOrder: 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-product", editingProductId] });
      setImageFiles([]);
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: ({ imageId, isPrimary, displayOrder }: { imageId: string; isPrimary?: boolean; displayOrder?: number }) =>
      adminProductsService.updateImage(imageId, { imageId, isPrimary, displayOrder }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-product", editingProductId] });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) => adminProductsService.deleteImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-product", editingProductId] });
    },
  });

  const saveVariantMutation = useMutation({
    mutationFn: (payload: AdminProductVariantInput) =>
      editingVariantId
        ? adminProductsService.updateVariant(editingVariantId, {
            variantId: editingVariantId,
            ...payload,
          })
        : adminProductsService.createVariant(editingProductId!, {
            productId: editingProductId!,
            ...payload,
          }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-product", editingProductId] });
      setVariantDraft(emptyVariantDraft);
      setEditingVariantId(null);
      setVariantError(null);
    },
  });

  const deleteVariantMutation = useMutation({
    mutationFn: (variantId: string) => adminProductsService.deleteVariant(variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-product", editingProductId] });
    },
  });

  const replaceSpecificationsMutation = useMutation({
    mutationFn: (payload: { specifications: Array<{ specKey: string; specValue: string }> }) =>
      adminProductsService.replaceSpecifications(editingProductId!, {
        productId: editingProductId!,
        specifications: payload.specifications,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-product", editingProductId] });
      setSpecError(null);
    },
  });

  const apiProducts = productsQuery.data?.items ?? [];
  const usingApiProducts = productsQuery.isSuccess;

  const fallbackProducts = useMemo(
    () =>
      mockProducts.map<AdminProductSummary>((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        model: null,
        categoryName: product.category,
        primaryImageUrl: product.images[0] ?? "/placeholder.svg",
        basePrice: product.price,
        activePrice: product.salePrice ?? product.price,
        stockQty: product.stockQty,
        isActive: true,
        isInStock: product.stockQty > 0,
        averageRating: product.rating,
        reviewCount: product.reviewCount,
        popularity: product.reviewCount,
        hasActiveFlashDeal: product.badges?.includes("flash") ?? false,
      })),
    []
  );

  const filteredFallbackProducts = fallbackProducts
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.model ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || product.categoryName === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.activePrice - b.activePrice;
          break;
        case "stock":
          comparison = a.stockQty - b.stockQty;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const sortedApiProducts = [...apiProducts].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "price":
        comparison = a.activePrice - b.activePrice;
        break;
      case "stock":
        comparison = a.stockQty - b.stockQty;
        break;
      default:
        comparison = 0;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const paginatedProducts = usingApiProducts
    ? sortedApiProducts
    : filteredFallbackProducts.slice(offset, currentPage * itemsPerPage);
  const totalProducts = usingApiProducts
    ? productsQuery.data.total
    : filteredFallbackProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage));
  const categories = [
    { value: "all", label: "All Categories" },
    ...(categoriesQuery.data?.map((category) => ({
      value: category.id,
      label: category.name,
    })) ??
      [...new Set(mockProducts.map((p) => p.category))].map((category) => ({
        value: category,
        label: category,
      }))),
  ];

  useEffect(() => {
    if (!editProductQuery.data) {
      return;
    }

    const product = editProductQuery.data as AdminProduct;
    setDetailForm({
      slug: product.slug ?? "",
      name: product.name ?? "",
      description: product.description ?? "",
      brand: product.brand ?? "",
      model: product.model ?? "",
      categoryId: product.categoryId ?? "",
      basePrice: product.basePrice?.toString() ?? "",
      stockQty: product.stockQty?.toString() ?? "",
    });
    setSpecRows(
      product.specifications?.length
        ? product.specifications.map((spec) => ({
            id: spec.id,
            specKey: spec.specKey ?? "",
            specValue: spec.specValue ?? "",
          }))
        : [{ specKey: "", specValue: "" }]
    );
    setVariantDraft(emptyVariantDraft);
    setEditingVariantId(null);
  }, [editProductQuery.data]);

  const toggleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleDeleteProduct = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (!deleteTargetId) {
      return;
    }

    if (usingApiProducts) {
      deleteProductMutation.mutate(deleteTargetId);
      return;
    }

    setSelectedProducts((prev) => prev.filter((productId) => productId !== deleteTargetId));
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleToggleStatus = (product: AdminProductSummary) => {
    if (!usingApiProducts) {
      return;
    }

    setStatusModalProduct(product);
    setStatusDraft(product.isActive);
    setIsStatusModalOpen(true);
  };

  const confirmStatusChange = () => {
    if (!statusModalProduct) {
      return;
    }

    statusMutation.mutate({ id: statusModalProduct.id, isActive: statusDraft });
  };

  const openEditModal = (product: AdminProductSummary) => {
    setEditingProductId(product.id);
    setIsEditModalOpen(true);
    setActiveTab("details");
    setDetailError(null);
    setVariantError(null);
    setSpecError(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProductId(null);
    setActiveTab("details");
    setDetailForm({
      slug: "",
      name: "",
      description: "",
      brand: "",
      model: "",
      categoryId: "",
      basePrice: "",
      stockQty: "",
    });
    setImageFiles([]);
    setVariantDraft(emptyVariantDraft);
    setEditingVariantId(null);
    setSpecRows([{ specKey: "", specValue: "" }]);
  };

  const handleSaveDetails = async () => {
    if (!editingProductId) {
      return;
    }

    const basePrice = Number(detailForm.basePrice);
    const stockQty = Number(detailForm.stockQty);

    if (!detailForm.name || !detailForm.categoryId || Number.isNaN(basePrice) || Number.isNaN(stockQty)) {
      setDetailError("Name, category, price, and stock are required.");
      return;
    }

    const payload: UpdateAdminProductPayload = {
      productId: editingProductId,
      slug: detailForm.slug || undefined,
      name: detailForm.name,
      description: detailForm.description || undefined,
      brand: detailForm.brand || undefined,
      model: detailForm.model || undefined,
      categoryId: detailForm.categoryId,
      basePrice,
      stockQty,
    };

    try {
      await updateProductMutation.mutateAsync(payload);
      setDetailError(null);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "Unable to save the product details.");
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || !editingProductId) {
      return;
    }

    setImageFiles(files);
    try {
      await uploadImagesMutation.mutateAsync(files);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "Unable to upload images.");
    } finally {
      event.target.value = "";
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!editingProductId) {
      return;
    }

    try {
      await updateImageMutation.mutateAsync({ imageId, isPrimary: true });
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "Unable to update the image.");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!editingProductId) {
      return;
    }

    try {
      await deleteImageMutation.mutateAsync(imageId);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "Unable to delete the image.");
    }
  };

  const handleVariantSave = async () => {
    if (!editingProductId) {
      return;
    }

    const payload: AdminProductVariantInput = {
      sku: variantDraft.sku,
      color: variantDraft.color,
      storage: variantDraft.storage,
      priceModifier: Number(variantDraft.priceModifier) || 0,
      stockQty: Number(variantDraft.stockQty) || 0,
    };

    if (!payload.sku && !payload.color && !payload.storage && !payload.stockQty) {
      setVariantError("Add at least one variant field before saving.");
      return;
    }

    try {
      await saveVariantMutation.mutateAsync(payload);
    } catch (error) {
      setVariantError(error instanceof Error ? error.message : "Unable to save the variant.");
    }
  };

  const startEditVariant = (variant: AdminProductVariant) => {
    setEditingVariantId(variant.id);
    setVariantDraft({
      sku: variant.sku ?? "",
      color: variant.color ?? "",
      storage: variant.storage ?? "",
      priceModifier: (variant.priceModifier ?? 0).toString(),
      stockQty: (variant.stockQty ?? 0).toString(),
    });
    setVariantError(null);
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!editingProductId) {
      return;
    }

    try {
      await deleteVariantMutation.mutateAsync(variantId);
    } catch (error) {
      setVariantError(error instanceof Error ? error.message : "Unable to delete the variant.");
    }
  };

  const handleSaveSpecifications = async () => {
    if (!editingProductId) {
      return;
    }

    const normalized = specRows
      .filter((spec) => spec.specKey.trim() && spec.specValue.trim())
      .map((spec) => ({ specKey: spec.specKey.trim(), specValue: spec.specValue.trim() }));

    try {
      await replaceSpecificationsMutation.mutateAsync({ specifications: normalized });
    } catch (error) {
      setSpecError(error instanceof Error ? error.message : "Unable to save specifications.");
    }
  };

  const categoryOptions =
    categoriesQuery.data?.map((item) => ({ value: item.id, label: item.name })) ??
    [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Products</h1>
          <p className="text-muted">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            id="product-search"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Search products"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <label htmlFor="category-filter" className="sr-only">
              Filter by category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-12 pr-10 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <label htmlFor="sort-products" className="sr-only">
            Sort products
          </label>
          <select
            id="sort-products"
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortField(field as SortField);
              setSortOrder(order as SortOrder);
            }}
            className="px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="created-desc">Newest First</option>
            <option value="created-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
            <option value="stock-asc">Stock Low-High</option>
            <option value="stock-desc">Stock High-Low</option>
          </select>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium text-foreground">
            {selectedProducts.length} selected
          </span>
          <button type="button" className="text-sm text-primary hover:underline">
            Edit Selected
          </button>
          <button type="button" className="text-sm text-error hover:underline">
            Delete Selected
          </button>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="w-12 px-5 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === paginatedProducts.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    aria-label="Select all products"
                  />
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Product
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Category
                </th>
                <th className="text-right text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Price
                </th>
                <th className="text-right text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Stock
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="w-24 px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-surface-alt">
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      aria-label={`Select ${product.name}`}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.primaryImageUrl ?? "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted">{product.brand ?? "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 bg-surface-alt text-foreground text-xs font-medium rounded">
                      {product.categoryName}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div>
                      <p className="font-semibold text-foreground">{formatPrice(product.activePrice)}</p>
                      {product.activePrice !== product.basePrice && (
                        <p className="text-xs text-muted line-through">{formatPrice(product.basePrice)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={`font-medium ${
                        product.stockQty < 10
                          ? "text-error"
                          : product.stockQty < 50
                            ? "text-warning"
                            : "text-success"
                      }`}
                    >
                      {product.stockQty}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(product)}
                      disabled={!usingApiProducts || statusMutation.isPending}
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        product.isActive
                          ? product.stockQty > 0
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : "bg-warning/10 text-warning hover:bg-warning/20"
                          : "bg-error/10 text-error hover:bg-error/20"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                      aria-label={`Toggle status for ${product.name}`}
                    >
                      {product.isActive
                        ? product.stockQty > 0
                          ? "In Stock"
                          : "Out of Stock"
                        : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        className="p-2 text-muted hover:text-foreground hover:bg-surface-alt rounded-lg transition-colors"
                        aria-label={`Preview ${product.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        className="p-2 text-muted hover:text-foreground hover:bg-surface-alt rounded-lg transition-colors"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(product)}
                        disabled={!usingApiProducts || statusMutation.isPending}
                        className="p-2 text-muted hover:text-foreground hover:bg-surface-alt rounded-lg transition-colors disabled:opacity-50"
                        aria-label={`Update status for ${product.name}`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={usingApiProducts && deleteProductMutation.isPending}
                        className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-5 border-t border-border">
          <p className="text-sm text-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-border rounded-lg hover:bg-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Show previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "border border-border hover:bg-surface-alt text-foreground"
                  }`}
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-border rounded-lg hover:bg-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Show next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {productsQuery.isLoading && (
        <div className="bg-surface rounded-xl border border-border p-6 text-center text-muted">
          Loading products...
        </div>
      )}

      {!productsQuery.isLoading && totalProducts === 0 && (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <Package className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">No products found</h2>
          <p className="text-muted mb-6">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {isStatusModalOpen && statusModalProduct && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground">Update product status</h3>
            <p className="mt-2 text-sm text-muted">
              Choose whether {statusModalProduct.name} is currently active for customers.
            </p>
            <div className="mt-6 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3">
                <input
                  type="radio"
                  checked={statusDraft}
                  onChange={() => setStatusDraft(true)}
                  className="h-4 w-4 border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">Active</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3">
                <input
                  type="radio"
                  checked={!statusDraft}
                  onChange={() => setStatusDraft(false)}
                  className="h-4 w-4 border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">Inactive</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setStatusModalProduct(null);
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-alt"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStatusChange}
                disabled={statusMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && deleteTargetId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground">Delete product</h3>
            <p className="mt-2 text-sm text-muted">
              Deactivate this product? This action can be reversed later from the status toggle.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteTargetId(null);
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-alt"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                disabled={deleteProductMutation.isPending}
                className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white hover:bg-error/90 disabled:opacity-60"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4">
          <div className="w-full max-w-6xl rounded-xl border border-border bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Edit Product</h2>
                <p className="text-sm text-muted">Update the core details and nested content for this product.</p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg p-2 text-muted hover:bg-surface-alt hover:text-foreground"
                aria-label="Close edit modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-border px-6 py-4">
              {[
                { key: "details", label: "Details" },
                { key: "images", label: "Images" },
                { key: "variants", label: "Variants" },
                { key: "specs", label: "Specs" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as EditTab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-primary text-white"
                      : "bg-surface-alt text-foreground hover:bg-border"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="px-6 py-6">
              {editProductQuery.isLoading && (
                <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted">
                  Loading product details...
                </div>
              )}

              {!editProductQuery.isLoading && activeTab === "details" && (
                <div className="space-y-5">
                  {detailError && <p className="rounded-lg bg-error/10 p-3 text-sm text-error">{detailError}</p>}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="edit-product-name" className="mb-2 block text-sm font-medium text-foreground">
                        Product Name
                      </label>
                      <input
                        id="edit-product-name"
                        type="text"
                        value={detailForm.name}
                        onChange={(e) => setDetailForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-product-slug" className="mb-2 block text-sm font-medium text-foreground">
                        Slug
                      </label>
                      <input
                        id="edit-product-slug"
                        type="text"
                        value={detailForm.slug}
                        onChange={(e) => setDetailForm((prev) => ({ ...prev, slug: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-product-category" className="mb-2 block text-sm font-medium text-foreground">
                        Category
                      </label>
                      <select
                        id="edit-product-category"
                        value={detailForm.categoryId}
                        onChange={(e) => setDetailForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                      >
                        <option value="">Select a category</option>
                        {categoryOptions.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="edit-product-brand" className="mb-2 block text-sm font-medium text-foreground">
                        Brand
                      </label>
                      <input
                        id="edit-product-brand"
                        type="text"
                        value={detailForm.brand}
                        onChange={(e) => setDetailForm((prev) => ({ ...prev, brand: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-product-model" className="mb-2 block text-sm font-medium text-foreground">
                        Model
                      </label>
                      <input
                        id="edit-product-model"
                        type="text"
                        value={detailForm.model}
                        onChange={(e) => setDetailForm((prev) => ({ ...prev, model: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-product-base-price" className="mb-2 block text-sm font-medium text-foreground">
                        Base Price
                      </label>
                      <input
                        id="edit-product-base-price"
                        type="number"
                        min="0"
                        value={detailForm.basePrice}
                        onChange={(e) => setDetailForm((prev) => ({ ...prev, basePrice: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-product-stock" className="mb-2 block text-sm font-medium text-foreground">
                        Stock Quantity
                      </label>
                      <input
                        id="edit-product-stock"
                        type="number"
                        min="0"
                        value={detailForm.stockQty}
                        onChange={(e) => setDetailForm((prev) => ({ ...prev, stockQty: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-product-description" className="mb-2 block text-sm font-medium text-foreground">
                      Description
                    </label>
                    <textarea
                      id="edit-product-description"
                      rows={5}
                      value={detailForm.description}
                      onChange={(e) => setDetailForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                    />
                  </div>
                </div>
              )}

              {!editProductQuery.isLoading && activeTab === "images" && (
                <div className="space-y-5">
                  {detailError && <p className="rounded-lg bg-error/10 p-3 text-sm text-error">{detailError}</p>}
                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-surface-alt p-8 text-center text-muted hover:border-primary">
                    <span className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload images
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {imageFiles.length > 0 && (
                    <div className="rounded-lg border border-border p-4 text-sm text-muted">
                      {imageFiles.length} new image{imageFiles.length > 1 ? "s" : ""} selected.
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    {editProductQuery.data?.images?.map((image) => (
                      <div key={image.id} className="rounded-xl border border-border p-4">
                        <img src={image.imageUrl} alt="Product" className="mb-3 h-40 w-full rounded-lg object-cover" />
                        <div className="flex items-center justify-between gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${image.isPrimary ? "bg-success/10 text-success" : "bg-surface-alt text-foreground"}`}>
                            {image.isPrimary ? "Primary" : "Secondary"}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(image.id)}
                              className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-surface-alt"
                            >
                              Set primary
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(image.id)}
                              className="rounded-lg border border-border px-3 py-2 text-sm text-error hover:bg-error/10"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!editProductQuery.isLoading && activeTab === "variants" && (
                <div className="space-y-5">
                  {variantError && <p className="rounded-lg bg-error/10 p-3 text-sm text-error">{variantError}</p>}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Variants</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingVariantId(null);
                        setVariantDraft(emptyVariantDraft);
                        setVariantError(null);
                      }}
                      className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-surface-alt"
                    >
                      Add variant
                    </button>
                  </div>

                  <div className="space-y-3 rounded-xl border border-border p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">SKU</label>
                        <input
                          type="text"
                          value={variantDraft.sku}
                          onChange={(e) => setVariantDraft((prev) => ({ ...prev, sku: e.target.value }))}
                          className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                          placeholder="SKU"
                          aria-label="Variant SKU"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">Color</label>
                        <input
                          type="text"
                          value={variantDraft.color}
                          onChange={(e) => setVariantDraft((prev) => ({ ...prev, color: e.target.value }))}
                          className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                          placeholder="Color"
                          aria-label="Variant color"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">Storage</label>
                        <input
                          type="text"
                          value={variantDraft.storage}
                          onChange={(e) => setVariantDraft((prev) => ({ ...prev, storage: e.target.value }))}
                          className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                          placeholder="Storage"
                          aria-label="Variant storage"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">Price Modifier</label>
                        <input
                          type="number"
                          min="0"
                          value={variantDraft.priceModifier}
                          onChange={(e) => setVariantDraft((prev) => ({ ...prev, priceModifier: e.target.value }))}
                          className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                          placeholder="Price modifier"
                          aria-label="Variant price modifier"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">Stock Quantity</label>
                        <input
                          type="number"
                          min="0"
                          value={variantDraft.stockQty}
                          onChange={(e) => setVariantDraft((prev) => ({ ...prev, stockQty: e.target.value }))}
                          className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3"
                          placeholder="Stock"
                          aria-label="Variant stock"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingVariantId(null);
                          setVariantDraft(emptyVariantDraft);
                        }}
                        className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-alt"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleVariantSave}
                        disabled={saveVariantMutation.isPending}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                      >
                        <Save className="h-4 w-4" />
                        {editingVariantId ? "Update variant" : "Add variant"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {editProductQuery.data?.variants?.map((variant) => (
                      <div key={variant.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
                        <div>
                          <p className="font-medium text-foreground">{variant.sku}</p>
                          <p className="text-sm text-muted">
                            {variant.color || "—"} • {variant.storage || "—"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-foreground">
                            {variant.priceModifier} modifier
                          </span>
                          <span className="rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-foreground">
                            {variant.stockQty} in stock
                          </span>
                          <button type="button" onClick={() => startEditVariant(variant)} className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-surface-alt">
                            Edit
                          </button>
                          <button type="button" onClick={() => handleDeleteVariant(variant.id)} className="rounded-lg border border-border px-3 py-2 text-sm text-error hover:bg-error/10">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!editProductQuery.isLoading && activeTab === "specs" && (
                <div className="space-y-5">
                  {specError && <p className="rounded-lg bg-error/10 p-3 text-sm text-error">{specError}</p>}
                  <div className="space-y-3">
                    {specRows.map((spec, index) => (
                      <div key={`${spec.specKey}-${index}`} className="flex flex-wrap gap-3 rounded-xl border border-border p-4">
                        <input
                          type="text"
                          value={spec.specKey}
                          onChange={(e) => {
                            const nextRows = [...specRows];
                            nextRows[index] = { ...nextRows[index], specKey: e.target.value };
                            setSpecRows(nextRows);
                          }}
                          placeholder="Spec key"
                          className="flex-1 min-w-45 rounded-lg border border-border bg-surface-alt px-4 py-3"
                        />
                        <input
                          type="text"
                          value={spec.specValue}
                          onChange={(e) => {
                            const nextRows = [...specRows];
                            nextRows[index] = { ...nextRows[index], specValue: e.target.value };
                            setSpecRows(nextRows);
                          }}
                          placeholder="Spec value"
                          className="flex-1 min-w-45 rounded-lg border border-border bg-surface-alt px-4 py-3"
                        />
                        <button
                          type="button"
                          onClick={() => setSpecRows(specRows.filter((_, rowIndex) => rowIndex !== index))}
                          className="rounded-lg border border-border px-3 py-2 text-sm text-error hover:bg-error/10"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSpecRows((prev) => [...prev, { specKey: "", specValue: "" }])}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-alt"
                  >
                    + Add specification
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
              <button type="button" onClick={closeEditModal} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-alt">
                Close
              </button>
              {activeTab === "details" && (
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  disabled={updateProductMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  Save details
                </button>
              )}
              {activeTab === "images" && (
                <button type="button" onClick={() => setActiveTab("details")} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-alt">
                  Continue to details
                </button>
              )}
              {activeTab === "variants" && (
                <button type="button" onClick={() => setActiveTab("details")} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-alt">
                  Continue to details
                </button>
              )}
              {activeTab === "specs" && (
                <button
                  type="button"
                  onClick={handleSaveSpecifications}
                  disabled={replaceSpecificationsMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  Save specifications
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
