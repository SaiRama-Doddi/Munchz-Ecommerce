import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";

/* =========================
   TYPES
========================= */
interface Variant {
  id?: number;
  weightLabel: string;
  weightInGrams: number;
  mrp: number;
  offerPrice: number;
}

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  variants: Variant[];
}

/* =========================
   FETCH PRODUCTS BY CATEGORY
========================= */
function useCategoryProducts(categoryId: number) {
  return useQuery({
    queryKey: ["products", categoryId],
    enabled: !!categoryId,
    queryFn: async () => {
      const res = await api.get(`/products/category/${categoryId}`);
      return res.data as Product[];
    },
  });
}

/* =========================
   COMPONENT
========================= */
export default function CategoryProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoryId = Number(id);
  const { addToCart } = useCart();

  const { data: products = [], isLoading, isError } =
    useCategoryProducts(categoryId);

  /* PER PRODUCT STATE */
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});

  const incQty = (id: number) =>
    setQtyMap((p) => ({ ...p, [id]: (p[id] || 1) + 1 }));

  const decQty = (id: number) =>
    setQtyMap((p) => ({ ...p, [id]: Math.max(1, (p[id] || 1) - 1) }));

  if (isLoading)
    return <div className="p-10 text-center">Loading products...</div>;

  if (isError)
    return <div className="p-10 text-center text-red-600">Failed to load</div>;

  return (
    <div className="bg-[#f3fff1] min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-10">Products</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => {
            const base100g = p.variants.find(
              (v) => v.weightInGrams === 100
            );

            const sellVariants = p.variants.filter(
              (v) => v.weightInGrams !== 100
            );

            const selectedVariantIndex = variantMap[p.id] ?? 0;
            const selectedVariant = sellVariants[selectedVariantIndex];
            const qty = qtyMap[p.id] || 1;

            if (!selectedVariant) return null;

            /* =========================
               SAVE % CALCULATION
            ========================= */
            const discount =
              selectedVariant.mrp > selectedVariant.offerPrice
                ? Math.round(
                    ((selectedVariant.mrp -
                      selectedVariant.offerPrice) /
                      selectedVariant.mrp) *
                      100
                  )
                : 0;

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="bg-[#eaffea] rounded-xl shadow hover:shadow-lg transition p-4 relative cursor-pointer"
              >
                {/* SAVE BADGE */}
                {discount > 0 && (
                  <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Save {discount}%
                  </span>
                )}

                {/* IMAGE */}
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-44 object-contain mb-4"
                />

                {/* WEIGHT TAG */}
                <span className="inline-block bg-green-700 text-white text-xs px-2 py-1 rounded mb-2">
                  {selectedVariant.weightLabel}
                </span>

                {/* NAME */}
                <h3 className="font-semibold text-lg">{p.name}</h3>

                {/* REVIEWS */}
                <div className="flex items-center text-yellow-500 text-sm mt-1">
                  ★★★★☆
                  <span className="text-gray-600 text-xs ml-2">
                    500 reviews
                  </span>
                </div>

                {/* PRICE + 100G */}
                <div className="mt-2 flex items-center flex-wrap gap-2">
                  <span className="font-semibold text-lg">
                    ₹{selectedVariant.offerPrice * qty}
                  </span>

                  <span className="text-sm text-gray-500 line-through">
                    ₹{selectedVariant.mrp * qty}
                  </span>

                  {base100g && (
                    <span className="text-sm text-gray-700">
                      (₹{base100g.offerPrice} / 100 g)
                    </span>
                  )}
                </div>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {p.description}
                </p>

                {/* VARIANT SELECTOR */}
                <div
                  className="flex gap-2 mt-3 flex-wrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  {sellVariants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setVariantMap((prev) => ({ ...prev, [p.id]: i }))
                      }
                      className={`px-3 py-1 border rounded text-sm ${
                        selectedVariantIndex === i
                          ? "bg-green-700 text-white"
                          : ""
                      }`}
                    >
                      {v.weightLabel}
                    </button>
                  ))}
                </div>

                {/* QUANTITY */}
                <div
                  className="flex items-center gap-3 mt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => decQty(p.id)}
                    className="border px-3 rounded"
                  >
                    −
                  </button>
                  <span>{qty}</span>
                  <button
                    onClick={() => incQty(p.id)}
                    className="border px-3 rounded"
                  >
                    +
                  </button>
                </div>

                {/* ADD TO CART */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      productId: p.id,
                      name: p.name,
                      imageUrl: p.imageUrl,
                      variants: sellVariants,
                      selectedVariantIndex,
                      base100gPrice: base100g?.offerPrice,
                      qty,
                    });
                  }}
                  className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
                >
                  Add to cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}