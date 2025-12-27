import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
   FETCH PRODUCTS
========================= */
function useFeaturedProducts() {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data as Product[];
    },
  });
}

const ITEMS_PER_PAGE = 4;

/* =========================
   COMPONENT
========================= */
export default function FeaturedProducts() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: products = [], isLoading, isError } =
    useFeaturedProducts();

  /* SLIDER STATE */
  const [page, setPage] = useState(0);

  /* PRODUCT STATE */
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});

  const incQty = (id: number) =>
    setQtyMap((p) => ({ ...p, [id]: (p[id] || 1) + 1 }));

  const decQty = (id: number) =>
    setQtyMap((p) => ({ ...p, [id]: Math.max(1, (p[id] || 1) - 1) }));

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const visibleProducts = products.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  if (isLoading)
    return <div className="p-10 text-center">Loading products...</div>;

  if (isError)
    return (
      <div className="p-10 text-center text-red-600">
        Failed to load products
      </div>
    );

  return (
    <div className="bg-[#f3fff1] py-14">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADING */}
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Bestseller Products
        </h2>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {visibleProducts.map((p) => {
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
                className="bg-[#eaffea] rounded-xl shadow hover:shadow-lg transition p-4 relative cursor-pointer flex flex-col"
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

                {/* WEIGHT */}
                <span className="inline-block bg-green-700 text-white w-12 text-xs px-2 py-1 rounded mb-2">
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

                {/* PRICE */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
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

                {/* VARIANTS – 3 PER ROW */}
                <div
                  className="grid grid-cols-3 gap-2 mt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {sellVariants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setVariantMap((prev) => ({
                          ...prev,
                          [p.id]: i,
                        }))
                      }
                      className={`px-2 py-1 border rounded text-xs ${
                        selectedVariantIndex === i
                          ? "bg-green-700 text-white"
                          : ""
                      }`}
                    >
                      {v.weightLabel}
                    </button>
                  ))}
                </div>

                {/* QTY */}
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

                {/* ADD TO CART – FIXED BOTTOM */}
                <div className="mt-auto pt-4">
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
                    className="w-full bg-green-700 text-white py-2  rounded-lg hover:bg-green-800"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CENTER ARROWS */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-12 h-12 rounded-full border border-gray-400
                       flex items-center justify-center text-xl
                       bg-white shadow hover:bg-gray-100
                       disabled:opacity-40"
          >
            ‹
          </button>

          <button
            onClick={() =>
              setPage((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={page === totalPages - 1}
            className="w-12 h-12 rounded-full border border-gray-400
                       flex items-center justify-center text-xl
                       bg-white shadow hover:bg-gray-100
                       disabled:opacity-40"
          >
            ›
          </button>
        </div>

      </div>
    </div>
  );
}
