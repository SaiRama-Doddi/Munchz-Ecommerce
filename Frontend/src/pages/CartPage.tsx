import React, { useState } from "react";
import { useCart } from "../state/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, updateQty, changeVariant, removeItem } = useCart();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const totalMrp = items.reduce((sum, item) => {
    const v = item.variants[item.selectedVariantIndex];
    return sum + v.mrp * item.qty;
  }, 0);

  const totalPrice = items.reduce((sum, item) => {
    const v = item.variants[item.selectedVariantIndex];
    return sum + v.offerPrice * item.qty;
  }, 0);

  const applyCoupon = () => {
    if (coupon.toLowerCase() === "save10") {
      setDiscount(0.1 * totalPrice);
    } else if (coupon.toLowerCase() === "flat100") {
      setDiscount(100);
    } else {
      setDiscount(0);
      alert("Invalid coupon code");
    }
  };

  const finalAmount = Math.max(totalPrice - discount, 0);
const navigate = useNavigate();

  return (
    <div className="bg-[#f6fff4] min-h-screen py-12 -mt-10">
        <button
  onClick={() => navigate(-1)}
  className=" ml-20
    inline-flex items-center gap-3
    bg-white px-4 py-2 rounded-full
    shadow-md border border-green-100
    text-green-700 font-medium
    hover:bg-green-50 hover:shadow-lg
    active:scale-95
    transition-all duration-200
    cursor-pointer
  "
>
  <span className="
    flex items-center justify-center
    w-8 h-8 rounded-full
    bg-green-700 text-white
    text-lg
  ">
    ←
  </span>
  Back
</button>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-2">

        {/* ================= LEFT: CART ITEMS ================= */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Your cart items</h2>

          {items.map((item, i) => {
            const v = item.variants[item.selectedVariantIndex];

            return (
              <div key={i} className="bg-[#eaffea] p-6 rounded-xl relative">
                <div className="flex gap-6">

                  <img
                    src={item.imageUrl}
                    className="w-24 h-24 object-contain"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.name}
                    </h3>

                    {/* PRICE + 100G */}
                    <div className="mt-1 flex gap-3 items-center">
                      <span className="text-green-700 text-lg font-semibold">
                        ₹{v.offerPrice}
                      </span>

                      <span className="line-through text-gray-500">
                        ₹{v.mrp}
                      </span>

                      {item.base100gPrice && (
                        <span className="text-sm text-gray-700">
                          (₹{item.base100gPrice} / 100 g)
                        </span>
                      )}
                    </div>

                    {/* VARIANTS */}
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

                    {/* QUANTITY */}
                    <div className="mt-4 flex items-center gap-4">
                      <span>Quantity</span>
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

        {/* ================= RIGHT: PRICE DETAILS ================= */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h3 className="text-lg font-semibold mb-4">Price details</h3>
          <hr />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Product price ({items.length} items)</span>
              <span>₹{totalMrp}</span>
            </div>

            <div className="flex justify-between text-green-700">
              <span>Discount</span>
              <span>-₹{totalMrp - totalPrice}</span>
            </div>

           {/*  {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Coupon applied</span>
                <span>-₹{discount.toFixed(0)}</span>
              </div>
            )} */}

            <hr />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total amount</span>
              <span>₹{finalAmount.toFixed(0)}</span>
            </div>
          </div>

          {/* COUPON */}
         {/*  <div className="mt-6">
            <p className="text-sm font-medium mb-2">Apply coupon</p>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="border px-3 py-2 rounded w-full"
              />
              <button
                onClick={applyCoupon}
                className="bg-green-700 text-white px-4 rounded"
              >
                Apply
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Try <b>SAVE10</b> or <b>FLAT100</b>
            </p>
          </div> */}

          {/* PLACE ORDER */}
          <button className="mt-6 w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800">
            Place order
          </button>
        </div>
      </div>
    </div>
  );
}


