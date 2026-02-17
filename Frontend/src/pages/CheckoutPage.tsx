import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import paymentApi from "../api/paymentApi";
import { listAddressesApi, addAddressApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../state/CartContext";
import type { CartItem, Address } from "../types/checkout";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { clearCart } = useCart();
  const { state } = useLocation();

  /* 🔒 GUARD: prevent direct access */
  if (!state) {
    navigate("/", { replace: true });
    return null;
  }
const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { items, totalAmount, discount, appliedCoupon } = state as {
    items: CartItem[];
    totalAmount: number;
    discount: number;
    appliedCoupon?: string;
  };

  /* ================= ADDRESSES ================= */
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
    label: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
  });

  /* ================= LOAD ADDRESSES ================= */
  useEffect(() => {
    listAddressesApi().then((res) => {
      setAddresses(res.data);
      const def = res.data.find((a: Address) => a.isDefault);
      if (def) setSelectedAddress(def);
    });
  }, []);

  /* ================= ADD ADDRESS ================= */
  const saveNewAddress = async () => {
    await addAddressApi({
      ...newAddress,
      country: "India",
      isDefault: true,
    });

    const res = await listAddressesApi();
    setAddresses(res.data);
    setSelectedAddress(res.data.find((a: Address) => a.isDefault));
    setShowNewAddress(false);
  };

  /* ================= RAZORPAY ================= */
  const openRazorpay = (paymentData: any, orderId: string) => {
    const options = {
      key: paymentData.key,
      amount: paymentData.amount,
      currency: paymentData.currency,
      name: "Munchz",
      description: "Order Payment",
      order_id: paymentData.razorpayOrderId,

      handler: async (response: any) => {
        try {
          await paymentApi.post("/api/payments/verify", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          /* ✅ CLEAR CART ONLY AFTER PAYMENT SUCCESS */
          clearCart();

          navigate("/order-success", {
            replace: true,
            state: { orderId },
          });
        } catch {
          alert("Payment verification failed");
        }
      },

      prefill: {
        name: `${profile?.firstName} ${profile?.lastName}`,
        email: profile?.email,
      },

      theme: { color: "#15803d" },
    };

 const rzp = new (window as any).Razorpay(options);
setIsPlacingOrder(false); // stop spinner when popup opens
rzp.open();

  };

  /* ================= PLACE ORDER ================= */
const placeOrder = async () => {
  if (!selectedAddress) {
    alert("Please select a shipping address");
    return;
  }

  try {
    setIsPlacingOrder(true); // 🔥 START LOADING

    /* 1️⃣ CREATE ORDER */
    const orderRes = await orderApi.post("/api/orders", {
      shippingAddress: JSON.stringify(selectedAddress),
      billingAddress: JSON.stringify(selectedAddress),
      totalAmount,
      discount,
      couponCode: appliedCoupon,
      items: items.map((item) => {
        const v = item.variants[item.selectedVariantIndex];
        return {
          productId: item.productId,
          variantId: v.id,
          quantity: item.qty,
        };
      }),
    });

    const orderId = orderRes.data.orderId;

    /* 2️⃣ CREATE PAYMENT */
    const paymentRes = await paymentApi.post("/api/payments/create", {
      orderId,
      amount: totalAmount * 100,
      currency: "INR",
    });

    /* 3️⃣ OPEN RAZORPAY */
    openRazorpay(paymentRes.data, orderId);
  } catch (err) {
    console.error(err);
    alert("Order or payment failed");
    setIsPlacingOrder(false); // ❌ stop if error
  }
};
{isPlacingOrder && (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-green-700 font-medium">
      Processing your order...
    </p>
    <p className="text-sm text-gray-600">
      Please wait while we connect to secure payment
    </p>
  </div>
)}


  return (
    <div className="min-h-screen bg-[#f6fff4] py-10">
      <button
        onClick={() => navigate(-1)}
        className="ml-[136px] mb-6 inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow border border-green-100 text-green-700"
      >
        ← Back
      </button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Order Items</h3>
            {items.map((item, idx) => {
              const v = item.variants[item.selectedVariantIndex];
              return (
                <div key={idx} className="flex gap-4 mb-4">
                  <img src={item.imageUrl} className="w-20 h-20 object-contain" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {v.weightLabel} × {item.qty}
                    </p>
                    <p className="text-green-700 font-semibold">
                      ₹{v.offerPrice * item.qty}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Shipping Address</h3>

            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr)}
                className={`border rounded-lg p-3 mb-2 cursor-pointer ${
                  selectedAddress?.id === addr.id
                    ? "border-green-600 bg-green-50"
                    : ""
                }`}
              >
                <p className="font-medium">{addr.label}</p>
                <p className="text-sm text-gray-600">
                  {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            ))}

            <button
              onClick={() => setShowNewAddress(!showNewAddress)}
              className="text-green-600 text-sm mt-2"
            >
              + Add New Address
            </button>

            {showNewAddress && (
              <div className="mt-4 grid gap-3">
                {Object.keys(newAddress).map((k) => (
                  <input
                    key={k}
                    placeholder={k}
                    className="border p-2 rounded"
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, [k]: e.target.value })
                    }
                  />
                ))}
                <button
                  onClick={saveNewAddress}
                  className="bg-green-600 text-white py-2 rounded"
                >
                  Save Address
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h3 className="font-semibold mb-4">Price Summary</h3>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{totalAmount + discount}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-700 mb-2">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}

          <hr className="my-4" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total Payable</span>
            <span>₹{totalAmount}</span>
          </div>

         <button
  onClick={placeOrder}
  disabled={isPlacingOrder}
  className="w-full bg-green-700 text-white py-3 rounded-lg mt-4 disabled:opacity-60"
>
  {isPlacingOrder ? "Processing..." : "Confirm Order"}
</button>

        </div>
      </div>
    </div>
  );
}