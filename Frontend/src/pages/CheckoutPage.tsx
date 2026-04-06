import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import paymentApi from "../api/paymentApi";
import { listAddressesApi, addAddressApi, updateAddressApi, deleteAddressApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../state/CartContext";
import type { CartItem, Address } from "../types/checkout";
import { ArrowLeft, Pencil, Trash2, ShieldCheck, MapPin, CreditCard, ShoppingBag, ChevronRight, X, Check, Lock, Flame, Plus } from "lucide-react";
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
    setNewAddress({ label: "", addressLine1: "", city: "", state: "", pincode: "", phone: "" });
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
          clearCart();
          setIsRedirecting(true);
          setTimeout(() => {
            navigate("/order-success", { replace: true, state: { orderId } });
          }, 1500);
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
    setIsPlacingOrder(false);
    rzp.open();
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }
    try {
      setIsPlacingOrder(true);
      const orderRes = await orderApi.post("/orders", {
        shippingAddress: JSON.stringify(selectedAddress),
        billingAddress: JSON.stringify(selectedAddress),
        totalAmount,
        discount,
        couponCode: appliedCoupon,
        items: items.map((item) => {
          const v = item.variants[item.selectedVariantIndex];
          return { productId: item.productId, variantId: v.id, quantity: item.qty };
        }),
      });
      const orderId = orderRes.data.orderId;
      const paymentRes = await paymentApi.post("/api/payments/create", {
        orderId,
        amount: Math.round(totalAmount * 100),
        currency: "INR",
      });
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed to load");
        setIsPlacingOrder(false);
        return;
      }
      openRazorpay(paymentRes.data, orderId);
    } catch (err: any) {
      console.error("Order or Payment failed:", err);
      
      let errorMsg = "Something went wrong. Please try again.";
      
      if (err.response && err.response.data) {
        // Handle standard Spring Boot error or our custom GlobalExceptionHandler format
        errorMsg = err.response.data.message || err.response.data.error || errorMsg;
      } else if (err.message) {
        errorMsg = err.message;
      }

      alert(`Error: ${errorMsg}`);
      setIsPlacingOrder(false);
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

      <div className="min-h-screen bg-white">

        {/* STICKY HEADER - UNIFIED WITH CART */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-green-50 px-5 py-4 sm:px-10 sm:py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-none">
                Checkout
              </h1>
              <p className="text-xs sm:text-base text-gray-500 font-medium mt-1 sm:mt-3 max-w-2xl leading-relaxed">
                Securely finishing your order • {items.length} Munchz
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="p-2 sm:p-3 bg-white hover:bg-green-50 rounded-xl sm:rounded-2xl transition-all border border-gray-100 hover:border-green-200 text-gray-400 hover:text-green-600"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

          {/* LEFT SIDE: ITEMS & ADDRESS */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">

            {/* ORDER ITEMS SECTION */}
            <div className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-green-50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-5 sm:p-10 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none"><ShoppingBag className="w-[80px] h-[80px] sm:w-[110px] sm:h-[110px]" /></div>
              
              <h3 className="text-base font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 tracking-tight">
                <div className="w-1.5 h-6 sm:h-8 bg-green-600 rounded-full"></div>
                Order Items
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {items.map((item, idx) => {
                  const v = item.variants[item.selectedVariantIndex];
                  return (
                    <div key={idx} className="flex gap-4 sm:gap-6 items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-green-50/30 transition-all border border-transparent hover:border-green-50">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#ecfdf5] rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                        <img src={item.imageUrl} className="w-full h-full object-contain p-2" alt={item.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-base tracking-tight line-clamp-1 truncate cursor-pointer hover:text-green-600 transition-colors" onClick={() => navigate(`/product/${item.productId}`)}>
                          {item.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase mt-0.5 sm:mt-1 tracking-widest">
                          {v.weightLabel} × {item.qty}
                        </p>
                      </div>
                      <p className="font-bold text-green-700 text-base tracking-tight">
                        ₹{v.offerPrice * item.qty}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SHIPPING ADDRESS SECTION */}
            <div className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-green-50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-5 sm:p-10 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none"><MapPin className="w-[80px] h-[80px] sm:w-[110px] sm:h-[110px]" /></div>

              <h3 className="text-base font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 tracking-tight">
                <div className="w-1.5 h-6 sm:h-8 bg-green-600 rounded-full"></div>
                Shipping Address
              </h3>

              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-2xl sm:rounded-[1.5rem] p-5 sm:p-6 relative transition-all border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-4 ${
                      selectedAddress?.id === addr.id
                        ? "border-green-600 bg-green-50/50"
                        : "border-gray-100 bg-white hover:border-green-200"
                    }`}
                  >
                    {editingId === addr.id ? (
                      <div className="w-full grid gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input placeholder="Label (e.g. Home)" className="bg-white border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-900 tracking-tight focus:border-green-600 outline-none" value={form.label || ""} onChange={(e)=>setForm({...form,label:e.target.value})} />
                          <input placeholder="Address Line" className="bg-white border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-900 tracking-tight focus:border-green-600 outline-none" value={form.addressLine1 || ""} onChange={(e)=>setForm({...form,addressLine1:e.target.value})} />
                          <input placeholder="City" className="bg-white border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-900 tracking-tight focus:border-green-600 outline-none" value={form.city || ""} onChange={(e)=>setForm({...form,city:e.target.value})} />
                          <input placeholder="State" className="bg-white border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-900 tracking-tight focus:border-green-600 outline-none" value={form.state || ""} onChange={(e)=>setForm({...form,state:e.target.value})} />
                          <input placeholder="Pincode" className="bg-white border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-900 tracking-tight focus:border-green-600 outline-none" value={form.pincode || ""} onChange={(e)=>setForm({...form,pincode:e.target.value})} />
                          <input placeholder="Phone" className="bg-white border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-900 tracking-tight focus:border-green-600 outline-none" value={form.phone || ""} onChange={(e)=>setForm({...form,phone:e.target.value})} />
                        </div>
                        <div className="flex gap-2 sm:gap-4">
                          <button onClick={()=>handleUpdateAddress(addr.id)} className="flex-1 bg-green-600 text-white py-3 sm:py-4 rounded-xl font-bold tracking-tight shadow-lg shadow-green-100 hover:bg-green-700 transition-all text-sm sm:text-base">UPDATE</button>
                          <button onClick={()=>setEditingId(null)} className="flex-1 bg-white border-2 border-gray-100 text-gray-400 py-3 sm:py-4 rounded-xl font-bold tracking-tight hover:bg-white transition-all text-sm sm:text-base">CANCEL</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div onClick={()=>setSelectedAddress(addr)} className="cursor-pointer flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                            <p className="font-bold text-gray-900 text-base tracking-tight uppercase leading-none truncate">{addr.label}</p>
                            {addr.isDefault && <span className="text-[9px] sm:text-[10px] bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full font-black uppercase tracking-widest shrink-0">Default</span>}
                          </div>
                          <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed max-w-sm shrink-0 break-words">
                            {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          {addr.phone && <p className="text-green-700 text-sm sm:text-base font-bold mt-1 sm:mt-2 flex items-center gap-2">📞 {addr.phone}</p>}
                        </div>
                        <div className="flex sm:flex-col gap-2 shrink-0">
                          <button onClick={()=>{setEditingId(addr.id); setForm(addr);}} className="p-3 bg-white text-gray-400 hover:text-green-600 hover:bg-green-50 border border-gray-100 rounded-xl transition-all"><Pencil size={18} /></button>
                          <button onClick={()=>handleDeleteAddress(addr.id)} className="p-3 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-100 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={()=>setShowNewAddress(!showNewAddress)} className="flex items-center gap-2 text-green-600 font-bold tracking-tight mt-8 hover:bg-green-50 px-5 py-3 rounded-xl transition-all border border-transparent hover:border-green-100">
                <Plus size={18} /> Add New Address
              </button>

              {showNewAddress && (
                <div className="mt-6 grid gap-4 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-[1.5rem] border border-gray-100 border-dashed">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input placeholder="Label (e.g. Work, Home)" className="bg-white border-2 border-gray-100 p-3 sm:p-4 rounded-xl font-bold text-gray-900 focus:border-green-600 outline-none" onChange={(e)=>setNewAddress({...newAddress,label:e.target.value})} />
                    <input placeholder="Address" className="bg-white border-2 border-gray-100 p-3 sm:p-4 rounded-xl font-bold text-gray-900 focus:border-green-600 outline-none" onChange={(e)=>setNewAddress({...newAddress,addressLine1:e.target.value})} />
                    <input placeholder="City" className="bg-white border-2 border-gray-100 p-3 sm:p-4 rounded-xl font-bold text-gray-900 focus:border-green-600 outline-none" onChange={(e)=>setNewAddress({...newAddress,city:e.target.value})} />
                    <input placeholder="State" className="bg-white border-2 border-gray-100 p-3 sm:p-4 rounded-xl font-bold text-gray-900 focus:border-green-600 outline-none" onChange={(e)=>setNewAddress({...newAddress,state:e.target.value})} />
                    <input placeholder="Pincode" className="bg-white border-2 border-gray-100 p-3 sm:p-4 rounded-xl font-bold text-gray-900 focus:border-green-600 outline-none" onChange={(e)=>setNewAddress({...newAddress,pincode:e.target.value})} />
                    <input placeholder="Phone" className="bg-white border-2 border-gray-100 p-3 sm:p-4 rounded-xl font-bold text-gray-900 focus:border-green-600 outline-none" onChange={(e)=>setNewAddress({...newAddress,phone:e.target.value})} />
                  </div>
                  <button onClick={saveNewAddress} className="bg-green-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold tracking-tight shadow-xl shadow-green-100 hover:bg-green-700 transition-all mt-2 text-sm sm:text-base">SAVE ADDRESS & CONTINUE</button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: PRICE SUMMARY */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-green-600 shadow-xl lg:sticky lg:top-32 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 sm:p-10 opacity-5 pointer-events-none rotate-12"><CreditCard className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px]" /></div>
               
               <h3 className="text-base font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 tracking-tight">
                 <div className="w-1.5 h-6 sm:h-8 bg-green-600 rounded-full"></div>
                 Price Summary
               </h3>

               <div className="space-y-4 mb-10">
                 <div className="flex justify-between items-center text-sm md:text-base font-bold text-gray-900 tracking-tight bg-white/50 p-3 rounded-xl border border-gray-100">
                   <span>Initial Amount</span>
                   <span className="font-bold">₹{totalAmount + discount}</span>
                 </div>
                 {discount > 0 && (
                   <div className="flex justify-between items-center text-sm md:text-base font-bold text-green-700 tracking-tight px-3">
                     <span>Coupon Discount</span>
                     <span className="font-bold">-₹{discount}</span>
                   </div>
                 )}
                 <div className="flex justify-between items-center text-sm md:text-base font-bold text-green-700 tracking-tight px-3">
                   <span>Shipping</span>
                   <span className="font-bold text-green-600 uppercase tracking-widest text-[10px]">FREE</span>
                 </div>
                 <div className="h-px bg-white my-4"></div>
                 <div className="flex justify-between items-end bg-green-50/50 p-4 rounded-2xl border border-green-100">
                   <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Grand Total</p>
                     <p className="text-base font-bold text-gray-900 tracking-tighter leading-none">₹{totalAmount.toFixed(0)}</p>
                   </div>
                   <div className="pb-1 opacity-20"><ShieldCheck className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px]" /></div>
                 </div>
               </div>

               <button
                 onClick={placeOrder}
                 disabled={isPlacingOrder}
                 className="w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 rounded-xl font-bold tracking-tight transition-all flex items-center justify-center gap-2 border-none outline-none shadow-sm group disabled:opacity-50 text-sm sm:text-base"
               >
                 <span>CONFIRM & SECURE ORDER</span>
                 <ChevronRight className="group-hover:translate-x-1 transition-transform w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]" />
               </button>

               <div className="mt-8 grid grid-cols-3 gap-2 opacity-40">
                 <div className="flex flex-col items-center gap-1">
                   <Lock size={16} />
                   <span className="text-[8px] font-bold uppercase tracking-widest">Secure</span>
                 </div>
                 <div className="flex flex-col items-center gap-1 border-x border-gray-100">
                   <ShieldCheck size={16} />
                   <span className="text-[8px] font-bold uppercase tracking-widest">Razorpay</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                   <Flame size={16} />
                   <span className="text-[8px] font-bold uppercase tracking-widest">Fast</span>
                 </div>
               </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center font-medium leading-relaxed">
              By placing the order, you agree to our terms and conditions. <br />
              Secure payment processed via Razorpay.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
