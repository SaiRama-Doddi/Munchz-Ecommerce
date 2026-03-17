import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";
import { ArrowLeft, ChevronRight, Filter, ShoppingBag, Star, LayoutGrid, Check } from "lucide-react";
import PremiumSpinner from "../components/PremiumSpinner";
import axios from "../api/axios";
import { FiShoppingCart } from "react-icons/fi";

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
  category?: Category;
  categoryId?: number;
}

interface Category {
  id: number;
  name: string;
  thumbnailImage?: string;
}

/* ================= COMPONENTS ================= */

function ProductReviewStats({ productId }: { productId: number }) {
  const { data: reviews = [] } = useQuery({
    queryKey: ["product-reviews", productId],
    enabled: !!productId,
    queryFn: async () => {
      const res = await axios.get(`/reviews/product/${productId}`);
      return res.data as { rating: number }[];
    },
  });

  const total = reviews.length;
  const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={10} fill={s <= Math.round(avg) ? "currentColor" : "none"} strokeWidth={1.5} className={s <= Math.round(avg) ? "text-amber-400" : "text-gray-200"} />
        ))}
      </div>
      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mt-0.5">
        {avg.toFixed(1)} <span className="mx-1 opacity-50">|</span> {total} Reviews
      </span>
    </div>
  );
}

