import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";
import { getProductUrl } from "../utils/slugify";
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
  imageUrls: string[];
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
  const { data: categories = [] } = useCategories();

  /* PRODUCT STATE */
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "ALL">("ALL");

  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === "ALL") return products;
    return products.filter((p: any) => {
      const pCatId = p.category?.id ?? p.categoryId ?? null;
      return pCatId === selectedCategoryId;
    });
  }, [products, selectedCategoryId]);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategoryId === "ALL") return "All";
    const cat = categories.find((c) => c.id === selectedCategoryId);
    return cat ? cat.name : "Products";
  }, [selectedCategoryId, categories]);

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
    <div className="bg-white min-h-screen pt-4 pb-10 md:pt-6 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* HEADER AREA */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Our <span className="text-green-600">Premium Range</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-lg">
            Delicious snacks crafted with quality and care
          </p>

        </div>

        {/* CATEGORY FILTER (SLIDER) */}
        <div className="mb-6 md:mb-8">
          <p className="text-[13px] font-bold text-green-700 uppercase tracking-widest mb-3 ml-1">
            Browse By Category
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-4 -mx-1 px-1 no-scrollbar">
            
            <button
              onClick={() => setSelectedCategoryId("ALL")}
              className={`flex flex-col items-center gap-3 p-2 rounded-2xl transition-all group min-w-[100px] ${
                selectedCategoryId === "ALL" 
                ? "bg-green-50 scale-105" 
                : "hover:bg-white"
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all shadow-sm overflow-hidden ${
                selectedCategoryId === "ALL"
                ? "border-green-600 bg-white"
                : "border-transparent bg-white group-hover:border-green-200"
              }`}>
                <span className={`text-base font-bold ${selectedCategoryId === "ALL" ? "text-green-600" : "text-gray-400"}`}>
                  ALL
                </span>
              </div>
              <span className={`text-[12px] font-bold tracking-tight ${selectedCategoryId === "ALL" ? "text-green-700" : "text-gray-500"}`}>
                Everything
              </span>
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryId(c.id)}
                className={`flex flex-col items-center gap-3 p-2 rounded-2xl transition-all group min-w-[100px] ${
                  selectedCategoryId === c.id 
                  ? "bg-green-50 scale-105" 
                  : "hover:bg-white"
                }`}
              >
                <div className={`w-16 h-16 rounded-full border-2 transition-all shadow-sm overflow-hidden ${
                  selectedCategoryId === c.id
                  ? "border-green-600 bg-white"
                  : "border-transparent bg-white group-hover:border-green-200"
                }`}>
                  <img 
                    src={c.thumbnailImage || "https://placehold.co/100x100?text=Category"} 
                    alt={c.name}
                    className={`w-full h-full object-cover transition-all ${
                      selectedCategoryId === c.id ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                </div>
                <span className={`text-[12px] font-bold tracking-tight text-center ${selectedCategoryId === c.id ? "text-green-700" : "text-gray-500"}`}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* DYNAMIC SECTION HEADER */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-green-600 rounded-full"></div>
              <h3 className="text-base font-bold text-gray-900">
                {selectedCategoryName} Products
              </h3>
           </div>
           <span className="text-[12px] font-bold text-gray-400 bg-white px-3 py-1.5 rounded-full">
              {filteredProducts.length} Items
           </span>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((p: any) => {
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
                onClick={() => navigate(getProductUrl(p.id, p.name))}
                className="group bg-[#ecfdf5] rounded-3xl shadow-sm hover:shadow-xl border border-green-100 overflow-hidden cursor-pointer transition-all duration-500 flex flex-col hover:-translate-y-2 h-full"
              >

                {/* IMAGE BOX */}
                <div className="relative bg-transparent aspect-square flex items-center justify-center m-1.5 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                  />

                  {discount > 0 && (
                    <div className="absolute top-2.5 right-2.5 bg-green-600 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
                      {discount}% OFF
                    </div>
                  )}
                </div>

                {/* CONTENT AREA */}
                <div className="px-4 pb-4 pt-1 flex flex-col flex-grow">
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-1 mt-0.5">
                    {p.description}
                  </p>

                  <div className="mt-2.5 flex-grow flex flex-col justify-end">
                    <ProductReviewStats productId={p.id} />

                    {/* PRICE & WEIGHT */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex flex-col">
                        <span className="text-base font-medium text-gray-900 tracking-tight">
                          ₹{selectedVariant.offerPrice * qty}
                        </span>
                        {base100g && (
                          <span className="text-xs text-gray-500 font-medium tracking-tight">
                            (₹{base100g.offerPrice}/100g)
                          </span>
                        )}
                      </div>
                      
                      <span className="px-2.5 py-1 bg-white border border-green-200 text-green-700 text-[10px] font-bold rounded-full shadow-sm uppercase tracking-wider">
                        {selectedVariant.weightLabel}
                      </span>
                    </div>

                    {/* ACTION ROW */}
                    <div
                      className="flex items-center gap-1.5 mt-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* QTY BOX */}
                      <div className="flex items-center bg-white rounded-xl border border-green-200 p-1 shadow-sm h-9">
                        <button
                          onClick={() => setQtyMap(pvs => ({...pvs, [p.id]: Math.max(1, (pvs[p.id] || 1) - 1)}))}
                          className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-l-lg transition-all font-bold text-base"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-gray-900">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQtyMap(pvs => ({...pvs, [p.id]: (pvs[p.id] || 1) + 1}))}
                          className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-r-lg transition-all font-bold text-base"
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
                        className={`flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl font-bold text-[12px] transition-all active:scale-95 shadow-md ${
                          isInCart
                            ? "bg-green-100 text-green-700 border-2 border-green-200"
                            : "bg-green-600 text-white hover:bg-green-700 hover:shadow-xl"
                        }`}
                      >
                        <FiShoppingCart size={14} />
                        {isInCart ? "ADDED" : "ADD TO CART"}
                      </button>
                    </div>
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

