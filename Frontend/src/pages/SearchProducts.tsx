import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";
import { ArrowLeft } from "lucide-react";
import ProductReviewStats from "./ProductReviewStats";
import Footer from "../components/Footer";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";

/* ================= TYPES ================= */

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

/* ================= COMPONENT ================= */

export default function SearchProducts() {
  const [params] = useSearchParams();
  const keyword = params.get("keyword") || "";
  const navigate = useNavigate();
  const { addToCart } = useCart();

  /* PRODUCT STATE */
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});
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

  /* ================= FETCH SEARCH ================= */

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["search-products", keyword],
    enabled: !!keyword,
    queryFn: async () => {
      const res = await api.get(`/products/search?keyword=${keyword}`);
      return res.data as Product[];
    },
  });

  /* ================= FILTER LOGIC ================= */

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const sellVariants = p.variants.filter(
        (v) => v.weightInGrams !== 100
      );

      const priceMatch = sellVariants.some(
        (v) => v.offerPrice <= price
      );

      const weightMatch =
        weights.length === 0 ||
        sellVariants.some((v) =>
          weights.includes(v.weightInGrams)
        );

      return priceMatch && weightMatch;
    });
  }, [products, price, weights]);

  /* ================= SYNC FILTER → VARIANT ================= */

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
      <div className="min-h-screen flex items-center justify-center bg-[#f6fff4]">
        <div className="h-12 w-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (


<>
<TopHeader/>
<Header/>

<div className="bg-[#f3fff1] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="
            mt-0 mb-8 -ml-[180px]
            w-10 h-10
            flex items-center justify-center
            rounded-full
            bg-white
            shadow-md
            border border-green-100
            text-green-700
            hover:bg-green-50
            hover:shadow-lg
            active:scale-95
            transition-all duration-200 cursor-pointer
          "
        >
          <ArrowLeft size={20} />
        </button>
        {/* TITLE */}
        <h2 className="text-3xl font-semibold mb-8">
          Search Results for:
          <span className="text-green-700 ml-2">
            "{keyword}"
          </span>
        </h2>

        {/* FILTER PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

          {/* FILTER */}
          <aside className="bg-white rounded-xl p-5 shadow h-fit hidden lg:block">
            <h3 className="font-semibold mb-6">Filters</h3>

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
                <label key={w} className="flex items-center gap-2 mb-2 text-sm">
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

          {/* PRODUCTS GRID */}
          <div>
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-600 py-20">
                No products found.
              </div>
            ) : (
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
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-40 object-contain mb-3"
                      />

                      <span className="bg-green-700 text-white text-xs px-2 py-1 rounded mb-2 w-fit">
                        {selectedVariant.weightLabel}
                      </span>

                      <h3 className="font-semibold">{p.name}</h3>
                      <ProductReviewStats productId={p.id} />

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-lg">
                          ₹{selectedVariant.offerPrice * qty}
                        </span>

                        {selectedVariant.mrp >
                          selectedVariant.offerPrice && (
                          <span className="text-sm line-through text-gray-500">
                            ₹{selectedVariant.mrp * qty}
                          </span>
                        )}

                        {base100g && (
                          <span className="text-sm text-gray-700">
                            (₹{base100g.offerPrice} / 100g)
                          </span>
                        )}
                      </div>

                      {discount > 0 && (
                        <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          Save {discount}%
                        </span>
                      )}

                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {p.description}
                      </p>

                      {/* VARIANTS */}
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
                          className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>

    
  );
}