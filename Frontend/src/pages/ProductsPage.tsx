import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";
import { ArrowLeft } from "lucide-react";


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
  const { addToCart } = useCart();
  const [cartClicked, setCartClicked] =
    useState<{ [key: number]: boolean }>({});
  const { data: products = [], isLoading, isError } = useAllProducts();
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  /* PRODUCT STATE */
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});

  /* FILTER STATE */
  const [price, setPrice] = useState(5000);
  const [weights, setWeights] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | "ALL">("ALL");

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
    return products.filter((p: any) => {





      /* ================= CATEGORY FILTER ================= */
      const productCategoryId =
        p.category?.id ?? p.categoryId ?? null;

      const categoryMatch =
        selectedCategoryId === "ALL" ||
        productCategoryId === selectedCategoryId;

      if (!categoryMatch) return false;

      /* ================= EXISTING LOGIC (UNCHANGED) ================= */
      const sellVariants = p.variants.filter(
        (v: any) => v.weightInGrams !== 100
      );

      const priceMatch = sellVariants.some(
        (v: any) => v.offerPrice <= price
      );

      const weightMatch =
        weights.length === 0 ||
        sellVariants.some((v: any) =>
          weights.includes(v.weightInGrams)
        );

      return priceMatch && weightMatch;
    });


  }, [products, price, weights, selectedCategoryId]);






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

  const { data: categories = [] } = useCategories();

  if (isLoading) {
    return (
      <div className="bg-[#f6fff4] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Fetching your products...</p>
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
    <div className="bg-[#f3fff1] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">





        {/* MOBILE FILTER BUTTON */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-2xl font-semibold">All Products</h2>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            ☰ Filters
          </button>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

          {/* ================= FILTER PANEL ================= */}
          <aside className="sticky top-24 h-fit bg-white rounded-xl p-5 shadow hidden lg:block">
            <h3 className="font-semibold mb-6">☰ Sorted by</h3>

            <div className="mb-6">
              <p className="font-medium mb-2">Price</p>
              <p className="text-sm mb-2">₹0 to ₹{price}</p>
              <input
                type="range"
                min={0}
                max={5000}
                step={50}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-green-600"
              />
            </div>

            <div>
              <p className="font-medium mb-3">Weight</p>
              {[250, 500, 750, 1000].map((w) => (
                <label
                  key={w}
                  className="flex items-center gap-2 text-sm mb-2"
                >
                  <input
                    type="checkbox"
                    checked={weights.includes(w)}
                    onChange={() => toggleWeight(w)}
                    className="accent-green-600"
                  />
                  {w === 1000 ? "1kg" : `${w}gm`}
                </label>
              ))}
            </div>
          </aside>


          {/* ================= MOBILE FILTER DRAWER ================= */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 flex">
              {/* BACKDROP */}
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsFilterOpen(false)}
              />

              {/* DRAWER */}
              <div className="relative bg-white w-80 h-full p-6 shadow-xl animate-slideIn">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-lg">☰ Filters</h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 text-xl"
                  >
                    ✕
                  </button>
                </div>

                {/* ===== COPY YOUR FILTER CONTENT HERE ===== */}
                <div className="mb-6">
                  <p className="font-medium mb-2">Price</p>
                  <p className="text-sm mb-2">₹0 to ₹{price}</p>
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={50}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full accent-green-600"
                  />
                </div>

                <div>
                  <p className="font-medium mb-3">Weight</p>
                  {[250, 500, 750, 1000].map((w) => (
                    <label
                      key={w}
                      className="flex items-center gap-2 text-sm mb-2"
                    >
                      <input
                        type="checkbox"
                        checked={weights.includes(w)}
                        onChange={() => toggleWeight(w)}
                        className="accent-green-600"
                      />
                      {w === 1000 ? "1kg" : `${w}gm`}
                    </label>
                  ))}
                </div>

                {/* APPLY BUTTON */}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full mt-6 bg-green-700 text-white py-2 rounded-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}


          {/* ================= PRODUCTS ================= */}
          <div>
          <div className="bg-white p-4 rounded-xl shadow mb-8">
  <p className="font-medium mb-3">Filter by Category</p>

  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

    <button
      onClick={() => setSelectedCategoryId("ALL")}
      className={`flex items-center justify-center gap-2 px-4 py-2 min-h-[36px] 
      rounded-full border text-sm whitespace-nowrap flex-shrink-0 transition
      ${
        selectedCategoryId === "ALL"
          ? "bg-green-700 text-white border-green-700"
          : "bg-white hover:bg-green-50"
      }`}
    >
      All
    </button>

    {categories.map((c) => (
      <button
        key={c.id}
        onClick={() => setSelectedCategoryId(c.id)}
        className={`flex items-center justify-center gap-2 px-4 py-2 min-h-[36px] 
        rounded-full border text-sm whitespace-nowrap flex-shrink-0 transition
        ${
          selectedCategoryId === c.id
            ? "bg-green-700 text-white border-green-700"
            : "bg-white hover:bg-green-50"
        }`}
      >
        {c.thumbnailImage && (
          <img
            src={c.thumbnailImage}
            alt={c.name}
            className="w-5 h-5 rounded object-cover flex-shrink-0"
          />
        )}
        <span>{c.name}</span>
      </button>
    ))}

  </div>
</div>

            <h2 className="text-3xl font-semibold mb-8">
              All Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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

                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden cursor-pointer transition flex flex-col"
                  >

                    {/* IMAGE */}
                    <div className="relative bg-gray-50 aspect-square flex items-center justify-center">

                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition"
                      />

                      {discount > 0 && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] px-2 py-1 rounded-md font-semibold">
                          {discount}% OFF
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-3 flex flex-col gap-2 flex-grow">

                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {p.name}
                      </h3>

                      <ProductReviewStats productId={p.id} />

                      {/* PRICE */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{selectedVariant.offerPrice * qty}
                        </span>

                        {selectedVariant.mrp > selectedVariant.offerPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{selectedVariant.mrp * qty}
                          </span>
                        )}

                        {base100g && (
                          <span className="text-xs text-gray-500">
                            (₹{base100g.offerPrice}/100g)
                          </span>
                        )}
                      </div>

                      {/* VARIANT + CART */}
                      <div
                        className="flex items-center gap-2 mt-auto"
                        onClick={(e) => e.stopPropagation()}
                      >

                        <select
                          value={selectedVariantIndex}
                          onChange={(e) =>
                            setVariantMap((prev) => ({
                              ...prev,
                              [p.id]: parseInt(e.target.value),
                            }))
                          }
                          className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-gray-50
        focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          {sellVariants.map((v, i) => (
                            <option key={i} value={i}>
                              {v.weightLabel}
                            </option>
                          ))}
                        </select>


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

                            setCartClicked((prev) => ({
                              ...prev,
                              [p.id]: true,
                            }));
                          }}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg transition ${cartClicked[p.id]
                              ? "bg-red-100 text-red-600"
                              : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                        >
                          <FiShoppingCart size={18} />
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

