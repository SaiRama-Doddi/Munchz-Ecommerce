import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";
import axios from "../api/axios";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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

/* =========================
   REVIEW COMPONENT
========================= */
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
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-0.5">{renderStars(avg)}</div>
      <span className="text-xs text-gray-600">
        {avg.toFixed(1)} <span className="text-gray-400">({total})</span>
      </span>
    </div>
  );
}

/* =========================
   COMPONENT
========================= */
export default function FeaturedProducts() {

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: products = [], isLoading, isError } =
    useFeaturedProducts();

  const [cartClicked, setCartClicked] =
    useState<{ [key: number]: boolean }>({});

  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});

  const sliderRef = useRef<HTMLDivElement>(null);
const scrollLeft = () => {
  if (!sliderRef.current) return;

  const card = sliderRef.current.querySelector("div");
  if (!card) return;

  const cardWidth = (card as HTMLElement).offsetWidth + 16;

  sliderRef.current.scrollBy({
    left: -cardWidth,
    behavior: "smooth",
  });
};

const scrollRight = () => {
  if (!sliderRef.current) return;

  const card = sliderRef.current.querySelector("div");
  if (!card) return;

  const cardWidth = (card as HTMLElement).offsetWidth + 16;

  sliderRef.current.scrollBy({
    left: cardWidth,
    behavior: "smooth",
  });
};

  if (isLoading) {
    return (
      <div className="bg-[#f6fff4] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Fetching your products...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-600">
        Failed to load products
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#f9fdf7] to-[#f3fff1] py-12 md:py-16">

      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* HEADING */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Curated Collection
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Premium-quality products handpicked for excellence
          </p>
        </div>

        {/* SLIDER */}
        <div className="relative">

          

          {/* PRODUCTS */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
          >

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
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden cursor-pointer transition flex flex-col min-w-[85%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[20%]"
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
  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
>
  {sellVariants.map((v, i) => (
    <option
      key={i}
      value={i}
      style={{ backgroundColor: "white", color: "#111" }}
    >
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
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition ${
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
{/* MOBILE ARROWS */}
<div className="flex justify-center gap-4 mt-6 ">

  <button
    onClick={scrollLeft}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border hover:bg-green-600 hover:text-white transition"
  >
    <FiChevronLeft size={20} />
  </button>

  <button
    onClick={scrollRight}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border hover:bg-green-600 hover:text-white transition"
  >
    <FiChevronRight size={20} />
  </button>

</div>
          {/* RIGHT BUTTON */}
        
        </div>
      </div>
    </div>
  );
}
