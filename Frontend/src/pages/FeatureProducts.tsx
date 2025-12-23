import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";

/* ================= TYPES ================= */
interface Variant {
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

/* ================= FETCH ================= */
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

/* ================= COMPONENT ================= */
export default function FeaturedProducts() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: products = [], isLoading } = useFeaturedProducts();

  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const visibleProducts = products.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <section className="bg-[#f6fbf3] py-16 relative">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        <h2 className="text-3xl font-semibold text-center mb-14">
          Bestseller
        </h2>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {visibleProducts.map((p) => {
            const variant = p.variants[0];

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="bg-[#eaffea] rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-44 object-contain mb-4"
                />

                <h3 className="font-semibold mb-1">{p.name}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold text-gray-900">
                    ₹{variant.offerPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{variant.mrp}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      productId: p.id,
                      name: p.name,
                      imageUrl: p.imageUrl,
                      variants: p.variants,
                      selectedVariantIndex: 0,
                      qty: 1,
                    });
                  }}
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg"
                >
                  Add to cart
                </button>
              </div>
            );
          })}
        </div>

        {/* ===== BOTTOM CENTER ARROWS (EXACT IMAGE STYLE) ===== */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center gap-10">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-12 h-12 rounded-full border border-gray-700
                         flex items-center justify-center text-xl
                         hover:bg-gray-100 transition
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ‹
            </button>

            <button
              onClick={() =>
                setPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={page === totalPages - 1}
              className="w-12 h-12 rounded-full border border-gray-700
                         flex items-center justify-center text-xl
                         hover:bg-gray-100 transition
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
