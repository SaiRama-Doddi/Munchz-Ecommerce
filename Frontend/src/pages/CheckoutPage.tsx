import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import paymentApi from "../api/paymentApi";
import { listAddressesApi, addAddressApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../state/CartContext";
import type { CartItem, Address } from "../types/checkout";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { updateAddressApi, deleteAddressApi } from "../api/api";
import PremiumSpinner from "../components/PremiumSpinner";
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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ country: "India", isDefault: false });

  const [newAddress, setNewAddress] = useState({
    label: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
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
      phone: newAddress.phone?.trim() || "",
      country: "India",
      isDefault: true,
    });

    const res = await listAddressesApi();
    setAddresses(res.data);
    setSelectedAddress(res.data.find((a: Address) => a.isDefault));
    setShowNewAddress(false);
  };
  const handleUpdateAddress = async (id: string) => {
    const payload = {
      ...form,
      phone: form.phone?.trim() || "",
    };

    await updateAddressApi(id, payload);

    const res = await listAddressesApi();
    setAddresses(res.data);
    setEditingId(null);
    setForm({ country: "India", isDefault: false });
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;

    await deleteAddressApi(id);

    const res = await listAddressesApi();
    setAddresses(res.data);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* ================= RAZORPAY ================= */
  const openRazorpay = (paymentData: any, orderId: string) => {
    const options = {
      key: paymentData.key,
      amount: paymentData.amount,
      currency: paymentData.currency,
      name: "GoMunchz",
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

          setIsRedirecting(true);

          setTimeout(() => {
            navigate("/order-success", {
              replace: true,
              state: { orderId },
            });
          }, 3500); // 3.5 second premium delay for user to see success
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
      /*openRazorpay(paymentRes.data, orderId);*/
      /* 3️⃣ LOAD RAZORPAY SDK */
      const loaded = await loadRazorpay();

      if (!loaded) {
        alert("Razorpay SDK failed to load");
        setIsPlacingOrder(false);
        return;
      }

      /* 4️⃣ OPEN RAZORPAY */
      openRazorpay(paymentRes.data, orderId);
    } catch (err) {
      console.error(err);
      alert("Order or payment failed");
      setIsPlacingOrder(false); // ❌ stop if error
    }
  };


  return (
    <>
      {isPlacingOrder && (
        <PremiumSpinner 
          text="Processing Order" 
          subtext="Please wait while we connect to secure payment gateway..." 
        />
      )}

      {isRedirecting && (
        <PremiumSpinner 
          text="Payment Successful! 🎉" 
          subtext="Your delicious Munchz are being prepared. Redirecting to confirmation..." 
        />
      )}

      <div className="min-h-screen bg-gradient-to-b from-[#f6fff4] to-white py-10">

        {/* HEADER */}


        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* ORDER ITEMS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="font-semibold text-lg mb-5">
                Order Items
              </h3>

              <div className="space-y-4">
                {items.map((item, idx) => {
                  const v = item.variants[item.selectedVariantIndex];

                  return (
                    <div key={idx} className="flex gap-4 items-center">

                      <img
                        src={item.imageUrl}
                        className="w-20 h-20 object-contain border rounded-lg cursor-pointer"
                        onClick={() => navigate(`/product/${item.productId}`)}
                      />

                      <div className="flex-1">
                        <p
                          className="font-medium cursor-pointer"
                          onClick={() => navigate(`/product/${item.productId}`)}
                        >
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {v.weightLabel} × {item.qty}
                        </p>
                      </div>

                      <p className="font-semibold text-green-700">
                        ₹{v.offerPrice * item.qty}
                      </p>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* ADDRESS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
<h3 className="font-semibold text-lg mb-5">
Shipping Address
</h3>

<div className="space-y-3">

{addresses.map((addr) => (

<div
key={addr.id}
className={`border rounded-xl p-4 relative transition ${
selectedAddress?.id === addr.id
? "border-green-600 bg-green-50"
: "hover:border-gray-300"
}`}
>

{/* EDIT MODE */}
{editingId === addr.id ? (

<div className="space-y-2">

<input
placeholder="Label"
className="border p-2 rounded-lg w-full"
value={form.label || ""}
onChange={(e)=>setForm({...form,label:e.target.value})}
/>

<input
placeholder="Address Line"
className="border p-2 rounded-lg w-full"
value={form.addressLine1 || ""}
onChange={(e)=>setForm({...form,addressLine1:e.target.value})}
/>

<div className="grid grid-cols-2 gap-2">

<input
placeholder="City"
className="border p-2 rounded-lg"
value={form.city || ""}
onChange={(e)=>setForm({...form,city:e.target.value})}
/>

<input
placeholder="State"
className="border p-2 rounded-lg"
value={form.state || ""}
onChange={(e)=>setForm({...form,state:e.target.value})}
/>

</div>

<input
placeholder="Pincode"
className="border p-2 rounded-lg w-full"
value={form.pincode || ""}
onChange={(e)=>setForm({...form,pincode:e.target.value})}
/>

<input
placeholder="Phone Number"
className="border p-2 rounded-lg w-full mt-2"
value={form.phone || ""}
onChange={(e)=>setForm({...form,phone:e.target.value})}
/>

<div className="flex gap-2 mt-2">

<button
onClick={()=>handleUpdateAddress(addr.id)}
className="flex-1 bg-green-700 text-white py-2 rounded-lg"
>
Update
</button>

<button
onClick={()=>setEditingId(null)}
className="flex-1 border py-2 rounded-lg"
>
Cancel
</button>

</div>

</div>

) : (

<>
<div
onClick={()=>setSelectedAddress(addr)}
className="cursor-pointer"
>

<p className="font-medium flex items-center gap-2">
{addr.label}

{addr.isDefault && (
<span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
Default
</span>
)}

</p>

<p className="text-sm text-gray-600">
{addr.addressLine1}
</p>

<p className="text-sm text-gray-600">
{addr.city}, {addr.state} - {addr.pincode}
</p>

{addr.phone && (
<p className="text-sm text-gray-600 mt-1">
📞 {addr.phone}
</p>
)}

</div>

{/* ACTION BUTTONS */}
<div className="absolute top-3 right-3 flex gap-2">

<button
onClick={() => {
  setEditingId(addr.id);
  setForm(addr);
}}
className="p-1.5 rounded-md hover:bg-gray-100 transition"
>
<Pencil size={16} />
</button>

<button
onClick={() => handleDeleteAddress(addr.id)}
className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition"
>
<Trash2 size={16} />
</button>

</div>

</>

)}

</div>

))}

</div>

<button
onClick={()=>setShowNewAddress(!showNewAddress)}
className="text-green-700 font-medium text-sm mt-4"
>
+ Add New Address
</button>

{showNewAddress && (

<div className="mt-4 grid gap-3">

<input
placeholder="Label"
className="border p-2 rounded-lg"
onChange={(e)=>setNewAddress({...newAddress,label:e.target.value})}
/>

<input
placeholder="Address"
className="border p-2 rounded-lg"
onChange={(e)=>setNewAddress({...newAddress,addressLine1:e.target.value})}
/>

<div className="grid grid-cols-2 gap-2">

<input
placeholder="City"
className="border p-2 rounded-lg"
onChange={(e)=>setNewAddress({...newAddress,city:e.target.value})}
/>

<input
placeholder="State"
className="border p-2 rounded-lg"
onChange={(e)=>setNewAddress({...newAddress,state:e.target.value})}
/>

</div>

<input
placeholder="Pincode"
className="border p-2 rounded-lg"
onChange={(e)=>setNewAddress({...newAddress,pincode:e.target.value})}
/>

<input
placeholder="Phone Number"
className="border p-2 rounded-lg"
onChange={(e)=>setNewAddress({...newAddress,phone:e.target.value})}
/>

<button
onClick={saveNewAddress}
className="bg-green-700 text-white py-2 rounded-lg"
>
Save Address
</button>

</div>

)}

</div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit lg:sticky lg:top-20">

            <h3 className="font-semibold text-lg mb-5">
              Price Summary
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalAmount + discount}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-700 font-medium">
                  Free
                </span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total Payable</span>
                <span>
                  ₹{totalAmount}
                </span>
              </div>

            </div>

            <button
              onClick={placeOrder}
              disabled={isPlacingOrder}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl mt-6 disabled:opacity-60 transition"
            >
              {isPlacingOrder ? "Processing..." : "Confirm Order"}
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Secure payment powered by Razorpay
            </p>

          </div>

        </div>
      </div>
    </>
  );
}
