import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import paymentApi from "../api/paymentApi";
import { listAddressesApi, addAddressApi, updateAddressApi, deleteAddressApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../state/CartContext";
import type { CartItem, Address } from "../types/checkout";
import { ArrowLeft, Pencil, Trash2, MapPin, Phone, Check, Plus, X, ShieldCheck, Truck, ShoppingBag, ChevronRight, Bookmark } from "lucide-react";
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

  const saveNewAddress = async () => {
    if (!newAddress.label || !newAddress.addressLine1 || !newAddress.pincode) {
      alert("Please fill in essential address details");
      return;
    }
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
    await updateAddressApi(id, { ...form, phone: form.phone?.trim() || "" });
    const res = await listAddressesApi();
    setAddresses(res.data);
    setEditingId(null);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await deleteAddressApi(id);
    const res = await listAddressesApi();
    setAddresses(res.data);
    if (selectedAddress?.id === id) setSelectedAddress(null);
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

  const openRazorpay = (paymentData: any, orderId: string) => {
    const options = {
      key: paymentData.key,
      amount: paymentData.amount,
      currency: paymentData.currency,
      name: "GoMunchz",
      description: "Secure Order Payment",
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
      prefill: { name: `${profile?.firstName} ${profile?.lastName}`, email: profile?.email },
      theme: { color: "#15803d" },
    };
    const rzp = new (window as any).Razorpay(options);
    setIsPlacingOrder(false);
    rzp.open();
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }
    try {
      setIsPlacingOrder(true);
      const orderRes = await orderApi.post("/api/orders", {
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
      const paymentRes = await paymentApi.post("/api/payments/create", { orderId, amount: totalAmount * 100, currency: "INR" });
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed to load");
        setIsPlacingOrder(false);
        return;
      }
      openRazorpay(paymentRes.data, orderId);
    } catch (err) {
      console.error(err);
      alert("Order or payment failed");
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f9fdf7]">
      {isPlacingOrder && <PremiumSpinner text="Processing Order" subtext="Securing your payment connection..." />}
      {isRedirecting && <PremiumSpinner text="Success! 🎉" subtext="Your snacks are on the way. Redirecting..." />}

      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-green-50 px-6 py-4 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-green-50 rounded-xl transition-colors">
              <ArrowLeft size={24} className="text-gray-400 hover:text-green-600" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Secure <span className="text-green-600">Checkout</span></h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Order #M-{(Math.random()*1000).toFixed(0)} • Premium Fulfillment</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
             <ShieldCheck size={16} /> 100% Secure Transaction
          </div>
        </div>
      </div>

      {/* BRAND BANNER */}
      <section className="bg-white border-b border-green-50 py-10 md:py-16 hidden sm:block">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-2">
          <p className="text-base font-medium text-green-600/80 uppercase tracking-[0.3em]">Pure Ingredients</p>
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-5">
            <h2 className="text-4xl md:text-7xl font-black leading-none tracking-tighter text-gray-900 italic">Real ingredients</h2>
            <h2 className="text-4xl md:text-7xl font-thin leading-none tracking-tighter text-gray-400 italic">Unreal flavor</h2>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 pb-32">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* LEFT: ITEMS & ADDRESS */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* ORDER ITEMS SECTION */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-green-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Order <span className="text-green-600">Items</span></h3>
                 <span className="text-[10px] font-black bg-green-50 text-green-700 px-3 py-1 rounded-full uppercase tracking-widest">{items.length} Products</span>
               </div>
               
               <div className="space-y-4">
                 {items.map((item, idx) => {
                   const v = item.variants[item.selectedVariantIndex];
                   return (
                     <div key={idx} className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-transparent hover:border-green-100 transition-all">
                       <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                         <img src={item.imageUrl} className="w-full h-full object-contain p-2" alt={item.name} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-bold text-gray-900 truncate tracking-tight">{item.name}</h4>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{v.weightLabel} × {item.qty}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-sm font-black text-gray-900 tracking-tighter">₹{v.offerPrice * item.qty}</p>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>

            {/* SHIPPING ADDRESS SECTION */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-green-100 shadow-sm transition-all duration-500 hover:shadow-xl">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Shipping <span className="text-green-600">Address</span></h3>
                  <button onClick={() => setShowNewAddress(!showNewAddress)} className="text-[10px] font-black text-green-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                    <Plus size={12} /> {showNewAddress ? "Cancel" : "Add New"}
                  </button>
               </div>

               {showNewAddress && (
                 <div className="mb-10 bg-[#ecfdf5]/30 p-8 rounded-[2rem] border-2 border-dashed border-green-200 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid sm:grid-cols-2 gap-5 mb-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Label (e.g. Home, Office)</label>
                        <input className="w-full bg-white px-5 py-3.5 rounded-2xl border border-green-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,label:e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                        <input className="w-full bg-white px-5 py-3.5 rounded-2xl border border-green-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,phone:e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-6">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Address</label>
                       <input className="w-full bg-white px-5 py-3.5 rounded-2xl border border-green-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,addressLine1:e.target.value})} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-5 mb-8">
                       <input placeholder="City" className="w-full bg-white px-5 py-3.5 rounded-2xl border border-green-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,city:e.target.value})} />
                       <input placeholder="State" className="w-full bg-white px-5 py-3.5 rounded-2xl border border-green-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,state:e.target.value})} />
                       <input placeholder="Pincode" className="w-full bg-white px-5 py-3.5 rounded-2xl border border-green-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,pincode:e.target.value})} />
                    </div>
                    <button onClick={saveNewAddress} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">Save Destination</button>
                 </div>
               )}

               <div className="grid md:grid-cols-2 gap-4">
                 {addresses.map((addr) => {
                   const isSelected = selectedAddress?.id === addr.id;
                   return (
                     <div 
                       key={addr.id} 
                       onClick={() => setSelectedAddress(addr)}
                       className={`relative p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${isSelected ? 'border-green-600 bg-[#ecfdf5]/50 shadow-lg shadow-green-50' : 'border-gray-50 bg-gray-50/50 hover:border-green-200'}`}
                     >
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-2">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-green-600 text-white' : 'bg-white text-gray-300'}`}>
                               <MapPin size={20} />
                             </div>
                             <div>
                               <p className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-none">{addr.label}</p>
                               {addr.isDefault && <span className="text-[8px] font-black text-green-600 bg-white px-1.5 py-0.5 rounded uppercase mt-1 inline-block">Default</span>}
                             </div>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={(e)=>{ e.stopPropagation(); setEditingId(addr.id); setForm(addr); }} className="p-2 transition-all text-gray-300 hover:text-green-600 hover:bg-white rounded-lg"><Pencil size={14} /></button>
                              <button onClick={(e)=>{ e.stopPropagation(); handleDeleteAddress(addr.id); }} className="p-2 transition-all text-gray-300 hover:text-red-600 hover:bg-white rounded-lg"><Trash2 size={14} /></button>
                           </div>
                        </div>
                        <div className="space-y-1 mt-2">
                           <p className="text-xs font-bold text-gray-800 line-clamp-2">{addr.addressLine1}</p>
                           <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-in zoom-in duration-300">
                            <Check size={16} />
                          </div>
                        )}
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY COLUMN */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border-2 border-green-600 shadow-2xl lg:sticky lg:top-28 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none rotate-12"><Bookmark size={100} /></div>
                
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-8">Checkout <span className="text-green-600">Secure</span></h3>

                <div className="space-y-4 mb-10">
                   <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Subtotal</span>
                      <span className="text-lg font-black text-gray-900 tracking-tighter">₹{totalAmount + discount}</span>
                   </div>
                   {discount > 0 && (
                     <div className="flex justify-between items-center px-4">
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">Loyalty Discount</span>
                        <span className="text-lg font-black text-green-600 tracking-tighter">-₹{discount}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-center px-4">
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">Shipping</span>
                      <span className="text-xs font-black text-[#22c55e] uppercase tracking-[0.3em]">Complementary</span>
                   </div>
                   
                   <div className="h-px bg-green-50 my-6"></div>

                   <div className="flex flex-col gap-1 bg-[#ecfdf5] p-6 rounded-[2rem] border border-green-100 shadow-inner">
                      <p className="text-[10px] font-black text-green-700/50 uppercase tracking-[0.4em]">Order Total</p>
                      <div className="flex items-baseline justify-between">
                         <span className="text-5xl font-black text-gray-900 tracking-tighter">₹{totalAmount}</span>
                         <ShoppingBag size={24} className="text-green-600 opacity-20" />
                      </div>
                   </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={isPlacingOrder || !selectedAddress}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-green-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <span>{isPlacingOrder ? "PROCESSING..." : "CONFIRM & PAY"}</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-8 flex flex-col items-center gap-4 border-t border-green-50 pt-8">
                   <div className="flex items-center gap-4 text-gray-300">
                      <ShieldCheck size={20} />
                      <Truck size={20} />
                      <ShoppingBag size={20} />
                   </div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center leading-loose">
                     By confirming, you agree to Munchz <br/> Terms of Service & Privacy Policy
                   </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
