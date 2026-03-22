import React, { useEffect, useState } from "react";
import { useCart } from "../state/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/coupon";
import { Trash2, Plus, Minus, X, Check, ShoppingBag, ChevronRight, Bookmark, ShieldCheck, Truck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PremiumSpinner from "../components/PremiumSpinner";

export default function CartPremium() {
  const { items, updateQty, changeVariant, removeItem } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const { profile } = useAuth();
  const userId = profile?.id;

  /* ================= TOTAL CALCULATIONS ================= */
  const totalMrp = items.reduce((sum, item) => {
    const v = item.variants[item.selectedVariantIndex];
    return sum + (v.mrp || v.offerPrice) * item.qty;
  }, 0);

  const totalPrice = items.reduce((sum, item) => {
    const v = item.variants[item.selectedVariantIndex];
    return sum + v.offerPrice * item.qty;
  }, 0);

  const finalAmount = Math.max(totalPrice - discount, 0);

  /* ================= FETCH COUPONS ================= */
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/coupons");
        setAvailableCoupons(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      }
    };
    fetchCoupons();
  }, []);

  /* ================= APPLY COUPON ================= */
  const applyCoupon = async (code: string) => {
    if (!code || appliedCoupon) return;
    if (!userId) {
      setCouponMessage("Please login to apply coupon");
      setMessageType("error");
      return;
    }
    try {
      setLoadingCoupon(true);
      const res = await api.post("/coupons/apply", { couponCode: code, orderAmount: totalPrice }, { headers: { "X-USER-ID": userId } });
      setDiscount(res.data.appliedDiscount);
      setAppliedCoupon(code);
      setCouponMessage(`Coupon "${code}" applied successfully`);
      setMessageType("success");
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } catch (error: any) {
      setDiscount(0);
      setCouponMessage(error?.response?.data?.message || "Invalid coupon");
      setMessageType("error");
    } finally {
      setLoadingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCoupon("");
    setCouponMessage("Coupon removed");
  };

  const savingsAmount = totalMrp - totalPrice;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
           <ShoppingBag size={56} className="text-green-200" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/productpage')}
          className="bg-green-600 text-white font-bold px-10 py-4 rounded-2xl shadow-lg hover:bg-green-700 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          EXPLORE SNACKS <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      
      {/* CELEBRATION */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
          <div className="relative text-center animate-bounce">
            <h2 className="text-4xl font-black text-gray-900 mt-4 drop-shadow-xl">COUPON APPLIED! 🎉</h2>
          </div>
        </div>
      )}

      {/* HEADER - STICKY MINIMAL */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter">My <span className="text-green-600">Cart</span></h1>
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-gray-50 hover:bg-green-50 rounded-2xl transition-all border border-gray-100 hover:border-green-200 text-gray-400 hover:text-green-600"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* BRAND BANNER - MATCHING HOME PAGE EXACTLY */}
      <section className="relative w-full overflow-hidden bg-white py-12 md:py-20 border-b border-gray-100 hidden sm:block">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-gray-900">
            <p className="text-xl md:text-2xl font-medium text-green-600/80">Pure Ingredients</p>
            <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight italic">Real ingredients</h2>
              <h2 className="text-4xl md:text-6xl font-light leading-tight tracking-tight text-gray-700 italic">Unreal flavor</h2>
            </div>
            <p className="text-xl md:text-2xl font-medium text-green-600/80 pt-2">Absolutely zero compromise</p>
            <div className="pt-8">
              <span className="inline-block text-3xl md:text-4xl font-bold tracking-tight">GoMunchZ</span>
              <div className="w-20 h-1 bg-green-500 mt-2 rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-end opacity-20"><ShoppingBag size={200} strokeWidth={0.5} /></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 pb-32">
        
        {/* CURATED COLLECTION STYLE HEADER FOR ITEMS */}
        <div className="mb-12">
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Curated <span className="text-green-600">Collection</span>
           </h2>
           <p className="text-gray-400 font-medium text-sm mt-3 uppercase tracking-widest">Handpicked snacks for your unique taste</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="space-y-4 px-2 sm:px-0">
              {items.map((item, i) => {
                const v = item.variants[item.selectedVariantIndex];
                const discPercent = Math.round((( (v.mrp || v.offerPrice) - v.offerPrice) / (v.mrp || v.offerPrice) || 0) * 100);

                return (
                  <div key={i} className="bg-white rounded-[2rem] p-3 sm:p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex items-center gap-4 relative overflow-hidden">
                    
                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-[#ecfdf5]/40 rounded-2xl sm:rounded-3xl overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} className="w-full h-full object-contain p-2 sm:p-4" alt={item.name} />
                      {discPercent > 0 && (
                        <div className="absolute top-0 left-0 bg-green-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-br-xl uppercase">{discPercent}%</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-sm sm:text-lg font-bold text-gray-900 tracking-tight leading-tight line-clamp-1 truncate uppercase">{item.name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{v.weightLabel} PACK</p>
                        </div>
                        <button onClick={() => removeItem(i)} className="sm:hidden w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full border border-red-100 flex-shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 sm:mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-2xl font-black text-gray-900 tracking-tighter italic">₹{v.offerPrice}</span>
                          {v.mrp > v.offerPrice && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through font-bold">₹{v.mrp}</span>
                          )}
                        </div>

                        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl p-1 gap-1 shadow-inner">
                          <button onClick={() => updateQty(i, Math.max(item.qty - 1, 1))} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-all"><Minus size={12} /></button>
                          <span className="w-4 text-center text-xs font-black text-gray-900">{item.qty}</span>
                          <button onClick={() => updateQty(i, item.qty + 1)} className="w-7 h-7 flex items-center justify-center bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all"><Plus size={12} /></button>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:block">
                       <button onClick={() => removeItem(i)} className="p-3 bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all border border-gray-100 hover:border-red-100">
                          <Trash2 size={18} />
                       </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* COUPONS - MINIMAL */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12"><Bookmark size={80} /></div>
               <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                 <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                 Exclusive Offers
               </h3>

               <div className="space-y-3">
                 {availableCoupons.map((c) => {
                   const isEligible = totalPrice >= (c.minAmount || 0);
                   const isApplied = appliedCoupon === c.code;
                   return (
                     <div key={c.id} className={`p-5 rounded-2xl border-2 transition-all relative group ${isEligible ? 'bg-white border-green-100' : 'bg-gray-50/50 border-gray-50 opacity-60'}`}>
                        <div className="flex justify-between items-center relative z-10">
                          <div>
                            <p className="font-black text-gray-900 tracking-tight uppercase italic">{c.code}</p>
                            <p className="text-[10px] text-green-600 font-bold mt-1 uppercase tracking-tighter">Get extra savings</p>
                          </div>
                          {isEligible && (
                            <button 
                              onClick={() => isApplied ? removeCoupon() : applyCoupon(c.code)}
                              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${isApplied ? 'bg-red-50 text-red-600' : 'bg-gray-900 text-white'}`}
                            >
                              {isApplied ? 'Remove' : 'Apply'}
                            </button>
                          )}
                        </div>
                     </div>
                   );
                 })}
               </div>
               
               {couponMessage && (
                 <div className={`mt-6 p-4 rounded-xl text-xs font-bold border-2 ${messageType === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                   {couponMessage}
                 </div>
               )}
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white rounded-[2rem] p-8 border-2 border-gray-900 shadow-2xl lg:sticky lg:top-32 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-[0.02] rotate-12"><ShoppingBag size={100} /></div>
               <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tighter uppercase italic">Grand Summary</h3>
               
               <div className="space-y-4 mb-10">
                 <div className="flex justify-between items-baseline px-2">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SUBTOTAL</p>
                   <p className="text-lg font-black text-gray-900 tracking-tighter">₹{totalPrice.toFixed(0)}</p>
                 </div>
                 {savingsAmount > 0 && (
                   <div className="flex justify-between items-center px-4 py-2 bg-green-50/50 rounded-xl">
                     <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">SAVINGS</span>
                     <span className="font-black text-green-600">-₹{savingsAmount.toFixed(0)}</span>
                   </div>
                 )}
                 <div className="flex justify-between items-baseline px-2">
                   <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">SHIPPING</p>
                   <p className="text-xs font-black text-green-600 uppercase tracking-widest">COMPLEMENTARY</p>
                 </div>
                 
                 <div className="h-px bg-gray-100 my-4"></div>

                 <div className="flex flex-col gap-1 bg-gray-900 text-white p-6 rounded-[2rem] shadow-xl">
                   <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.4em]">AMOUNT PAYABLE</p>
                   <p className="text-5xl font-black tracking-tighter italic">₹{finalAmount.toFixed(0)}</p>
                 </div>
               </div>

               <button
                 onClick={() => navigate("/checkout", { state: { items, totalAmount: finalAmount, discount, appliedCoupon } })}
                 className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-green-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group border-none outline-none"
               >
                 <span>CONFIRM ORDER</span>
                 <ChevronRight className="group-hover:translate-x-1 transition-transform" />
               </button>

               <div className="mt-8 flex flex-col items-center gap-2 opacity-30">
                 <div className="flex gap-4">
                   <ShieldCheck size={16} />
                   <Truck size={16} />
                 </div>
                 <p className="text-[8px] font-bold uppercase tracking-widest leading-none">Safe & Fast Fulfillment</p>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
