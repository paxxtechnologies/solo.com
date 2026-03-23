"use client";

import Link from "next/link";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { Heart, ShoppingCart, Trash2, ExternalLink } from "lucide-react";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (product: (typeof items)[0]) => {
    addToCart(product);
    showToast(`${product.name} added to cart`, "success");
  };

  const handleRemove = (product: (typeof items)[0]) => {
    removeFromWishlist(product.id);
    showToast(`${product.name} removed from wishlist`, "info");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            My Wishlist
          </h1>
          <p className="text-muted">
            {items.length} item{items.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-sm text-error hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Wishlist Items */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-surface rounded-xl border border-border overflow-hidden group"
            >
              <div className="relative">
                <Link href={`/product/${item.slug}`}>
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {item.discountPrice && (
                    <span className="px-2 py-1 bg-error text-white text-xs font-semibold rounded">
                      -{Math.round(
                        ((item.price - item.discountPrice) / item.price) * 100
                      )}
                      %
                    </span>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-error hover:text-white transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current text-error" />
                </button>
              </div>

              <div className="p-4">
                <Link href={`/product/${item.slug}`}>
                  <p className="text-sm text-muted mb-1">{item.brand}</p>
                  <h3 className="font-medium text-foreground mb-2 line-clamp-1 hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-4">
                  {item.discountPrice ? (
                    <>
                      <span className="font-bold text-foreground">
                        {formatPrice(item.discountPrice)}
                      </span>
                      <span className="text-sm text-muted line-through">
                        {formatPrice(item.price)}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-foreground">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <Link
                    href={`/product/${item.slug}`}
                    className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-surface-alt transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <Heart className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted mb-6">
            Save items you love by clicking the heart icon on products
          </p>
          <Link
            href="/shop/all"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}
