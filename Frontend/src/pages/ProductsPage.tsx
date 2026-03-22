import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";
import { ArrowLeft } from "lucide-react";
import PremiumSpinner from "../components/PremiumSpinner";


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
interface Category {
  id: number;
  name: string;
  thumbnailImage?: string;
}
function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data as Category[];
    },
  });
}

/* =========================
  FETCH ALL PRODUCTS
========================= */
function useAllProducts() {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data as Product[];
    },
  });
}


import axios from "../api/axios";
import { FiShoppingCart } from "react-icons/fi";

function ProductReviewStats({ productId }: { productId: number }) {
  const { data: reviews = [] } = useQuery({
    queryKey: ["product-reviews", productId],
    enabled: !!productId,
    queryFn: async () => {
      const res = await axios.get(
        `/reviews/product/${productId}`
      );
      return res.data as { rating: number }[];
    },
  });

  const total = reviews.length;

  const avg =
    total > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / total
      : 0;

  const renderStars = (rating: number) =>
    [1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={
          s <= Math.round(rating)
            ? "text-yellow-500"
            : "text-gray-300"
        }
      >
        ★
      </span>
    ));

  return (
    <div className="flex items-center text-sm mt-1">
      <div className="flex">{renderStars(avg)}</div>
      <span className="text-gray-600 text-xs ml-2">
        {avg.toFixed(1)} ({total} reviews)
      </span>
    </div>
  );
}


/* =========================
  COMPONENT
========================= */
export default function AllProducts() {
  const navigate = useNavigate();
  const { addToCart, items: cartItems } = useCart();
  const { data: products = [], isLoading, isError } = useAllProducts();

  /* PRODUCT STATE */
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});

  if (isLoading) {
    return <PremiumSpinner text="Fetching your products..." />;
  }

  if (isError)
    return (
      <div className="p-10 text-center text-red-600">
        Failed to load products
      </div>
    );

  return (
    <div className="bg-[#f9fdf7] min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* HEADER */}
        <div className="mb-12 text-left">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Our <span className="text-green-600">Premium Range</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-lg">
            Delicious snacks crafted with quality and care
          </p>
          <div className="w-16 h-[3px] bg-green-600 mt-4"></div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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

            const discount =
              selectedVariant.mrp > selectedVariant.offerPrice
                ? Math.round(
                  ((selectedVariant.mrp - selectedVariant.offerPrice) /
                    selectedVariant.mrp) *
                  100
                )
                : 0;

            const isInCart = cartItems.some(item => 
              item.productId === p.id && 
              item.selectedVariantIndex === selectedVariantIndex
            );

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="group bg-[#ecfdf5] rounded-3xl shadow-sm hover:shadow-xl border border-green-100 overflow-hidden cursor-pointer transition-all duration-500 flex flex-col hover:-translate-y-2"
              >

                {/* IMAGE */}
                <div className="relative bg-white aspect-square flex items-center justify-center m-4 rounded-2xl overflow-hidden shadow-inner border border-green-50">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                  />

                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white text-[11px] px-3 py-1.5 rounded-full font-bold shadow-lg">
                      {discount}% OFF
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5 flex flex-col gap-4 flex-grow">
                  <h3 className="text-[17px] font-bold text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
                    {p.name}
                  </h3>

                  <ProductReviewStats productId={p.id} />

                  {/* PRICE & WEIGHT */}
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex flex-col">
                      <span className="text-2xl font-medium text-gray-900 tracking-tight">
                        ₹{selectedVariant.offerPrice * qty}
                      </span>
                      {base100g && (
                        <span className="text-[11px] text-gray-500 font-medium tracking-tight">
                          (₹{base100g.offerPrice}/100g)
                        </span>
                      )}
                    </div>
                    
                    <span className="px-4 py-1.5 bg-white border border-green-200 text-green-700 text-[12px] font-bold rounded-full shadow-sm uppercase tracking-wider">
                      {selectedVariant.weightLabel}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div
                    className="flex items-center gap-3 mt-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* QUANTITY */}
                    <div className="flex items-center bg-white rounded-2xl border border-green-200 p-1.5 shadow-sm">
                      <button
                        onClick={() => setQtyMap(pvs => ({...pvs, [p.id]: Math.max(1, (pvs[p.id] || 1) - 1)}))}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all font-bold text-xl"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-900">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQtyMap(pvs => ({...pvs, [p.id]: (pvs[p.id] || 1) + 1}))}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all font-bold text-xl"
                      >
                        +
                      </button>
                    </div>

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
                      className={`flex-1 h-12 flex items-center justify-center gap-3 rounded-2xl font-bold text-[14px] transition-all active:scale-95 shadow-md ${
                        isInCart
                          ? "bg-green-100 text-green-700 border-2 border-green-200"
                          : "bg-green-600 text-white hover:bg-green-700 hover:shadow-xl"
                      }`}
                    >
                      <FiShoppingCart size={18} />
                      {isInCart ? "ADDED" : "ADD TO CART"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

