import React from "react";
import { useCart } from "../state/CartContext";
import type { CartItem } from "../state/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const placeOrder = async () => {
    const orderRequest = {
      userId: 1,
      userName: "Guest User",
      address: "Not Provided",
      items: items.map((item: CartItem) => {
        const variant = item.variants[item.selectedVariantIndex];

        return {
          productId: item.productId,
          weightInGrams: variant.weightInGrams,
          quantity: item.qty,
        };
      }),
    };

    try {
      const res = await axios.post(
        "http://localhost:9090/api/orders",
        orderRequest,
        { headers: { "Content-Type": "application/json" } }
      );

      clearCart();
      navigate("/success", { state: res.data });
    } catch (error: any) {
      console.error("Order Create Error:", error.response?.data || error);
      alert("Order failed. Check backend logs.");
    }
  };

  if (items.length === 0) {
    return <div className="text-center p-10 text-xl">Cart is empty</div>;
  }

  const totalAmount = items.reduce<number>((sum, item: CartItem) => {
    const variant = item.variants[item.selectedVariantIndex];
    return sum + variant.offerPrice * item.qty;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="border p-4 rounded shadow bg-white">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>

        {items.map((item: CartItem, index: number) => {
          const variant = item.variants[item.selectedVariantIndex];

          return (
            <div
              key={`${item.productId}-${index}`}
              className="flex justify-between border-b py-2"
            >
              <span>
                {item.name} ({variant.weightInGrams}g) × {item.qty}
              </span>
              <span>₹{variant.offerPrice * item.qty}</span>
            </div>
          );
        })}

        <div className="flex justify-between mt-4 text-lg font-bold">
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </div>

        <button
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg"
          onClick={placeOrder}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}