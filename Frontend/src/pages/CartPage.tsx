import React, { useEffect, useState } from "react";
import { useCart } from "../state/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/coupon";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, updateQty, changeVariant, removeItem } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
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
  console.log(userId);

  /* ================= COUPON EXPIRY CHECK ================= */
  const isCouponExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  /* ================= FETCH COUPONS ================= */
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/coupon/api/coupons");
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

  // ✅ IMPORTANT CHECK
  if (!userId) {
    setCouponMessage("Please login to apply coupon");
    return;
  }

  try {
    setLoadingCoupon(true);

    const res = await api.post(
      "/coupon/api/coupons/apply",
      {
        couponCode: code,
        orderAmount: totalPrice,
      },
      {
        headers: {
          "X-USER-ID": userId, // ✅ NOW ALWAYS VALID
        },
      }
    );

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



  useEffect(() => {
  console.log("Auth profile:", profile);
  console.log("User ID:", profile?.id);
}, [profile]);



  return (
    <div className="bg-[#f6fff4] min-h-screen py-8 sm:py-12">


      {/* BACK BUTTON */}
   <div className="max-w-7xl mx-auto px-4 sm:px-6">
  <button
    onClick={() => navigate(-1)}
    className="mt-6 mb-6 inline-flex items-center gap-3
    bg-white px-4 py-2 rounded-full shadow-md border border-green-100
    text-green-700 font-medium hover:bg-green-50 hover:shadow-lg
    active:scale-95 transition-all duration-200"
  >
    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-700 text-white">
      ←
    </span>
    Back
  </button>
</div>


     <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">


        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Your cart items</h2>

          {items.map((item, i) => {
            const v = item.variants[item.selectedVariantIndex];

            return (
             <div key={i} className="bg-[#eaffea] p-4 sm:p-6 rounded-xl relative shadow-sm">
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

<img
  src={item.imageUrl}
  className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto sm:mx-0"
/>


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

                   <div className="mt-4 flex gap-2 sm:gap-3 flex-wrap">

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
                        className="border px-2 sm:px-3 py-1 rounded"

                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => updateQty(i, item.qty + 1)}
                        className="border px-2 sm:px-3 py-1 rounded"

                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(i)}
                 className="absolute top-3 right-3 text-red-600 text-sm"

                >
                  Remove
                </button>
              </div>
            );
          })}
          {!userId && (
  <p className="mt-2 text-sm text-red-500">
    Login required to apply coupons
  </p>
)}

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow h-fit sticky top-24">

          <h3 className="text-lg font-semibold mb-4">Price details</h3>

         <div className="space-y-3 text-sm">

  {/* PRODUCT LIST */}
  {items.map((item, i) => {
    const v = item.variants[item.selectedVariantIndex];
    const lineTotal = v.offerPrice * item.qty;

    return (
      <div key={i} className="flex justify-between gap-4">
        <span className="text-gray-700">
          {item.name} ({item.qty} × ₹{v.offerPrice})
        </span>
        <span className="font-medium">₹{lineTotal}</span>
      </div>
    );
  })}

  <hr />

  {/* TOTAL MRP */}
  <div className="flex justify-between">
    <span>Total MRP</span>
    <span>₹{totalMrp}</span>
  </div>

  {/* DISCOUNT */}
  <div className="flex justify-between text-green-700">
    <span>Discount</span>
    <span>-₹{discount}</span>
  </div>

  <hr />

  {/* FINAL */}
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
               <div key={c.id} className="border p-3 rounded mb-3 bg-green-50">

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
                 state: {
                    items,
                   totalAmount: finalAmount,   // ✅ discounted amount
                   discount,                   // ✅ send discount
                   appliedCoupon,              // ✅ optional but useful
                   },
              })

            }
className="mt-6 w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 shadow-md hover:shadow-lg transition"

          >
            Place order
          </button>
        </div>
      </div>
    </div>
  );
}
