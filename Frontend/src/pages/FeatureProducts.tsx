import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";
import axios from "../api/axios";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
      <div className="bg-white min-h-[400px] flex items-center justify-center">
        <PremiumSpinner text="Curating selection..." />
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
    <div className="bg-white py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HEADING */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-emerald-600"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
              GoMunchZ Favorites
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight tracking-[-0.03em]">
            Signature <span className="text-emerald-600 italic">Collection</span>
          </h2>
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
                  className="group premium-card bg-white rounded-[2.5rem] overflow-hidden cursor-pointer flex flex-col min-w-[300px] md:min-w-[320px] lg:min-w-[340px] mb-8"
                >
                  {/* IMAGE */}
                  <div className="relative bg-gray-50/50 aspect-square p-6 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>

                    {discount > 0 && (
                      <div className="absolute top-6 right-6 bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-emerald-600/30 uppercase tracking-widest">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-8 flex flex-col gap-4 flex-grow">
                    <div>
                      <h3 className="text-[15px] font-black text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 uppercase tracking-wide">
                        {p.name}
                      </h3>
                      <ProductReviewStats productId={p.id} />
                    </div>

                    {/* PRICE */}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-black text-gray-900">
                        ₹{selectedVariant.offerPrice * qty}
                      </span>
                      {selectedVariant.mrp > selectedVariant.offerPrice && (
                        <span className="text-xs text-gray-400 line-through font-bold">
                          ₹{selectedVariant.mrp * qty}
                        </span>
                      )}
                      {base100g && (
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest ml-auto bg-emerald-50 px-2 py-0.5 rounded">
                          ₹{base100g.offerPrice}/100g
                        </span>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div
                      className="flex items-center gap-3 pt-4 mt-auto border-t border-gray-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex-1 relative">
                        <select
                          value={selectedVariantIndex}
                          onChange={(e) =>
                            setVariantMap((prev) => ({
                              ...prev,
                              [p.id]: parseInt(e.target.value),
                            }))
                          }
                          className="w-full pl-4 pr-10 py-3.5 text-[11px] font-black uppercase tracking-widest border border-gray-100 rounded-xl bg-gray-50/50 appearance-none outline-none focus:bg-white focus:border-emerald-500/30 transition-all cursor-pointer"
                        >
                          {sellVariants.map((v, i) => (
                            <option key={i} value={i}>
                              {v.weightLabel}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
                          <FiChevronRight size={14} className="rotate-90" />
                        </div>
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
                          setCartClicked((prev) => ({
                            ...prev,
                            [p.id]: true,
                          }));
                          setTimeout(() => {
                            setCartClicked((prev) => ({
                              ...prev,
                              [p.id]: false,
                            }));
                          }, 2000);
                        }}
                        className={`min-w-[60px] h-[52px] flex items-center justify-center rounded-xl transition-all duration-300 shadow-xl shadow-black/5 hover:scale-105 active:scale-95 ${
                          cartClicked[p.id]
                            ? "bg-emerald-600 text-white"
                            : "bg-black text-white hover:bg-emerald-600"
                        }`}
                      >
                        {cartClicked[p.id] ? (
                          <span className="text-[10px] font-black uppercase tracking-widest px-4">Added</span>
                        ) : (
                          <FiShoppingCart size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        {/* MOBILE ARROWS */}
        <div className="flex items-center gap-6 mt-12">
          <div className="h-px flex-1 bg-gray-100"></div>
          <div className="flex gap-4">
            <button
              onClick={scrollLeft}
              className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white shadow-premium-soft border border-gray-100 text-gray-400 hover:text-emerald-700 hover:border-emerald-100 transition-all active:scale-95"
            >
              <FiChevronLeft size={24} />
            </button>

            <button
              onClick={scrollRight}
              className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white shadow-premium-soft border border-gray-100 text-gray-400 hover:text-emerald-700 hover:border-emerald-100 transition-all active:scale-95"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
          <div className="h-px flex-1 bg-gray-100"></div>
        </div>
          {/* RIGHT BUTTON */}
        
        </div>
      </div>
    </div>
  );
}
