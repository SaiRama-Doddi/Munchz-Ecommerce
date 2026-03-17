import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, Star, ChevronRight, ShoppingBag, Plus, Minus, Info, CheckCircle2 } from "lucide-react";
import axios from "axios";
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
  imageUrls: string[];
  description: string;
  variants: Variant[];
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  createdAt: string;
}

/* ================= HOOKS ================= */

function useProductReviews(productId: number) {
  return useQuery({
    queryKey: ["product-reviews", productId],
    enabled: !!productId,
    queryFn: async () => {
      const res = await axios.get(`/reviews/product/${productId}`);
      return res.data as Review[];
    },
  });
}

function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data as Product;
    },
  });
}

function useRelatedProducts(currentId: number) {
  return useQuery({
    queryKey: ["related-products", currentId],
    enabled: !!currentId,
    queryFn: async () => {
      const res = await api.get("/products");
      return (res.data as Product[]).filter((p) => p.id !== currentId);
    },
  });
}

/* ================= COMPONENTS ================= */

export default function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [cartClicked, setCartClicked] = useState<{ [key: number]: boolean }>({});

  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: reviews } = useProductReviews(productId);
  const { data: relatedProducts } = useRelatedProducts(productId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (isLoading) return <PremiumSpinner text="Securing Your Gourmet Selection..." />;

  if (isError || !product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-10">
        <div className="text-center">
          <Info size={48} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Protocol Failure</h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-4">The requested asset could not be retrieved from the archive.</p>
          <button onClick={() => navigate("/")} className="mt-10 px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Return Home</button>
        </div>
      </div>
    );
  }

  const images = product.imageUrls?.length > 0 ? product.imageUrls : [product.imageUrl];
  const base100g = product.variants.find((v) => v.weightInGrams === 100);
  const variants = product.variants.filter((v) => v.weightInGrams !== 100);
  const selectedVariant = variants[selectedVariantIndex] || base100g;

  const totalReviews = reviews?.length || 0;
  const averageRating = totalReviews > 0 ? reviews!.reduce((s, r) => s + r.rating, 0) / totalReviews : 0;

  return (
    <div className="bg-white min-h-screen">
      <TopHeader />
      <Header />

      <main className="py-12 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-emerald-600 transition-all mb-12 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
            Archive Navigation
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-16 lg:gap-24 items-start">
            
            {/* LEFT: VISUALS */}
            <div className="space-y-8">
              <div className="relative aspect-square flex items-center justify-center p-10 bg-gray-50/50 rounded-[4rem] border border-gray-100 overflow-hidden premium-card group"
                   onMouseEnter={() => setIsHovering(true)}
                   onMouseLeave={() => setIsHovering(false)}
                   onMouseMove={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const x = ((e.clientX - rect.left) / rect.width) * 100;
                     const y = ((e.clientY - rect.top) / rect.height) * 100;
                     setZoomPos({ x, y });
                   }}>
                <img src={selectedImage || images[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out" />
                
                {/* ZOOM PORTAL */}
                {isHovering && (
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none hidden lg:block z-50 overflow-hidden rounded-[4rem]">
                    <div className="w-full h-full bg-no-repeat shadow-inner"
                         style={{
                           backgroundImage: `url(${selectedImage || images[0]})`,
                           backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                           backgroundSize: "250%",
                         }} />
                  </div>
                )}
              </div>

              {/* THUMBNAIL SEQUENCE */}
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(img)} className={`shrink-0 w-24 h-24 rounded-3xl p-3 border-2 transition-all duration-500 overflow-hidden flex items-center justify-center ${ (selectedImage || images[0]) === img ? 'border-emerald-600 bg-emerald-50/30 shadow-lg shadow-emerald-600/10' : 'border-gray-50 bg-gray-50/20 hover:border-gray-200'}`}>
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: SPECIFICATIONS */}
            <div className="space-y-12">
               <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-8 bg-emerald-600"></span>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Premium Portfolio Selection</p>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-tight mb-4">{product.name}</h1>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill={s <= Math.round(averageRating) ? "currentColor" : "none"} className={s <= Math.round(averageRating) ? "text-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">
                      {averageRating.toFixed(1)} <span className="mx-2 opacity-30">|</span> {totalReviews} Verified Experiences
                    </p>
                  </div>
               </div>

               <div className="grid gap-10">
                  <div className="flex items-baseline gap-4">
                     <p className="text-5xl font-black text-gray-900 tracking-tighter italic">₹{selectedVariant?.offerPrice * qty}</p>
                     {selectedVariant?.mrp > selectedVariant?.offerPrice && (
                       <p className="text-xl text-gray-300 line-through font-bold">₹{selectedVariant?.mrp * qty}</p>
                     )}
                     {base100g && (
                       <div className="ml-auto bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">₹{base100g.offerPrice} / 100g Value</p>
                       </div>
                     )}
                  </div>

                  <div className="space-y-8">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Quantity Matrix</p>
                        <div className="inline-flex items-center p-1.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                           <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-14 h-14 bg-white text-gray-400 hover:text-emerald-600 rounded-xl shadow-sm flex items-center justify-center transition-all active:scale-90"><Minus size={18} /></button>
                           <span className="w-20 text-center font-black text-xl text-gray-900">{qty}</span>
                           <button onClick={() => setQty(qty + 1)} className="w-14 h-14 bg-white text-gray-400 hover:text-emerald-600 rounded-xl shadow-sm flex items-center justify-center transition-all active:scale-90"><Plus size={18} /></button>
                        </div>
                     </div>

                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Density Selection</p>
                        <div className="flex flex-wrap gap-4">
                           {variants.map((v, i) => (
                             <button key={i} onClick={() => setSelectedVariantIndex(i)} className={`h-16 px-8 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 border-2 ${selectedVariantIndex === i ? 'bg-black text-white border-black shadow-2xl shadow-black/20 scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}>
                               {v.weightLabel}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-6">
                  <button onClick={() => {
                    addToCart({ productId: product.id, name: product.name, imageUrl: product.imageUrl, variants, selectedVariantIndex, qty });
                    setCartClicked(prev => ({ ...prev, [product.id]: true }));
                    setTimeout(() => setCartClicked(prev => ({ ...prev, [product.id]: false })), 2000);
                  }} className={`flex-1 h-20 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl flex items-center justify-center gap-4 active:scale-95 ${cartClicked[product.id] ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-black text-white shadow-black/10 hover:bg-emerald-600'}`}>
                    {cartClicked[product.id] ? <><CheckCircle2 size={24} /> Portfolio Updated</> : <><ShoppingBag size={24} /> Secure to Archive</>}
                  </button>

                  <button onClick={() => {
                    addToCart({ productId: product.id, name: product.name, imageUrl: product.imageUrl, variants, selectedVariantIndex, qty });
                    navigate("/cart");
                  }} className="flex-1 h-20 bg-emerald-600 text-white rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all duration-500 shadow-xl shadow-emerald-900/20 active:scale-95">
                    Acquire Selection Now
                  </button>
               </div>

               <div className="p-10 bg-gray-50/50 border border-gray-100 rounded-[3rem] space-y-8">
                  <div className="flex items-center gap-3">
                    <Info size={18} className="text-emerald-600" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Archive Details</h3>
                  </div>
                  <div className="space-y-6">
                    {product.description?.split(".").filter(Boolean).map((line, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0 opacity-40" />
                        <p className="text-[14px] font-bold text-gray-500 tracking-wide leading-relaxed">{line.trim()}.</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* REVIEWS ARCHIVE */}
          <div className="mt-32 space-y-20">
             <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div>
                   <div className="flex items-center gap-3 mb-4">
                      <span className="h-px w-8 bg-emerald-600"></span>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Public Testimony</p>
                   </div>
                   <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">Verified <span className="text-emerald-600 italic">Analysis</span></h2>
                </div>
                {totalReviews > 0 && <span className="h-12 px-8 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-[11px] font-black text-emerald-600 uppercase tracking-widest">{averageRating.toFixed(1)} Portfolio Score</span>}
             </header>

             {totalReviews === 0 ? (
               <div className="py-24 text-center bg-gray-50/30 rounded-[3rem] border border-gray-50">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm text-gray-200"><Star size={32} /></div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">No Testimony Recorded</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-4">Be the first to analyze this premium selection.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {reviews?.slice(0, visibleReviews).map((r) => (
                    <div key={r.id} className="premium-card bg-white p-10 rounded-[2.5rem] border border-gray-50 flex flex-col gap-8 transition-all duration-500 hover:shadow-2xl shadow-emerald-900/5">
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-sm uppercase">{r.userName.charAt(0)}</div>
                              <div>
                                 <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{r.userName}</p>
                                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={10} fill={s <= r.rating ? "currentColor" : "none"} className={s <= r.rating ? "text-amber-400" : "text-gray-100"} />
                              ))}
                           </div>
                        </div>
                        <p className="text-[14px] font-bold text-gray-500 tracking-wide leading-relaxed italic">"{r.comment}"</p>
                        {r.imageUrl && (
                          <div className="w-full aspect-square rounded-2xl overflow-hidden border border-gray-100 p-2 bg-gray-50/50">
                             <img src={r.imageUrl} alt="review" className="w-full h-full object-cover rounded-xl" />
                          </div>
                        )}
                    </div>
                  ))}
               </div>
             )}

             {totalReviews > visibleReviews && (
               <div className="text-center pt-10">
                  <button onClick={() => setVisibleReviews(prev => prev + 6)} className="h-16 px-12 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm">Expand Testimony Archive</button>
               </div>
             )}
          </div>

          {/* DISCOVERY SEQUENCE */}
          <div className="mt-40 space-y-20 pb-20">
             <header>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-8 bg-emerald-600"></span>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Discovery Sequence</p>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">You May Also <span className="text-emerald-600 italic">Desire</span></h2>
             </header>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {relatedProducts?.slice(0, 4).map((p) => {
                  const sellVariants = p.variants.filter((v) => v.weightInGrams !== 100);
                  const selVar = sellVariants[0];
                  if (!selVar) return null;
                  const disc = selVar.mrp > selVar.offerPrice ? Math.round(((selVar.mrp - selVar.offerPrice) / selVar.mrp) * 100) : 0;

                  return (
                    <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="group premium-card bg-white rounded-[2.5rem] overflow-hidden cursor-pointer flex flex-col transition-all duration-500 hover:shadow-2xl shadow-emerald-900/5">
                        <div className="relative bg-gray-50/50 aspect-square p-8 flex items-center justify-center overflow-hidden">
                           <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out" />
                           {disc > 0 && <div className="absolute top-6 right-6 bg-emerald-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-600/30">{disc}% PRIVILEGE</div>}
                        </div>
                        <div className="p-8 flex flex-col gap-4 flex-grow">
                           <h3 className="text-[13px] font-black text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 uppercase tracking-wide">{p.name}</h3>
                           <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                              <p className="text-xl font-black text-gray-900 tracking-tighter">₹{selVar.offerPrice}</p>
                              <div className="w-10 h-10 bg-gray-50 text-gray-300 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all"><ChevronRight size={18} /></div>
                           </div>
                        </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
