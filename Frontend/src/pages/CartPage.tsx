import React, { useEffect, useState } from "react";
import { useCart } from "../state/CartContext";
import { useNavigate } from "react-router-dom";
import { getProductUrl } from "../utils/slugify";
import api from "../api/coupon";
import { ArrowLeft, Sparkles, Lock, Gift, Trash2, Plus, Minus, X, Star, Check, PartyPopper, Trophy, Flame, ShoppingBag, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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

  /* ================= COUPON EXPIRY CHECK ================= */
  const isCouponExpired = (expiryDate: string) => {
    return expiryDate ? new Date(expiryDate) < new Date() : false;
  };

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

  const milestones = [
    { target: 499, label: "Free Gift", icon: <Gift className="w-4 h-4" />, color: "from-green-400 to-green-600" },
    { target: 899, label: "Extra Off", icon: <Star className="w-4 h-4" />, color: "from-green-600 to-teal-600" },
    { target: 1299, label: "Munchz Box", icon: <Trophy className="w-4 h-4" />, color: "from-teal-600 to-emerald-700" },
  ];

  /* ================= NEXT GOAL TRACKING ================= */
  const allTargets = [
    ...milestones.map(m => ({ target: m.target, label: m.label, isCoupon: false })),
    ...availableCoupons.filter(c => !isCouponExpired(c.expiryDate)).map(c => ({ target: c.minAmount || 0, label: c.code, isCoupon: true }))
  ].sort((a, b) => a.target - b.target);

  const nextGoal = allTargets.find(t => t.target > totalPrice);
  const amountToNext = nextGoal ? nextGoal.target - totalPrice : 0;

  const maxMilestone = milestones[milestones.length - 1].target;
  const progress = Math.min((totalPrice / maxMilestone) * 100, 100);
  const savingsAmount = totalMrp - totalPrice;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9fdf7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
          <ShoppingBag size={56} className="text-green-200" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Your cart is empty</h2>
        <p className="text-gray-500 font-medium mb-10 text-center max-w-xs leading-relaxed">Looks like you haven't added anything to your cart yet.</p>
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
    <div className="w-full min-h-screen bg-[#f9fdf7]">

      {/* CELEBRATION */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
          <div className="relative text-center animate-bounce">
            <PartyPopper size={80} className="text-green-500 mx-auto" />
            <h2 className="text-4xl font-bold text-gray-900 mt-4 drop-shadow-lg tracking-tight">BOOM! COUPON APPLIED! 🚀</h2>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-green-50 px-6 py-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-none">
              My <span className="text-green-600">Cart</span>
            </h1>
            <p className="text-xs sm:text-base text-gray-500 font-medium mt-3 max-w-2xl leading-relaxed">
              {items.length} {items.length === 1 ? 'Product' : 'Products'} • Ready for Munching
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-gray-50 hover:bg-green-50 rounded-2xl transition-all border border-gray-100 hover:border-green-200 text-gray-400 hover:text-green-600"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* BRAND BANNER - UNIFIED WITH ABOUT US STYLE */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-2 space-y-6">

            {/* SINGLE LINE REWARDS SECTION */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-green-100 shadow-sm relative group overflow-hidden transition-all hover:shadow-xl">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform"><Trophy size={110} /></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-14">

                {/* HEADER AREA */}
                <div className="flex-shrink-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-none mb-1">
                    Munchz <span className="text-green-600">Rewards</span>
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                    <Flame size={12} className="text-orange-500" /> Current level: ₹{totalPrice.toFixed(0)}
                  </p>
                </div>

                {/* PROGRESS TRACK */}
                <div className="flex-1 relative py-4">
                  <div className="h-[3px] bg-gray-100 rounded-full w-full relative">
                    {/* GLOWING PROGRESS LINE */}
                    <div
                      className="absolute h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(22,163,74,0.3)]"
                      style={{ width: `${progress}%` }}
                    />

                    {/* MILESTONE MARKERS */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0.5">
                      {milestones.map((m, idx) => {
                        const reached = totalPrice >= m.target;
                        return (
                          <div key={idx} className="relative group/m">
                            <div className={`
                              w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500
                              ${reached ? 'bg-green-600 border-white text-white shadow-lg' : 'bg-white border-gray-100 text-gray-300'}
                            `}>
                              {reached ? m.icon : <Lock size={10} />}
                            </div>
                            {/* MINI TOOLTIP */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[8px] px-2 py-0.5 rounded opacity-0 group-hover/m:opacity-100 transition-opacity whitespace-nowrap">
                              ₹{m.target} UNLOCK
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ITEM LIST */}
            <div className="space-y-4 px-2 sm:px-0">
              {items.map((item, i) => {
                const v = item.variants[item.selectedVariantIndex];
                const discPercent = Math.round((((v.mrp || v.offerPrice) - v.offerPrice) / (v.mrp || v.offerPrice) || 0) * 100);

                return (
                  <div key={i} className="bg-white rounded-[2rem] p-3 sm:p-5 border border-green-50 shadow-sm hover:shadow-lg transition-all duration-300 group flex items-center gap-4 relative overflow-hidden">

                    {/* IMAGE - MOBILE FRIENDLY */}
                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-[#ecfdf5] rounded-2xl sm:rounded-3xl overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} className="w-full h-full object-contain p-2 sm:p-4" alt={item.name} />
                      {discPercent > 0 && (
                        <div className="absolute top-0 left-0 bg-green-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-br-xl uppercase">{discPercent}%</div>
                      )}
                    </div>

                    {/* CONTENT - FULL WIDTH ON MOBILE */}
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 
                            onClick={() => navigate(getProductUrl(item.productId, item.name))}
                            className="text-sm sm:text-lg font-bold text-gray-900 tracking-tight leading-tight line-clamp-1 truncate cursor-pointer hover:text-green-700 transition-colors"
                          >
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{v.weightLabel}</p>
                        </div>
                        {/* DELETE - ALWAYS VISIBLE ON MOBILE AS RED CIRCLE */}
                        <button onClick={() => removeItem(i)} className="sm:hidden w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full border border-red-100 flex-shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 sm:mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-2xl font-bold text-gray-900 tracking-tighter">₹{v.offerPrice}</span>
                          {v.mrp > v.offerPrice && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through font-bold">₹{v.mrp}</span>
                          )}
                        </div>

                        {/* QTY - COMPACT STYLE */}
                        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl p-1 gap-1">
                          <button onClick={() => updateQty(i, Math.max(item.qty - 1, 1))} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-all"><Minus size={12} /></button>
                          <span className="w-4 text-center text-xs font-bold text-gray-900">{item.qty}</span>
                          <button onClick={() => updateQty(i, item.qty + 1)} className="w-7 h-7 flex items-center justify-center bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all"><Plus size={12} /></button>
                        </div>
                      </div>
                    </div>

                    {/* DESKTOP DELETE */}
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
          <div className="lg:col-span-1 space-y-6">

            {/* COUPONS */}
            <div className="bg-white rounded-[2rem] p-8 border border-green-50 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
                <div className="w-1.5 h-8 bg-green-600 rounded-full"></div>
                Offers & Coupons
              </h3>

              <div className="space-y-3">
                {availableCoupons.length === 0 ? (
                  <p className="text-xs text-gray-400 font-bold italic py-4">No exclusive offers available for this order.</p>
                ) : (
                  availableCoupons.map((c) => {
                    const isEligible = totalPrice >= (c.minAmount || 0);
                    const isApplied = appliedCoupon === c.code;
                    return (
                      <div key={c.id} className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden group ${isEligible ? 'bg-green-50/20 border-green-100 hover:border-green-300' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform"><Gift size={32} /></div>
                        <div className="flex justify-between items-center relative z-10">
                          <div>
                            <p className="font-bold text-gray-900 tracking-tight uppercase leading-tight">{c.code}</p>
                            <p className="text-[11px] text-green-600 font-bold mt-1 uppercase tracking-tighter">Save ₹{c.discountAmount} on ₹{c.minAmount}+</p>
                          </div>
                          {isEligible && (
                            <button
                              onClick={() => isApplied ? removeCoupon() : applyCoupon(c.code)}
                              className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${isApplied ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-600 text-white shadow-lg'}`}
                            >
                              {isApplied ? 'Remove' : 'Apply'}
                            </button>
                          )}
                        </div>
                        {!isEligible && (
                          <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase flex items-center gap-1.5"><Lock size={10} /> Add ₹{(c.minAmount || 0) - totalPrice} more to unlock</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {couponMessage && (
                <div className={`mt-6 p-4 rounded-xl text-xs font-bold border-2 ${messageType === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {couponMessage}
                </div>
              )}
            </div>

            {/* SUMMARY CARD (STICKY) */}
            <div className="bg-white rounded-[2rem] p-8 border-2 border-green-600 shadow-xl lg:sticky lg:top-32 relative overflow-hidden">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
                <div className="w-1.5 h-8 bg-green-600 rounded-full"></div>
                Order Summary
              </h3>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-sm md:text-base font-bold text-gray-900 tracking-tight bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <span>Initial Amount</span>
                  <span className="font-bold">₹{totalPrice.toFixed(0)}</span>
                </div>
                {savingsAmount > 0 && (
                  <div className="flex justify-between items-center text-sm md:text-base font-bold text-green-700 tracking-tight px-3">
                    <span>Instant Savings</span>
                    <span className="font-bold">-₹{savingsAmount.toFixed(0)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm md:text-base font-bold text-green-700 tracking-tight px-3">
                    <span>Coupon Discount</span>
                    <span className="font-bold">-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm md:text-base font-bold text-green-700 tracking-tight px-3">
                  <span>Shipping Charge</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="h-px bg-gray-100 my-4"></div>
                <div className="flex justify-between items-end bg-green-50/50 p-4 rounded-2xl border border-green-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Grand Total</p>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tighter leading-none">₹{finalAmount.toFixed(0)}</p>
                  </div>
                  <div className="pb-1 opacity-20"><ShoppingBag size={32} /></div>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout", { state: { items, totalAmount: finalAmount, discount, appliedCoupon } })}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold tracking-tight transition-all flex items-center justify-center gap-2 border-none outline-none shadow-sm group"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8 grid grid-cols-3 gap-2 opacity-40">
                <div className="flex flex-col items-center gap-1">
                  <Lock size={16} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-gray-100">
                  <Check size={16} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">FSSAI</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Flame size={16} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Fresh</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
