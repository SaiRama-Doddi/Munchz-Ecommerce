import React, { useEffect, useState } from "react";
import { useCart } from "../state/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/coupon";
import { Sparkles, Lock, Gift, Trash2, Plus, Minus, X, Star, Check, PartyPopper, Trophy, Flame, ChevronRight, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
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

  const totalMrp = items.reduce((sum, item) => {
    const v = item.variants[item.selectedVariantIndex];
    return sum + v.mrp * item.qty;
  }, 0);

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

  const milestones = [
    { target: 499, label: "Gourmet Gift", icon: <Gift size={16} /> },
    { target: 999, label: "Elite Off", icon: <Star size={16} /> },
    { target: 1499, label: "Prestige Box", icon: <Trophy size={16} /> },
  ];

  const maxMilestone = milestones[milestones.length - 1].target;
  const progress = Math.min((totalPrice / maxMilestone) * 100, 100);
  const savingsAmount = totalMrp - totalPrice;

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-sm text-gray-200"><ShoppingBag size={48} /></div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Archive Empty</h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-6 leading-relaxed">Your gourmet sequence is currently uninitiated. Explore our collection to begin your luxury journey.</p>
          <button onClick={() => navigate("/product")} className="mt-12 h-16 w-full bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-black/10">Browse Archive</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16 lg:py-24">
      {showCelebration && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center backdrop-blur-[2px] animate-fadeIn">
          <div className="text-center">
            <h2 className="text-5xl font-black text-gray-900 drop-shadow-2xl animate-bounce italic tracking-tighter">PRESTIGE <span className="text-emerald-600">UNLOCKED</span></h2>
            <PartyPopper size={64} className="text-emerald-500 mx-auto mt-8 animate-pulse" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-20">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-50 pb-12">
           <div>
              <div className="flex items-center gap-3 mb-4">
                 <span className="h-px w-8 bg-emerald-600"></span>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Acquisition Phase</p>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">Your Gourmet <span className="text-emerald-600 italic">Inventory</span></h1>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-300 mt-6">{items.length} Selections Ready for Transfer</p>
           </div>
           <button onClick={() => navigate("/product")} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 border-b border-emerald-600/20 hover:border-emerald-600 pb-1 transition-all">Add to Sequence</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-20">
          
          {/* ITEMS LIST */}
          <div className="space-y-10">
             {items.map((item, i) => {
               const v = item.variants[item.selectedVariantIndex];
               const disc = v.mrp > v.offerPrice ? Math.round(((v.mrp - v.offerPrice) / v.mrp) * 100) : 0;
               return (
                 <div key={i} className="group premium-card bg-white rounded-[3rem] p-8 border border-gray-50 flex flex-col sm:flex-row gap-10 transition-all duration-500 hover:shadow-2xl shadow-emerald-900/5">
                    <div className="relative w-full sm:w-48 aspect-square bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                       <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" onClick={() => navigate(`/product/${item.productId}`)} />
                       {disc > 0 && <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-600/30">{disc}% OFF</div>}
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-2">
                       <div className="flex justify-between items-start gap-4">
                          <div>
                             <h4 className="text-lg font-black text-gray-900 uppercase tracking-wide leading-tight group-hover:text-emerald-700 transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>{item.name}</h4>
                             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">{v.weightLabel} Selection</p>
                          </div>
                          <button onClick={() => removeItem(i)} className="w-10 h-10 bg-gray-50 text-gray-300 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all"><X size={18}/></button>
                       </div>

                       <div className="flex items-center justify-between gap-6 mt-10 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                          <div className="flex items-center bg-gray-50/80 rounded-2xl p-1 border border-gray-100">
                             <button onClick={() => updateQty(i, Math.max(item.qty - 1, 1))} className="w-12 h-12 bg-white text-gray-400 hover:text-emerald-600 rounded-xl shadow-sm flex items-center justify-center transition-all"><Minus size={16}/></button>
                             <span className="w-12 text-center font-black text-lg text-gray-900">{item.qty}</span>
                             <button onClick={() => updateQty(i, item.qty + 1)} className="w-12 h-12 bg-white text-gray-400 hover:text-emerald-600 rounded-xl shadow-sm flex items-center justify-center transition-all"><Plus size={16}/></button>
                          </div>
                          <div className="text-right">
                             <div className="flex items-baseline gap-2 mb-1">
                                <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{v.offerPrice * item.qty}</p>
                                {v.mrp > v.offerPrice && <span className="text-xs text-gray-300 line-through font-bold">₹{v.mrp * item.qty}</span>}
                             </div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Secure Acquisition</p>
                          </div>
                       </div>
                    </div>
                 </div>
               );
             })}

             {/* MILESTONE TRACKER */}
             <div className="p-10 lg:p-12 bg-black rounded-[4rem] text-white space-y-12 shadow-3xl shadow-emerald-900/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-emerald-600/20 transition-all duration-1000"></div>
                
                <header className="flex justify-between items-end relative z-10">
                   <div>
                      <div className="flex items-center gap-3 mb-4">
                         <Flame size={18} className="text-emerald-400 animate-pulse" />
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Reward Protocol</p>
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">Milestone <span className="text-emerald-400 italic">Tracker</span></h3>
                   </div>
                   <div className="text-right">
                      <p className="text-4xl font-black tracking-tighter">₹{totalPrice}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-2">Current Accumulation</p>
                   </div>
                </header>

                <div className="relative pt-12 relative z-10">
                   <div className="absolute top-1/2 left-0 w-full h-[6px] bg-white/5 rounded-full -translate-y-1/2"></div>
                   <div className="absolute top-1/2 left-0 h-[6px] bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full -translate-y-1/2 transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.5)]" style={{ width: `${progress}%` }}>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_#fff] scale-125"></div>
                   </div>

                   <div className="relative flex justify-between">
                      {milestones.map((m, idx) => {
                        const reached = totalPrice >= m.target;
                        return (
                          <div key={idx} className="flex flex-col items-center gap-6" style={{ marginLeft: `${(m.target / maxMilestone) * 100}%`, position: 'absolute', transform: 'translateX(-50%)', left: 0 }}>
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${reached ? 'bg-emerald-600 border-white shadow-xl shadow-emerald-600/40 scale-110' : 'bg-white/5 border-white/5 text-white/20'}`}>
                                {reached ? m.icon : <Lock size={16}/>}
                             </div>
                             <p className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${reached ? 'text-white' : 'text-white/20'}`}>{m.label}</p>
                          </div>
                        );
                      })}
                   </div>
                </div>

                <div className="pt-16 pb-2 text-center relative z-10">
                   {progress < 100 ? (
                     <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Invest <span className="text-emerald-400 text-sm mx-1">₹{maxMilestone - totalPrice}</span> more to unlock Prestige Access</p>
                   ) : (
                     <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400 animate-pulse">Maximum Prestige Protocol Unlocked</p>
                   )}
                </div>
             </div>
          </div>

          {/* SUMMARY & CHECKOUT */}
          <aside className="space-y-10 sticky top-32 h-fit">
             <div className="premium-card bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 flex flex-col gap-10">
                <div className="flex items-center gap-3">
                   <Gift size={18} className="text-emerald-600" />
                   <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Privilege Codes</h3>
                </div>

                <div className="space-y-4">
                   {availableCoupons.map((c) => {
                     const eligible = totalPrice >= c.minAmount;
                     const active = appliedCoupon === c.code;
                     return (
                       <div key={c.id} className={`p-6 rounded-[2rem] border-2 transition-all duration-500 flex justify-between items-center ${active ? 'border-emerald-600 bg-emerald-50' : eligible ? 'border-emerald-100 bg-white hover:border-emerald-400' : 'border-gray-100 bg-gray-50/50 opacity-40'}`}>
                          <div>
                             <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">{c.code}</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Save ₹{c.discountAmount}</p>
                          </div>
                          {eligible && (
                            <button onClick={() => active ? removeCoupon() : applyCoupon(c.code)} className={`h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-red-500 text-white' : 'bg-black text-white hover:bg-emerald-600'}`}>{active ? 'Remove' : 'Apply'}</button>
                          )}
                       </div>
                     );
                   })}
                   {couponMessage && <p className={`text-[10px] font-black uppercase tracking-widest text-center mt-4 ${messageType === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>{couponMessage}</p>}
                </div>
             </div>

             <div className="premium-card bg-white p-10 lg:p-12 rounded-[4rem] border border-gray-50 shadow-2xl shadow-emerald-900/5 flex flex-col gap-10">
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Accumulated Value</span>
                      <span className="text-sm font-black text-gray-900">₹{totalPrice}</span>
                   </div>
                   {savingsAmount > 0 && (
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Product Privilege</span>
                        <span className="text-sm font-black text-emerald-600">-₹{savingsAmount}</span>
                     </div>
                   )}
                   {discount > 0 && (
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Coupon Privilege</span>
                        <span className="text-sm font-black text-emerald-600">-₹{discount}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Transfer Protocol</span>
                      <span className="text-sm font-black text-emerald-600">FREE</span>
                   </div>
                   <div className="h-px bg-gray-50"></div>
                   <div className="flex justify-between items-end pt-4">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-2">Final Investment</p>
                         <p className="text-xl font-black text-gray-900 uppercase">Total Amount</p>
                      </div>
                      <p className="text-4xl font-black text-emerald-600 tracking-tighter italic">₹{finalAmount}</p>
                   </div>
                </div>

                <button onClick={() => navigate("/checkout", { state: { items, totalAmount: finalAmount, discount, appliedCoupon } })} className="w-full h-20 bg-black text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all duration-500 shadow-2xl shadow-black/10 flex items-center justify-center gap-4 group active:scale-95">
                   <Sparkles size={20} className="text-emerald-400 group-hover:animate-pulse" />
                   Authorize Transfer
                   <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <p className="text-[10px] font-bold text-gray-300 text-center uppercase tracking-widest leading-relaxed">Secure protocol initiated. <br/>All transfers are protected by 256-bit encryption.</p>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
