import React, { useState, useMemo, useEffect } from "react";
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

  if (isLoading)
    return <div className="p-10 text-center">Loading products...</div>;

  if (isError)
    return (
      <div className="p-10 text-center text-red-600">
        Failed to load products
      </div>
    );

  return (
    <div className="bg-[#f2ffef] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">

        <button
  onClick={() => navigate(-1)}
  className="
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

            {/* PRICE */}
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

            {/* WEIGHT */}
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
            <h2 className="text-3xl font-semibold mb-8">
              Category Products
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((p) => {
                const base100g = p.variants.find(
                  (v) => v.weightInGrams === 100
                );
                const sellVariants = p.variants.filter(
                  (v) => v.weightInGrams !== 100
                );

                const selectedIndex = variantMap[p.id] ?? 0;
                const selectedVariant = sellVariants[selectedIndex];
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
                    className="bg-[#eaffea] rounded-2xl shadow p-5 flex flex-col cursor-pointer"
                  >
                    {discount > 0 && (
                      <span className="absolute bg-green-600 text-white text-xs px-3 py-1 rounded-md self-end">
                        Save {discount}%
                      </span>
                    )}

                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-44 object-contain mb-4"
                    />

                    <span className="inline-block bg-green-700 text-white text-xs px-3 py-1 rounded-md w-fit mb-2">
                      {selectedVariant.weightLabel}
                    </span>

                    <h3 className="font-semibold text-lg">{p.name}</h3>

                    <div className="flex items-center text-yellow-500 text-sm mt-1">
                      ★★★★☆
                      <span className="text-gray-500 text-xs ml-2">
                        500 reviews
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xl font-semibold">
                        ₹{selectedVariant.offerPrice * qty}
                      </span>
                      <span className="text-gray-500 line-through">
                        ₹{selectedVariant.mrp * qty}
                      </span>
                      {base100g && (
                        <span className="text-sm text-gray-600">
                          (₹{base100g.offerPrice} / 100 g)
                        </span>
                      )}
                    </div>

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
                            setVariantMap((m) => ({ ...m, [p.id]: i }))
                          }
                          className={`px-2 py-1 rounded-md border text-xs ${
                            selectedIndex === i
                              ? "bg-green-700 text-white"
                              : "bg-[#f2fff1] hover:bg-green-100"
                          }`}
                        >
                          {v.weightLabel}
                        </button>
                      ))}
                    </div>

                    {/* QTY */}
                    <div
                      className="flex items-center gap-4 mt-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => decQty(p.id)}
                        className="w-8 h-8 border rounded"
                      >
                        −
                      </button>
                      <span>{qty}</span>
                      <button
                        onClick={() => incQty(p.id)}
                        className="w-8 h-8 border rounded"
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
                            selectedVariantIndex: selectedIndex,
                            base100gPrice: base100g?.offerPrice,
                            qty,
                          });
                        }}
                        className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800"
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
