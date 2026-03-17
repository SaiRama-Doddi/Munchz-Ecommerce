import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";
import { ArrowLeft, ChevronRight, Filter } from "lucide-react";
import ProductReviewStats from "./ProductReviewStats";
import Footer from "../components/Footer";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import { FiShoppingCart } from "react-icons/fi";
import PremiumSpinner from "../components/PremiumSpinner";

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

  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});
  const [price, setPrice] = useState(5000);
  const [weights, setWeights] = useState<number[]>([]);
  const [cartClicked, setCartClicked] = useState<{ [key: number]: boolean }>({});

  const toggleWeight = (w: number) =>
    setWeights((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["search-products", keyword],
    enabled: !!keyword,
    queryFn: async () => {
      const res = await api.get(`/products/search?keyword=${keyword}`);
      return res.data as Product[];
    },
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const sellVariants = p.variants.filter((v) => v.weightInGrams !== 100);
      const priceMatch = sellVariants.some((v) => v.offerPrice <= price);
      const weightMatch = weights.length === 0 || sellVariants.some((v) => weights.includes(v.weightInGrams));
      return priceMatch && weightMatch;
    });
  }, [products, price, weights]);

  useEffect(() => {
    if (weights.length === 0) return;
    const preferredWeight = weights[0];
    setVariantMap((prev) => {
      const updated = { ...prev };
      products.forEach((p) => {
        const sellVariants = p.variants.filter((v) => v.weightInGrams !== 100);
        const matchIndex = sellVariants.findIndex((v) => v.weightInGrams === preferredWeight);
        if (matchIndex !== -1) updated[p.id] = matchIndex;
      });
      return updated;
    });
  }, [weights, products]);

  if (isLoading) {
    return <PremiumSpinner text="Navigating Gourmet Archives..." />;
  }

  return (
    <>
      <TopHeader />
      <Header />
      
      <div className="bg-white min-h-screen py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          <header className="mb-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-emerald-600"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Search Discovery</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              Found <span className="text-emerald-600 underline decoration-emerald-200 decoration-8 underline-offset-[-2px]">"{keyword}"</span>
            </h2>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mt-6">{filteredProducts.length} Selections Available</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16 items-start">
            
            {/* PRECISE FILTERS */}
            <aside className="sticky top-32 space-y-12 hidden lg:block">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <Filter size={16} className="text-emerald-600" />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Refinement</h3>
                </div>

                <div className="space-y-10">
                  {/* PRICE RANGE */}
                  <div className="group">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 group-hover:text-emerald-600 transition-colors">Investment Threshold</p>
                    <div className="flex justify-between items-end mb-4">
                      <p className="text-2xl font-black text-gray-900">₹{price}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Limit</p>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={5000}
                      step={50}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full accent-black h-1 bg-gray-100 rounded-full appearance-none cursor-pointer"
                    />
                  </div>

                  {/* WEIGHT PREFERENCE */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Weight Standards</p>
                    <div className="grid gap-3">
                      {[250, 500, 750, 1000].map((w) => (
                        <div
                          key={w}
                          onClick={() => toggleWeight(w)}
                          className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${weights.includes(w) ? 'border-emerald-600 bg-emerald-50/30' : 'border-gray-50 hover:border-gray-200'}`}
                        >
                          <span className={`text-[12px] font-black uppercase tracking-widest ${weights.includes(w) ? 'text-emerald-700' : 'text-gray-900'}`}>{w === 1000 ? "1.0 KG" : `${w} GM`}</span>
                          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${weights.includes(w) ? 'bg-emerald-600 scale-150 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-200'}`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* RESULTS GRID */}
            <div>
              {filteredProducts.length === 0 ? (
                <div className="py-32 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100">
                    <ArrowLeft size={32} className="text-gray-200" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">Archives Empty</h3>
                  <p className="text-sm text-gray-400 font-bold max-w-xs leading-relaxed uppercase tracking-wide">The requested collection is currently unavailable in our vault.</p>
                  <button onClick={() => navigate("/")} className="mt-10 text-emerald-600 font-black text-[11px] uppercase tracking-widest border-b-2 border-emerald-600/20 hover:border-emerald-600 transition-all pb-1">Return to Collection</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {filteredProducts.map((p) => {
                    const base100g = p.variants.find((v) => v.weightInGrams === 100);
                    const sellVariants = p.variants.filter((v) => v.weightInGrams !== 100);
                    const selectedVariantIndex = variantMap[p.id] ?? 0;
                    const selectedVariant = sellVariants[selectedVariantIndex];
                    const qty = qtyMap[p.id] || 1;

                    if (!selectedVariant) return null;

                    const discount = selectedVariant.mrp > selectedVariant.offerPrice ? Math.round(((selectedVariant.mrp - selectedVariant.offerPrice) / selectedVariant.mrp) * 100) : 0;

                    return (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/product/${p.id}`)}
                        className="group premium-card bg-white rounded-[2.5rem] overflow-hidden cursor-pointer flex flex-col transition-all duration-500 hover:shadow-2xl shadow-emerald-900/5"
                      >
                        <div className="relative bg-gray-50/50 aspect-square p-8 flex items-center justify-center overflow-hidden">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          {discount > 0 && (
                            <div className="absolute top-6 right-6 bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-emerald-600/30 uppercase tracking-widest">
                              {discount}% Privilege
                            </div>
                          )}
                        </div>

                        <div className="p-8 flex flex-col gap-4 flex-grow">
                          <div>
                            <h3 className="text-[14px] font-black text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 uppercase tracking-wide">{p.name}</h3>
                            <ProductReviewStats productId={p.id} />
                          </div>

                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-2xl font-black text-gray-900">₹{selectedVariant.offerPrice * qty}</span>
                            {selectedVariant.mrp > selectedVariant.offerPrice && (
                              <span className="text-xs text-gray-300 line-through font-bold">₹{selectedVariant.mrp * qty}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 pt-6 mt-auto border-t border-gray-50" onClick={(e) => e.stopPropagation()}>
                            <div className="flex-1 relative">
                              <select
                                value={selectedVariantIndex}
                                onChange={(e) => setVariantMap((prev) => ({ ...prev, [p.id]: parseInt(e.target.value) }))}
                                className="w-full pl-4 pr-10 h-14 text-[11px] font-black uppercase tracking-widest border border-gray-100 rounded-2xl bg-gray-50/50 appearance-none outline-none focus:bg-white focus:border-emerald-500/30 transition-all cursor-pointer"
                              >
                                {sellVariants.map((v, i) => <option key={i} value={i}>{v.weightLabel}</option>)}
                              </select>
                              <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 rotate-90" />
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
                                setCartClicked(prev => ({ ...prev, [p.id]: true }));
                                setTimeout(() => setCartClicked(prev => ({ ...prev, [p.id]: false })), 2000);
                              }}
                              className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 shadow-xl shadow-black/5 hover:scale-110 active:scale-95 ${cartClicked[p.id] ? "bg-emerald-600 text-white" : "bg-black text-white hover:bg-emerald-600"}`}
                            >
                              {cartClicked[p.id] ? <Check size={18} /> : <FiShoppingCart size={18} />}
                            </button>
                          </div>
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

      <Footer />
    </>
  );
}
