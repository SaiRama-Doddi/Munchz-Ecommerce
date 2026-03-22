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
  const { addToCart, items: cartItems } = useCart();
  const { data: products = [], isLoading, isError } = useFeaturedProducts();

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
        <div className="mb-10 text-left px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Curated <span className="text-green-600">Collection</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-lg">
            Premium-quality products handpicked for excellence
          </p>
          <div className="w-16 h-[3px] bg-green-600 mt-4"></div>
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

              const isInCart = cartItems.some(item => 
                item.productId === p.id && 
                item.selectedVariantIndex === selectedVariantIndex
              );

              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="group bg-[#ecfdf5] rounded-2xl shadow-sm hover:shadow-xl border border-green-100 overflow-hidden cursor-pointer transition-all duration-300 flex flex-col min-w-[85%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[23%]"
                >

                  {/* IMAGE */}
                  <div className="relative bg-white aspect-square flex items-center justify-center m-3 rounded-xl overflow-hidden shadow-inner">

                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    />

                    {discount > 0 && (
                      <div className="absolute top-3 right-3 bg-green-600 text-white text-[11px] px-2.5 py-1 rounded-full font-bold shadow-md">
                        {discount}% OFF
                      </div>
                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="p-4 flex flex-col gap-3 flex-grow">

                    <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
                      {p.name}
                    </h3>

                    <ProductReviewStats productId={p.id} />

                    {/* PRICE & WEIGHT LABEL */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex flex-col">
                        <span className="text-xl font-medium text-gray-900">
                          ₹{selectedVariant.offerPrice * qty}
                        </span>
                        {base100g && (
                          <span className="text-[10px] text-gray-500 font-medium tracking-tight">
                            (₹{base100g.offerPrice}/100g)
                          </span>
                        )}
                      </div>
                      
                      {/* STATIC WEIGHT BADGE */}
                      <span className="px-3 py-1 bg-white border border-green-200 text-green-700 text-[11px] font-semibold rounded-full shadow-sm uppercase tracking-wide">
                        {selectedVariant.weightLabel}
                      </span>
                    </div>

                    {/* QUANTITY & CART ACTION */}
                    <div
                      className="flex items-center gap-3 mt-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* QUANTITY CONTROLS */}
                      <div className="flex items-center bg-white rounded-xl border border-green-200 p-1 shadow-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQtyMap((prev) => ({
                              ...prev,
                              [p.id]: Math.max(1, (prev[p.id] || 1) - 1),
                            }));
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-bold text-lg"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900">
                          {qty}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQtyMap((prev) => ({
                              ...prev,
                              [p.id]: (prev[p.id] || 1) + 1,
                            }));
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-bold text-lg"
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
                        className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-xl font-bold text-[13px] transition-all active:scale-95 shadow-md ${
                          isInCart
                            ? "bg-green-100 text-green-700 border-2 border-green-200"
                            : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
                        }`}
                      >
                        <FiShoppingCart size={16} />
                        {isInCart ? "ADDED" : "ADD TO CART"}
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
