import React, { useEffect, useState } from "react";
import { useCart } from "../state/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/coupon";

export default function Cart() {
  const { items, updateQty, changeVariant, removeItem } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

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

    try {
      setLoadingCoupon(true);

      const res = await api.post("/coupons/apply", {
        couponCode: code,
        orderAmount: totalPrice,
      });

      if (isCouponExpired(res.data.expiryDate)) {
        setCouponMessage("This coupon has expired");
        return;
      }

      setDiscount(res.data.appliedDiscount);
      setAppliedCoupon(code);
      setCouponMessage(`Coupon "${code}" applied successfully`);
    } catch (error: any) {
      setDiscount(0);
      setCouponMessage(
        error?.response?.data?.message || "Invalid coupon"
      );
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

  return (
    <div className="bg-[#f6fff4] min-h-screen py-12 -mt-10">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="ml-20 inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md border border-green-100 text-green-700 font-medium hover:bg-green-50"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-700 text-white">
          ←
        </span>
        Back
      </button>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-2">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Your cart items</h2>

          {items.map((item, i) => {
            const v = item.variants[item.selectedVariantIndex];

            return (
              <div key={i} className="bg-[#eaffea] p-6 rounded-xl relative">
                <div className="flex gap-6">
                  <img src={item.imageUrl} className="w-24 h-24 object-contain" />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>

                    <div className="mt-1 flex gap-3 items-center">
                      <span className="text-green-700 font-semibold">
                        ₹{v.offerPrice}
                      </span>
                      <span className="line-through text-gray-500">
                        ₹{v.mrp}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-3 flex-wrap">
                      {item.variants.map((variant, idx) => (
                        <button
                          key={idx}
                          onClick={() => changeVariant(i, idx)}
                          className={`px-4 py-1 border rounded ${
                            idx === item.selectedVariantIndex
                              ? "bg-green-700 text-white"
                              : ""
                          }`}
                        >
                          {variant.weightLabel}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={() => updateQty(i, item.qty - 1)}
                        className="border px-3 rounded"
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => updateQty(i, item.qty + 1)}
                        className="border px-3 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(i)}
                  className="absolute top-4 right-4 text-red-600"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h3 className="text-lg font-semibold mb-4">Price details</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Product price</span>
              <span>₹{totalMrp}</span>
            </div>

            <div className="flex justify-between text-green-700">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>

            <hr />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total amount</span>
              <span>₹{finalAmount}</span>
            </div>
          </div>

          {/* COUPONS */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Available Coupons</p>

            {availableCoupons
              .filter(
                c =>
                  c.active &&
                  !isCouponExpired(c.expiryDate) &&
                  totalPrice >= (c.minAmount || 0)
              )
              .map(c => (
                <div key={c.id} className="border p-2 rounded mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{c.code}</p>
                      <p className="text-xs text-gray-600">
                        Save ₹{c.discountAmount} on orders above ₹{c.minAmount}
                      </p>
                      <p className="text-xs text-red-500 mt-1">
                        Expires on:{" "}
                        {new Date(c.expiryDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    {appliedCoupon === c.code ? (
                      <button
                        onClick={removeCoupon}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => applyCoupon(c.code)}
                        className="bg-green-700 text-white px-3 py-1 rounded"
                        disabled={loadingCoupon}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              ))}

            {couponMessage && (
              <p className="mt-2 text-sm text-green-700">
                {couponMessage}
              </p>
            )}
          </div>

          <button
            onClick={() =>
              navigate("/checkout", {
                state: { items, totalAmount: finalAmount },
              })
            }
            className="mt-6 w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800"
          >
            Place order
          </button>
        </div>
      </div>
    </div>
  );
}
