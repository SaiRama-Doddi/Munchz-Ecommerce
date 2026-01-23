  import React, { useState, useMemo, useEffect } from "react";
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
  interface Category {
    id: number;
    name: string;
    thumbnailImage?: string;
  }
  function useCategories() {
    return useQuery({
      queryKey: ["categories"],
      queryFn: async () => {
        const res = await api.get("/product/api/categories");
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
        const res = await api.get("/product/api//products");
        return res.data as Product[];
      },
    });
  }

  /* =========================
    COMPONENT
  ========================= */
  export default function AllProducts() {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const { data: products = [], isLoading, isError } = useAllProducts();

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

    if (isLoading)
      return <div className="p-10 text-center">Loading products...</div>;

    if (isError)
      return (
        <div className="p-10 text-center text-red-600">
          Failed to load products
        </div>
      );

    return (
      <div className="bg-[#f3fff1] min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="mt-0 mb-8
      inline-flex items-center gap-3
      bg-white px-4 py-2 rounded-full
      shadow-md border border-green-100
      text-green-700 font-medium
      hover:bg-green-50 hover:shadow-lg
      active:scale-95
      transition-all duration-200
      cursor-pointer
    "
          >
            <span className="
      flex items-center justify-center
      w-8 h-8 rounded-full
      bg-green-700 text-white
      text-lg
    ">
              ←
            </span>
            Back
          </button>


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

            {/* ================= PRODUCTS ================= */}
            <div>
              <div className="bg-white p-4 rounded-xl shadow mb-8">
                <p className="font-medium mb-3">Filter by Category</p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategoryId("ALL")}
                    className={`px-4 py-1.5 rounded-full border text-sm transition
          ${selectedCategoryId === "ALL"
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
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm transition
            ${selectedCategoryId === c.id
                          ? "bg-green-700 text-white border-green-700"
                          : "bg-white hover:bg-green-50"
                        }`}
                    >
                      {c.thumbnailImage && (
                        <img
                          src={c.thumbnailImage}
                          alt={c.name}
                          className="w-5 h-5 rounded object-cover"
                        />
                      )}
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <h2 className="text-3xl font-semibold mb-8">
                All Products
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
                     className="bg-[#eaffea] rounded-xl shadow hover:shadow-lg transition p-3 sm:p-4 relative cursor-pointer flex flex-col"

                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                       className="w-full h-32 sm:h-36 lg:h-40 object-contain mb-3"

                      />

                      <span className="inline-block bg-green-700 text-white text-xs px-2 py-1 rounded mb-2 w-fit">
                        {selectedVariant.weightLabel}
                      </span>

                      <h3 className="font-semibold">{p.name}</h3>

                      {/* PRICE + 100g REFERENCE */}
                     <div className="mt-2 flex flex-wrap items-center gap-2">
  {/* OFFER PRICE */}
  <span className="font-semibold text-lg">
    ₹{selectedVariant.offerPrice * qty}
  </span>

  {/* MRP */}
  {selectedVariant.mrp > selectedVariant.offerPrice && (
    <span className="text-sm text-gray-500 line-through">
      ₹{selectedVariant.mrp * qty}
    </span>
  )}

  {/* 100g REFERENCE */}
  {base100g && (
    <span className="text-sm text-gray-700">
      (₹{base100g.offerPrice} / 100 g)
    </span>
  )}
</div>


{discount > 0 && (
  <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
    Save {discount}%
  </span>
)}


<div className="mt-1 h-[40px] overflow-hidden">
  <p className="text-sm text-gray-600 line-clamp-2">
    {p.description}
  </p>
</div>

                      {/* VARIANTS */}
                      <div
  className="flex flex-wrap gap-2 mt-3"
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
                         className={`px-2 py-1 border rounded text-[10px] sm:text-xs ${selectedVariantIndex === i
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
                        <button onClick={() => decQty(p.id)} className="border px-2 sm:px-3 rounded">
                          −
                        </button>
                        <span>{qty}</span>
                        <button onClick={() => incQty(p.id)} className="border px-2 sm:px-3 rounded"
>
                          +
                        </button>
                      </div>

                      {/* ADD TO CART */}
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
                          className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
                        >
                          Add to cart
                        </button>
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
