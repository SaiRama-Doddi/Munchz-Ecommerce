
import React, { useEffect, useState } from "react";
import { useCart } from "../state/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/coupon";
import { ArrowLeft, Sparkles, Lock, Gift, Trash2, Plus, Minus, X, Star, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function CartPremium() {
  const { items, updateQty, changeVariant, removeItem } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loadingCoupon, setLoadingCoupon] = useState(false);
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



  const couponTarget = 200;
  const progress = Math.min((totalPrice / couponTarget) * 100, 100);
  const savingsAmount = totalMrp - totalPrice;
  const isCouponUnlocked = totalPrice >= couponTarget;

  return (
   <div
  className=" z-0
  fixed inset-0 z-50 bg-white
  sm:relative sm:w-full sm:max-w-7xl sm:mx-auto sm:h-auto sm:shadow-none
flex flex-col overflow-y-auto"
>     <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white"></div>
        
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
              className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110 text-slate-600 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ==================== UNLOCK COUPONS SECTION ==================== */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-slate-200/50">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/60 p-4 sm:p-5 shadow-sm">
            {/* ANIMATED BACKGROUND ELEMENTS */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-transparent rounded-full blur-3xl opacity-20 -mr-16 -mt-16 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200 to-transparent rounded-full blur-3xl opacity-20 -ml-12 -mb-12 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative p-2 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
                    <Sparkles className="w-5 h-5 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm sm:text-base">
                      {isCouponUnlocked ? (
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                          200+ Coupons Unlocked!
                        </span>
                      ) : (
                        "Unlock Premium Coupons"
                      )}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {isCouponUnlocked
                        ? "Enjoy exclusive discounts on your cart"
                        : `Add ₹${Math.max(0, couponTarget - totalPrice)} more to unlock`}
                    </p>
                  </div>
                </div>
                {isCouponUnlocked && (
                  <div className="flex-shrink-0 ml-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md">
                      <Check className="w-5 h-5 text-blue-600 animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* PROGRESS BAR */}
              <div className="space-y-2">
                <div className="w-full bg-white/60 backdrop-blur-sm h-2.5 rounded-full overflow-hidden border border-blue-200/40 shadow-inner">
                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-lg"
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-semibold text-slate-700">₹{Math.min(totalPrice, couponTarget)}</span>
                  <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {Math.round(progress)}%
                  </span>
                  <span className="text-xs font-semibold text-slate-700">₹{couponTarget}</span>
                </div>
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
                    className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
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
                            className="text-sm sm:text-base font-bold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2 flex-1"
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
                          className="text-xs sm:text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-slate-300"
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
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Star className="w-4 h-4 text-blue-600" />
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
                    className={`border rounded-xl p-3 transition-all duration-300 ${
                      eligible
                        ? "bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-200 hover:shadow-md hover:border-green-300"
                        : "bg-slate-50 border-slate-200 opacity-75"
                    }`}
                  >
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
                <span className="text-blue-600 font-medium">Coupon Discount</span>
                <span className="font-semibold text-blue-600">-₹{discount.toFixed(2)}</span>
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
               <p className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
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
            className="w-full bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 text-white py-2.5 sm:py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 transform hover:translate-y-[-2px]"
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

