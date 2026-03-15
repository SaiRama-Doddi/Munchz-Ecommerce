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
    <div className="bg-[#f6fff4] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Fetching your orders...</p>
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
    <div className="bg-[#f2ffef] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">


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
  {category?.name
    ? `${category.name} Products`
    : "Products"}
</h2>


         <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
      <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
        {discount}% OFF
      </div>
    )}

  </div>

  {/* CONTENT */}
  <div className="p-4 flex flex-col gap-2 flex-grow">

    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
      {p.name}
    </h3>

    <ProductReviewStats productId={p.id} />

    {/* PRICE */}
    <div className="flex items-center gap-2 mt-1">

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
       value={selectedIndex}
        onChange={(e) =>
          setVariantMap((prev) => ({
            ...prev,
            [p.id]: parseInt(e.target.value),
          }))
        }
        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50
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
            selectedVariantIndex: selectedIndex,
            base100gPrice: base100g?.offerPrice,
            qty,
          });

          setCartClicked((prev) => ({
            ...prev,
            [p.id]: true,
          }));
        }}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
          cartClicked[p.id]
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
