import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import { listAddressesApi, addAddressApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import type { CartItem, Address } from "../types/checkout";
import paymentApi from "../api/paymentApi";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { state } = useLocation();

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




  const openRazorpay = (paymentData: any, orderId: string) => {
  const options = {
    key: paymentData.key,
    amount: paymentData.amount,
    currency: paymentData.currency,
    name: "Munchz",
    description: "Order Payment",
    order_id: paymentData.razorpayOrderId,

    handler: async function (response: any) {
      try {
        // 3️⃣ VERIFY PAYMENT (BACKEND)
        await paymentApi.post("/api/payments/verify", {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });

        alert("Payment successful 🎉");
        navigate("/order-success", { state: { orderId } });
      } catch (err) {
        console.error(err);
        alert("Payment verification failed");
      }
    },

    prefill: {
      name: profile?.firstName + " " + profile?.lastName,
      email: profile?.email,
    },

    theme: {
      color: "#15803d",
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};

/* ================= PLACE ORDER ================= */



const placeOrder = async () => {
  if (!selectedAddress) {
    alert("Please select a shipping address");
    return;
  }

  try {
    // 1️⃣ CREATE ORDER
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

    // 2️⃣ CREATE PAYMENT (BACKEND)
    const paymentRes = await paymentApi.post("/api/payments/create", {
      orderId,
      amount: totalAmount * 100, // Razorpay needs paise
      currency: "INR",
    });

    openRazorpay(paymentRes.data, orderId);
  } catch (err: any) {
    console.error(err);
    alert("Order or payment failed");
  }
};



  return (
    <div className="min-h-screen bg-[#f6fff4] py-10">
       <button
            onClick={() => navigate(-1)}
            className="mt-6 mb-8 ml-[136px]
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-6">

        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* ITEMS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Order Items</h3>

            {items.map((item, idx) => {
              const v = item.variants[item.selectedVariantIndex];
              return (
                <div key={idx} className="flex gap-4 mb-4">
                  <img
                    src={item.imageUrl}
                    className="w-20 h-20 object-contain rounded"
                  />
                  <div className="flex-1">
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

          {/* ADDRESSES */}
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
                {addr.mobile && (
                  <p className="text-xs text-gray-500">📞 {addr.mobile}</p>
                )}
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
                <input
                  placeholder="Label"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, label: e.target.value })
                  }
                />
                <input
                  placeholder="Address Line"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, addressLine1: e.target.value })
                  }
                />
                <input
                  placeholder="City"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                <input
                  placeholder="State"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
                <input
                  placeholder="Pincode"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pincode: e.target.value })
                  }
                />
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

        {/* ================= RIGHT ================= */}
       <div className="bg-white p-6 rounded-xl shadow h-fit">
  <h3 className="font-semibold mb-4">Price Summary</h3>

  <div className="flex justify-between mb-2">
    <span>Subtotal</span>
    <span>₹{items.reduce((sum, item) => {
      const v = item.variants[item.selectedVariantIndex];
      return sum + v.offerPrice * item.qty;
    }, 0)}</span>
  </div>

  {discount > 0 && (
    <div className="flex justify-between mb-2 text-green-700">
      <span>Discount</span>
      <span>-₹{discount}</span>
    </div>
  )}

  <hr className="my-4" />

  <div className="flex justify-between font-semibold text-lg">
    <span>Total Payable</span>
    <span>₹{totalAmount}</span> {/* ✅ FINAL AMOUNT */}
  </div>

  <button
    onClick={placeOrder}
    className="w-full bg-green-700 text-white py-3 rounded-lg mt-4"
  >
    Confirm Order
  </button>
</div>

      </div>
    </div>
  );
}
