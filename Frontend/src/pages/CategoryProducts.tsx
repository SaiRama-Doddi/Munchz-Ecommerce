import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductUrl } from "../utils/slugify";
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
  imageUrls: string[];
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

function useCategory(categoryId: number) {
  return useQuery({
    queryKey: ["category", categoryId],
    enabled: !!categoryId,
    queryFn: async () => {
      const res = await api.get(`/categories/${categoryId}`);
      return res.data as { id: number; name: string };
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
  const { data: category } = useCategory(categoryId);

  const [cartClicked, setCartClicked] =
    useState<{ [key: number]: boolean }>({});

  const { data: products = [], isLoading, isError } =
    useCategoryProducts(categoryId);

  /* PRODUCT STATE */
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});

  /* FILTER STATE */
  const [price, setPrice] = useState(5000);
  const [weights, setWeights] = useState<number[]>([]);

  const toggleWeight = (w: number) =>
    setWeights((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );

  const incQty = (id: number) =>
    setQtyMap((p) => ({ ...p, [id]: (p[id] || 1) + 1 }));

  const decQty = (id: number) =>
    setQtyMap((p) => ({ ...p, [id]: Math.max(1, (p[id] || 1) - 1) }));

  /* =========================
     FILTER PRODUCTS (ALL VARIANTS)
  ========================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const sellVariants = p.variants.filter(
        (v) => v.weightInGrams !== 100
      );

      // Price filter → ALL variants
      const priceMatch = sellVariants.some(
        (v) => v.offerPrice <= price
      );

      // Weight filter
      const weightMatch =
        weights.length === 0 ||
        sellVariants.some((v) =>
          weights.includes(v.weightInGrams)
        );

      return priceMatch && weightMatch;
    });
  }, [products, price, weights]);

  /* =========================
     SYNC FILTER → VARIANT
  ========================= */
  useEffect(() => {
    if (weights.length === 0) return;

    const preferredWeight = weights[0];

    setVariantMap((prev) => {
      const updated = { ...prev };

      products.forEach((p) => {
        const sellVariants = p.variants.filter(
          (v) => v.weightInGrams !== 100
        );

        const matchIndex = sellVariants.findIndex(
          (v) => v.weightInGrams === preferredWeight
        );

        if (matchIndex !== -1) {
          updated[p.id] = matchIndex;
        }
      });

      return updated;
    });
  }, [weights, products]);

  if (isLoading) {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Fetching products...</p>
      </div>
    </div>
  );
}

  if (isError)
    return (
      <div className="p-10 text-center text-red-600">
        Failed to load products
      </div>
    );


    
  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* HEADER AREA */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Our <span className="text-green-600">Product Range</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-lg">
            Delicious {category?.name || "Premium"} snacks crafted with quality and care
          </p>
          <div className="w-16 h-[3px] bg-green-600 mt-4"></div>
        </div>

        {/* DYNAMIC SECTION HEADER */}
        <div className="mb-10 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-green-600 rounded-full"></div>
              <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight">
                {category?.name || "Category"} Products
              </h3>
           </div>
           <span className="text-[12px] font-bold text-gray-400 bg-white border border-gray-100 px-3 py-1.5 rounded-full">
              {filteredProducts.length} Items
           </span>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((p) => {
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

            const displayImage = (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls[0] : p.imageUrl;

            return (
              <div
                key={p.id}
                onClick={() => navigate(getProductUrl(p.id, p.name))}
                className="group bg-[#ecfdf5] rounded-3xl shadow-sm hover:shadow-xl border border-green-100 overflow-hidden cursor-pointer transition-all duration-500 flex flex-col hover:-translate-y-2 h-full"
              >

                {/* IMAGE BOX */}
                <div className="relative bg-transparent aspect-square flex items-center justify-center m-1.5 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src={displayImage}
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
                          className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-l-lg transition-all font-bold text-base cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-gray-900">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQtyMap(pvs => ({...pvs, [p.id]: (pvs[p.id] || 1) + 1}))}
                          className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-r-lg transition-all font-bold text-base cursor-pointer"
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
                            imageUrl: displayImage,
                            variants: sellVariants,
                            selectedVariantIndex,
                            base100gPrice: base100g?.offerPrice,
                            qty,
                          });
                        }}
                        className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl font-bold text-[12px] bg-green-600 text-white hover:bg-green-700 hover:shadow-xl transition-all active:scale-95 shadow-md"
                      >
                        <FiShoppingCart size={14} />
                        ADD TO CART
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