export default function AllProducts() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [cartClicked, setCartClicked] = useState<{ [key: number]: boolean }>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});
  const [price, setPrice] = useState(5000);
  const [weights, setWeights] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "ALL">("ALL");

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data as Product[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data as Category[];
    },
  });

  const toggleWeight = (w: number) => setWeights((prev) => prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]);

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const productCategoryId = p.category?.id ?? p.categoryId ?? null;
      const categoryMatch = selectedCategoryId === "ALL" || productCategoryId === selectedCategoryId;
      if (!categoryMatch) return false;
      const sellVariants = p.variants.filter((v: any) => v.weightInGrams !== 100);
      const priceMatch = sellVariants.some((v: any) => v.offerPrice <= price);
      const weightMatch = weights.length === 0 || sellVariants.some((v: any) => weights.includes(v.weightInGrams));
      return priceMatch && weightMatch;
    });
  }, [products, price, weights, selectedCategoryId]);

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

  if (isLoading) return <PremiumSpinner text="Unlocking The Full Collection..." />;
  if (isError) return <div className="p-20 text-center text-red-600 font-black uppercase tracking-widest text-xs">Collection Access Failure</div>;

  return (
    <div className="bg-white min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-4">
             <span className="h-px w-8 bg-emerald-600"></span>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Full Archive</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
             <div>
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter">Gourmet <br className="hidden md:block"/><span className="text-emerald-600 italic">Omnichannel</span></h2>
               <p className="text-[11px] font-black uppercase tracking-widest text-gray-300 mt-6">{filteredProducts.length} Premium Selections Identified</p>
             </div>
             
             <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-4 bg-gray-50 hover:bg-white border border-gray-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 px-8 py-4 rounded-2xl transition-all duration-500 lg:hidden">
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">Archive Filters</span>
                <Filter size={16} className="text-emerald-600" />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16 items-start">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="sticky top-32 space-y-16 hidden lg:block">
            {/* CATEGORY SELECTOR */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                 <LayoutGrid size={16} className="text-emerald-600" />
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Taxonomy</h3>
              </div>
              <div className="flex flex-col gap-3">
                 <button onClick={() => setSelectedCategoryId("ALL")} className={`h-14 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all text-left flex items-center justify-between ${selectedCategoryId === "ALL" ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700 shadow-lg shadow-emerald-50' : 'border-gray-50 text-gray-400 hover:border-gray-200'}`}>
                    ALL COLLECTIONS
                    {selectedCategoryId === "ALL" && <Check size={14}/>}
                 </button>
                 {categories.map((c) => (
                    <button key={c.id} onClick={() => setSelectedCategoryId(c.id)} className={`h-14 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all text-left flex items-center justify-between ${selectedCategoryId === c.id ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700 shadow-lg shadow-emerald-50' : 'border-gray-50 text-gray-400 hover:border-gray-200'}`}>
                       <span className="truncate pr-4">{c.name}</span>
                       {selectedCategoryId === c.id && <Check size={14}/>}
                    </button>
                 ))}
              </div>
            </div>

            {/* PRICE RANGE */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                 <Filter size={16} className="text-emerald-600" />
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Parameters</h3>
              </div>
              <div className="group mb-12">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 group-hover:text-emerald-600 transition-colors">Investment Peak</p>
                 <div className="flex justify-between items-end mb-4">
                    <p className="text-2xl font-black text-gray-900">₹{price}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Hard Cap</p>
                 </div>
                 <input type="range" min={0} max={5000} step={50} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-black h-1 bg-gray-100 rounded-full appearance-none cursor-pointer" />
              </div>

              {/* WEIGHT STANDARDS */}
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Weight Metrics</p>
                 <div className="grid gap-3">
                    {[250, 500, 750, 1000].map((w) => (
                       <div key={w} onClick={() => toggleWeight(w)} className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${weights.includes(w) ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700' : 'border-gray-50 text-gray-900 hover:border-gray-200'}`}>
                          <span className="text-[11px] font-black uppercase tracking-widest">{w === 1000 ? "1.0 KG" : `${w} GM`}</span>
                          <div className={`w-1.5 h-1.5 rounded-full ${weights.includes(w) ? 'bg-emerald-600 scale-150' : 'bg-gray-200'}`}></div>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <div className="space-y-16">
            
            {/* MOBILE CATEGORY SCROLLER */}
            <div className="lg:hidden">
              <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide no-scrollbar">
                <button onClick={() => setSelectedCategoryId("ALL")} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-2 transition-all ${selectedCategoryId === "ALL" ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700' : 'border-gray-50 text-gray-400'}`}>ALL</button>
                {categories.map((c) => (
                  <button key={c.id} onClick={() => setSelectedCategoryId(c.id)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-2 transition-all ${selectedCategoryId === c.id ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700' : 'border-gray-50 text-gray-400'}`}>{c.name}</button>
                ))}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
               <div className="py-32 flex flex-col items-center text-center bg-gray-50/30 border border-gray-50 rounded-[3rem]">
                  <ShoppingBag size={48} className="text-gray-100 mb-8" />
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Archive Zero</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest max-w-[250px] leading-relaxed">The requested gourmet sequence is currently unavailable in the vault.</p>
                  <button onClick={() => { setSelectedCategoryId("ALL"); setWeights([]); setPrice(5000); }} className="mt-10 text-emerald-600 font-black text-[11px] uppercase tracking-widest border-b border-emerald-600/20 hover:border-emerald-600 pb-1">Reset All Standards</button>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {filteredProducts.map((p) => {
                    const sellVariants = p.variants.filter((v: any) => v.weightInGrams !== 100);
                    const selIdx = variantMap[p.id] ?? 0;
                    const selVar = sellVariants[selIdx];
                    const qty = qtyMap[p.id] || 1;
                    if (!selVar) return null;
                    const disco = selVar.mrp > selVar.offerPrice ? Math.round(((selVar.mrp - selVar.offerPrice) / selVar.mrp) * 100) : 0;

                    return (
                      <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="group premium-card bg-white rounded-[2.5rem] overflow-hidden cursor-pointer flex flex-col transition-all duration-500 hover:shadow-2xl shadow-emerald-900/5">
                        <div className="relative bg-gray-50/50 aspect-square p-8 flex items-center justify-center overflow-hidden">
                           <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out" />
                           {disco > 0 && <div className="absolute top-6 right-6 bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-emerald-600/30 uppercase tracking-widest">{disco}% PRIVILEGE</div>}
                        </div>
                        <div className="p-8 flex flex-col gap-4 flex-grow">
                           <div>
                              <h3 className="text-[14px] font-black text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 uppercase tracking-wide">{p.name}</h3>
                              <ProductReviewStats productId={p.id} />
                           </div>
                           <div className="flex items-baseline gap-2 mt-2">
                              <span className="text-2xl font-black text-gray-900 tracking-tighter italic">₹{selVar.offerPrice * qty}</span>
                              {selVar.mrp > selVar.offerPrice && <span className="text-xs text-gray-300 line-through font-bold">₹{selVar.mrp * qty}</span>}
                           </div>
                           <div className="flex items-center gap-3 pt-6 mt-auto border-t border-gray-50" onClick={(e) => e.stopPropagation()}>
                              <div className="flex-1 relative">
                                 <select value={selIdx} onChange={(e) => setVariantMap(prev => ({ ...prev, [p.id]: parseInt(e.target.value) }))} className="w-full pl-4 pr-10 h-14 text-[11px] font-black uppercase tracking-widest border border-gray-100 rounded-2xl bg-gray-50/50 appearance-none outline-none focus:bg-white focus:border-emerald-500/30 transition-all cursor-pointer">
                                    {sellVariants.map((v: any, i: number) => <option key={i} value={i}>{v.weightLabel}</option>)}
                                 </select>
                                 <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 rotate-90" />
                              </div>
                              <button onClick={(e) => {
                                 e.stopPropagation();
                                 addToCart({ productId: p.id, name: p.name, imageUrl: p.imageUrl, variants: sellVariants, selectedVariantIndex: selIdx, qty });
                                 setCartClicked(prev => ({ ...prev, [p.id]: true }));
                                 setTimeout(() => setCartClicked(prev => ({ ...prev, [p.id]: false })), 2000);
                              }} className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 shadow-xl shadow-black/5 hover:scale-110 active:scale-95 ${cartClicked[p.id] ? "bg-emerald-600 text-white" : "bg-black text-white hover:bg-emerald-600"}`}>
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

      {/* MOBILE FILTER MODAL/DRAWER OVERLAY REDESIGN */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[120] flex items-end animate-fadeIn">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative bg-white w-full rounded-t-[3rem] p-10 shadow-2xl animate-slideUp">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Active Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">✕</button>
             </div>
             
             <div className="space-y-10 mb-10">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Investment Threshold</p>
                   <p className="text-2xl font-black text-gray-900 mb-4">₹{price}</p>
                   <input type="range" min={0} max={5000} step={50} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-black h-1 bg-gray-100 rounded-full appearance-none cursor-pointer" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Standard Weights</p>
                   <div className="grid grid-cols-2 gap-4">
                      {[250, 500, 750, 1000].map((w) => (
                        <div key={w} onClick={() => toggleWeight(w)} className={`px-5 py-4 rounded-xl border-2 text-center text-[10px] font-black uppercase tracking-widest transition-all ${weights.includes(w) ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-50 text-gray-400'}`}>{w === 1000 ? "1KG" : `${w}G`}</div>
                      ))}
                   </div>
                </div>
             </div>

             <button onClick={() => setIsFilterOpen(false)} className="w-full h-18 bg-black text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-black/10">Authorize Selection</button>
          </div>
        </div>
      )}
    </div>
  );
}
