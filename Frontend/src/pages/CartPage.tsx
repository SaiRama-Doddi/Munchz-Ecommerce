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

  const totalPrice = items.reduce((sum, item) => {
    const v = item.variants[item.selectedVariantIndex];
    return sum + v.offerPrice * item.qty;
  }, 0);

  const finalAmount = Math.max(totalPrice - discount, 0);

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-8 animate-pulse text-green-200">
           <ShoppingBag size={56} />
        </div>
        <h2 className="text-3xl font-medium text-gray-900 mb-3 tracking-tight">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/productpage')}
          className="bg-green-600 text-white font-medium px-10 py-4 rounded-2xl shadow-lg hover:bg-green-700 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          EXPLORE SNACKS <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white font-medium">
      
      {/* CELEBRATION */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
          <div className="relative text-center animate-bounce">
            <h2 className="text-4xl font-medium text-gray-900 mt-4 drop-shadow-xl">COUPON APPLIED! 🎉</h2>
          </div>
        </div>
      )}

      {/* HEADER - STICKY MINIMAL */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-8 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-4xl font-medium text-gray-900 tracking-tighter uppercase">My <span className="text-green-600">Cart</span></h1>
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-gray-50 hover:bg-green-50 rounded-2xl transition-all border border-gray-100 hover:border-green-200 text-gray-400 hover:text-green-600"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 pb-32">
        
        {/* CURATED COLLECTION STYLE HEADER */}
        <div className="mb-16">
           <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900">
              Curated <span className="text-green-600">Collection</span>
           </h2>
           <p className="text-gray-400 font-medium text-sm mt-4 uppercase tracking-widest">Handpicked snacks for your unique taste</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              {items.map((item, i) => {
                const v = item.variants[item.selectedVariantIndex];
                return (
                  <div key={i} className="bg-white rounded-[2rem] p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex items-center gap-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#ecfdf5]/40 rounded-3xl overflow-hidden flex-shrink-0 border border-gray-50">
                      <img src={item.imageUrl} className="w-full h-full object-contain p-4" alt={item.name} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg sm:text-2xl font-medium text-gray-900 tracking-tight truncate uppercase">{item.name}</h4>
                          <p className="text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-widest">{v.weightLabel} pack</p>
                        </div>
                        <button onClick={() => removeItem(i)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                           <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        <span className="text-xl sm:text-3xl font-medium text-gray-900 tracking-tighter">₹{v.offerPrice}</span>

                        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1.5 gap-2 shadow-inner">
                          <button onClick={() => updateQty(i, Math.max(item.qty - 1, 1))} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-white rounded-xl transition-all"><Minus size={14} /></button>
                          <span className="w-6 text-center text-sm font-medium text-gray-900">{item.qty}</span>
                          <button onClick={() => updateQty(i, item.qty + 1)} className="w-9 h-9 flex items-center justify-center bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-all"><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-1 space-y-10">
            
            {/* OFFERS */}
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 shadow-sm">
               <h3 className="text-xl font-medium text-gray-900 mb-8 flex items-center gap-3">
                 <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                 Offers
               </h3>

               <div className="space-y-4">
                 {availableCoupons.map((c) => {
                   const isEligible = totalPrice >= (c.minAmount || 0);
                   const isApplied = appliedCoupon === c.code;
                   return (
                     <div key={c.id} className={`p-6 rounded-3xl border transition-all ${isApplied ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900 uppercase tracking-widest">{c.code}</p>
                            <p className="text-[10px] text-green-600 font-medium uppercase tracking-[0.2em] mt-1">Special savings</p>
                          </div>
                          {isEligible && (
                            <button 
                              onClick={() => isApplied ? removeCoupon() : applyCoupon(c.code)}
                              className={`px-5 py-2.5 rounded-xl text-[10px] uppercase font-medium transition-all ${isApplied ? 'bg-white text-red-600 shadow-sm' : 'bg-gray-900 text-white shadow-lg'}`}
                            >
                              {isApplied ? 'Remove' : 'Apply'}
                            </button>
                          )}
                        </div>
                     </div>
                   );
                 })}
               </div>
            </div>

            {/* GRAND SUMMARY */}
            <div className="bg-white rounded-[3rem] p-10 border border-gray-900 shadow-2xl lg:sticky lg:top-32">
               <h3 className="text-2xl font-medium text-gray-900 mb-10 tracking-tighter uppercase">Order Summary</h3>
               
               <div className="space-y-6 mb-12">
                 <div className="flex justify-between items-baseline px-2">
                   <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.3em]">Subtotal</p>
                   <p className="text-2xl font-medium text-gray-900 tracking-tighter">₹{totalPrice.toFixed(0)}</p>
                 </div>
                 {discount > 0 && (
                   <div className="flex justify-between items-center px-4 py-3 bg-green-50 rounded-2xl">
                     <span className="text-[10px] font-medium text-green-600 uppercase tracking-widest">Savings</span>
                     <span className="text-xl font-medium text-green-600">-₹{discount.toFixed(0)}</span>
                   </div>
                 )}
                 <div className="flex justify-between items-baseline px-2">
                   <p className="text-[10px] font-medium text-green-600 uppercase tracking-[0.3em]">Shipping</p>
                   <p className="text-[10px] font-medium text-green-600 uppercase tracking-[0.2em]">Complementary</p>
                 </div>
                 
                 <div className="h-px bg-gray-100 my-6"></div>

                 <div className="flex flex-col gap-2 bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl">
                   <p className="text-[8px] font-medium text-white/40 uppercase tracking-[0.5em]">Final Payable</p>
                   <p className="text-5xl font-medium tracking-tighter">₹{finalAmount.toFixed(0)}</p>
                 </div>
               </div>

               <button
                 onClick={() => navigate("/checkout", { state: { items, totalAmount: finalAmount, discount, appliedCoupon } })}
                 className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-3xl font-medium text-lg shadow-xl shadow-green-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group"
               >
                 <span>CONFIRM ORDER</span>
                 <ChevronRight className="group-hover:translate-x-1 transition-transform" />
               </button>

               <div className="mt-10 flex flex-col items-center gap-4 opacity-20">
                 <div className="flex gap-6">
                   <ShieldCheck size={20} />
                   <Truck size={20} />
                 </div>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
