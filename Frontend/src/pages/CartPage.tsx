
import React, { useEffect, useState } from "react";
import { useCart } from "../state/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/coupon";
import { ArrowLeft, Sparkles, Lock, Gift, Trash2, Plus, Minus, X, Star, Check, PartyPopper, Trophy, Flame } from "lucide-react";
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
    return sum + v.mrp * item.qty;
  }, 0);

  const totalPrice = items.reduce((sum, item) => {
    const v = item.variants[item.selectedVariantIndex];
    return sum + v.offerPrice * item.qty;
  }, 0);

  const finalAmount = Math.max(totalPrice - discount, 0);

  /* ================= COUPON EXPIRY CHECK ================= */
  const isCouponExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
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

      const res = await api.post(
        "/coupons/apply",
        {
          couponCode: code,
          orderAmount: totalPrice,
        },
        {
          headers: {
            "X-USER-ID": userId,
          },
        }
      );

      setDiscount(res.data.appliedDiscount);
      setAppliedCoupon(code);
      setCouponMessage(`Coupon "${code}" applied successfully`);
      setMessageType("success");
      
      // Trigger Celebration
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

  /* ================= REMOVE COUPON ================= */
  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCoupon("");
    setCouponMessage("Coupon removed");
  };



  const milestones = [
    { target: 499, label: "Free Gift", icon: <Gift className="w-3 h-3" />, color: "from-emerald-400 to-green-500" },
    { target: 899, label: "Extra Off", icon: <Star className="w-3 h-3" />, color: "from-green-500 to-teal-600" },
    { target: 1299, label: "Munchz Box", icon: <Trophy className="w-3 h-3" />, color: "from-teal-600 to-emerald-500" },
  ];

  const maxMilestone = milestones[milestones.length - 1].target;
  const progress = Math.min((totalPrice / maxMilestone) * 100, 100);
  const savingsAmount = totalMrp - totalPrice;

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col overflow-hidden">
      {/* ==================== CELEBRATION OVERLAY ==================== */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
          {/* Confetti-like particles using CSS */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] animate-fadeIn"></div>
          <div className="relative transform scale-150 sm:scale-[2]">
            <div className="absolute inset-0 animate-ping bg-emerald-500/20 rounded-full"></div>
            <PartyPopper className="w-16 h-16 text-emerald-500 animate-[bounce_0.5s_infinite]" />
            <h2 className="absolute top-full left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap text-3xl font-black text-slate-900 drop-shadow-lg animate-bounce">
              BOOM! UNLOCKED 🚀
            </h2>
          </div>
          
          {/* Simple Particle Rain */}
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className={`absolute top-0 w-2 h-2 rounded-full animate-fall bg-gradient-to-br ${milestones[i % 3].color}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
          
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes fall {
              0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            .animate-fall { animation: fall linear infinite; }
          `}} />
        </div>
      )}

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white"></div>
        
        {/* ==================== PREMIUM HEADER ==================== */}
        <div className="sticky top-0 z-40 backdrop-blur-lg bg-white/95 border-b border-slate-200/60 px-4 sm:px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700">
                  Shopping Cart
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {items.length} {items.length === 1 ? 'item' : 'items'} • ₹{totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex-shrink-0 p-2 hover:bg-emerald-50 rounded-lg transition-all duration-300 hover:scale-110 text-slate-600 hover:text-emerald-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ==================== MILESTONE TRACKER SECTION ==================== */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-slate-200/50">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white p-6 shadow-2xl border border-white/10">
            {/* AMBIENT LIGHTS */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] animate-pulse"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                    <Flame className="w-6 h-6 text-emerald-400 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight leading-none">Incentives Tracker</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 font-mono">Spend more, earn more</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white leading-none">₹{totalPrice.toFixed(0)}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Current Reward Level</p>
                </div>
              </div>

              {/* MODERN TRACK WITH MILESTONES */}
              <div className="relative pt-6 pb-6 px-1">
                {/* TRACK LINE */}
                <div className="absolute top-[28px] left-0 w-full h-1 bg-white/10 rounded-full"></div>
                <div 
                  className="absolute top-[28px] left-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  style={{ width: `${progress}%` }}
                >
                  {/* GLOW TIP */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_#fff] scale-125"></div>
                </div>

                {/* MILESTONE MARKERS */}
                <div className="relative flex justify-between">
                  {milestones.map((m, idx) => {
                    const isReached = totalPrice >= m.target;
                    const pos = (m.target / maxMilestone) * 100;
                    
                    return (
                      <div 
                        key={idx}
                        className="absolute flex flex-col items-center -translate-x-1/2"
                        style={{ left: `${pos}%` }}
                      >
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative z-20
                          ${isReached 
                            ? `bg-gradient-to-br ${m.color} border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-110` 
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                          }
                        `}>
                          {isReached ? m.icon : <Lock className="w-3 h-3" />}
                        </div>
                        <div className="mt-2 text-center">
                          <p className={`text-[10px] font-black uppercase tracking-tighter ${isReached ? 'text-white' : 'text-slate-500'}`}>
                            {m.label}
                          </p>
                          <p className={`text-[9px] font-bold font-mono mt-0.5 ${isReached ? 'text-emerald-400' : 'text-slate-600'}`}>
                            {isReached ? 'Unlocked' : `₹${m.target}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STATUS TEXT */}
              <div className="mt-8 flex items-center justify-center gap-2 py-3 px-4 bg-white/5 rounded-2xl border border-white/10">
                {progress < 100 ? (
                  <p className="text-xs font-bold text-slate-300 italic">
                    Add <span className="text-emerald-400 not-italic font-black">₹{Math.max(0, milestones.find(m => totalPrice < m.target)?.target! - totalPrice)}</span> more for the next reward!
                  </p>
                ) : (
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-widest animate-pulse flex items-center gap-2">
                    <PartyPopper className="w-4 h-4" /> Max Rewards Unlocked!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
{items.length > 0 && (
  <div className="flex items-center justify-between mb-2">
    <h3 className="text-sm font-semibold text-slate-800 ml-10">
      Cart Items
    </h3>

    <span className="text-xs text-slate-500">
      {items.length} products
    </span>
  </div>
)}
        {/* ==================== CART ITEMS (SCROLLABLE) ==================== */}
       <div className="flex flex-col px-4 sm:px-6 py-4 pb-28 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-4 shadow-sm">
                <Gift className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-700 font-semibold text-lg">Your cart is empty</p>
              <p className="text-slate-500 text-sm mt-2">Start adding items to get amazing deals</p>
            </div>
          ) : (
            <>
              {items.map((item, i) => {
                const v = item.variants[item.selectedVariantIndex];
                const itemSavings = (v.mrp - v.offerPrice) * item.qty;
                const discountPercent = Math.round(((v.mrp - v.offerPrice) / v.mrp) * 100);

                return (
                  <div
                    key={i}
                    className="group bg-white border border-slate-200/60 rounded-[2rem] p-4 sm:p-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-emerald-200/50 hover:-translate-y-1"
                  >
                    {/* PRODUCT IMAGE & DELETE */}
                    <div className="flex gap-4 mb-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain p-2 cursor-pointer hover:scale-110 transition-transform duration-300"
                            onClick={() => navigate(`/product/${item.productId}`)}
                          />
                        </div>
                        {discountPercent > 0 && (
                          <div className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
                            {discountPercent}% OFF
                          </div>
                        )}
                      </div>

                      {/* PRODUCT INFO */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            className="text-sm sm:text-base font-bold text-slate-900 cursor-pointer hover:text-emerald-600 transition-colors line-clamp-2 flex-1"
                            onClick={() => navigate(`/product/${item.productId}`)}
                          >
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(i)}
                            className="flex-shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* PRICING */}
                        <div className="flex items-center gap-2 mt-2 mb-3">
                          <span className="text-lg sm:text-xl font-bold text-slate-900">
                            ₹{v.offerPrice}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-400 line-through">
                            ₹{v.mrp}
                          </span>
                          {itemSavings > 0 && (
                            <span className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                              Save ₹{itemSavings}
                            </span>
                          )}
                        </div>

                        {/* VARIANT SELECTOR */}
                        <select
                          value={item.selectedVariantIndex}
                          onChange={(e) => changeVariant(i, Number(e.target.value))}
                          className="text-xs sm:text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-300"
                        >
                          {item.variants.map((variant, idx) => (
                            <option key={idx} value={idx}>
                              {variant.weightLabel}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* QUANTITY SELECTOR */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                        <button
                          onClick={() => updateQty(i, Math.max(item.qty - 1, 1))}
                          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white transition-colors text-slate-700 hover:text-slate-900 hover:shadow-sm"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-900 text-sm">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(i, item.qty + 1)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white transition-colors text-slate-700 hover:text-slate-900 hover:shadow-sm"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-slate-600">
                        Qty: <span className="text-slate-900">{item.qty}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* ==================== COUPONS SECTION (SCROLLABLE) ==================== */}
        <div className="flex-shrink-0 border-t border-slate-200/50 bg-white px-4 sm:px-6 py-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <Star className="w-4 h-4 text-emerald-600" />
            </div>
            Available Coupons
          </h3>

        <div className="space-y-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 space-y-2">
            {availableCoupons.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                No coupons available at the moment
              </p>
            ) : (
              availableCoupons.map((c) => {
                const eligible = totalPrice >= (c.minAmount || 0);
                const lockedAmount = (c.minAmount || 0) - totalPrice;

                return (
                  <div
                    key={c.id}
                    className={`group relative overflow-hidden border rounded-2xl p-4 transition-all duration-500 ${
                      eligible
                        ? "bg-slate-50 border-emerald-100 hover:shadow-xl hover:border-emerald-300"
                        : "bg-slate-50/50 border-slate-100 opacity-60"
                    }`}
                  >
                    {eligible && (
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-900 text-sm truncate">{c.code}</p>
                          {eligible && (
                            <span className="flex-shrink-0 px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
                              Eligible
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mb-2">
                          Save{' '}
                          <span className="font-bold text-green-600">₹{c.discountAmount}</span>
                          {' '}on orders ₹{c.minAmount}+
                        </p>

                        {!eligible && (
                          <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                            <Lock className="w-3 h-3 flex-shrink-0" />
                            Add ₹{lockedAmount} to unlock
                          </p>
                        )}
                      </div>

                      {eligible && (
                        <button
                          onClick={() => (appliedCoupon === c.code ? removeCoupon() : applyCoupon(c.code))}
                          disabled={loadingCoupon}
                          className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                            appliedCoupon === c.code
                              ? "bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-200"
                              : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg"
                          } ${loadingCoupon ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {appliedCoupon === c.code ? "Remove" : "Apply"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {couponMessage && (
            <div
              className={`mt-3 p-3 rounded-lg text-xs font-semibold border ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {couponMessage}
            </div>
          )}
        </div>

        {/* ==================== PRICING BREAKDOWN & CHECKOUT ==================== */}
<div className="
flex-shrink-0 
border-t border-slate-200/50 
bg-gradient-to-t from-white to-slate-50 
px-4 sm:px-6 py-4
shadow-lg shadow-black/5
">
          {/* PRICING DETAILS */}
          <div className="space-y-3 mb-5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="font-semibold text-slate-900">₹{totalPrice.toFixed(2)}</span>
            </div>

            {savingsAmount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600 font-medium">Product Savings</span>
                <span className="font-semibold text-green-600">-₹{savingsAmount.toFixed(2)}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-600 font-medium">Coupon Discount</span>
                <span className="font-semibold text-emerald-600">-₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Shipping</span>
              <span className="font-bold text-green-600">Free</span>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>

            {/* TOTAL */}
            <div className="flex justify-between items-end pt-1">
              <span className="text-base font-bold text-slate-900">Total Amount</span>
              <div className="text-right">
               <p className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600">
                  ₹{finalAmount.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Incl. all taxes</p>
              </div>
            </div>
          </div>

          {/* CHECKOUT BUTTON */}
          <button
            onClick={() =>
              navigate("/checkout", {
                state: {
                  items,
                  totalAmount: finalAmount,
                  discount,
                  appliedCoupon,
                },
              })
            }
            className="w-full bg-gradient-to-r from-emerald-600 via-emerald-600 to-green-600 hover:from-emerald-700 hover:via-emerald-700 hover:to-green-700 text-white py-2.5 sm:py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 transform hover:translate-y-[-2px]"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            Place Order Now
          </button>

          {/* TRUST BADGES */}
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-600" />
              <span>Secure</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-600" />
              <span>Free Returns</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-600" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
    </div>
  );
}

