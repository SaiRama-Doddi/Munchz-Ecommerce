import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import paymentApi from "../api/paymentApi";
import { listAddressesApi, addAddressApi, updateAddressApi, deleteAddressApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../state/CartContext";
import type { CartItem, Address } from "../types/checkout";
import { ArrowLeft, Pencil, Trash2, MapPin, Check, Plus, X, ShieldCheck, Truck, ShoppingBag, ChevronRight, Bookmark } from "lucide-react";
import PremiumSpinner from "../components/PremiumSpinner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { clearCart } = useCart();
  const { state } = useLocation();

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
      theme: { color: "#16a34a" },
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
    <div className="w-full min-h-screen bg-white">
      {isPlacingOrder && <PremiumSpinner text="Processing Order" subtext="Securing your payment connection..." />}
      {isRedirecting && <PremiumSpinner text="Success! 🎉" subtext="Your snacks are on the way. Redirecting..." />}

      {/* STICKY HEADER - MINIMAL */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="p-3 hover:bg-green-50 rounded-2xl transition-colors border border-gray-100 hover:border-green-200">
              <ArrowLeft size={24} className="text-gray-400 hover:text-green-600" />
            </button>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Checkout</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest bg-green-50 px-4 py-2 rounded-xl">
             <ShieldCheck size={16} /> 100% Secure
          </div>
        </div>
      </div>

      {/* BRAND BANNER - LANDING PAGE TYPE */}
      <section className="relative w-full overflow-hidden bg-white py-12 md:py-20 border-b border-gray-100 hidden sm:block">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-gray-900">
            <p className="text-xl md:text-2xl font-medium text-green-600/80">Pure Ingredients</p>
            <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight">Real ingredients</h2>
              <h2 className="text-4xl md:text-6xl font-light leading-tight tracking-tight text-gray-700">Unreal flavor</h2>
            </div>
            <p className="text-xl md:text-2xl font-medium text-green-600/80 pt-2">Absolutely zero compromise</p>
            <div className="pt-8">
              <span className="inline-block text-3xl md:text-4xl font-bold tracking-tight">GoMunchZ</span>
              <div className="w-20 h-1 bg-green-500 mt-2 rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-end opacity-20"><ShieldCheck size={200} strokeWidth={0.5} /></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 pb-32">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* LEFT: ITEMS & ADDRESS */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* ORDER ITEMS */}
            <div className="space-y-8">
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                  Curated <span className="text-green-600">Items</span>
               </h2>
               <div className="space-y-4">
                 {items.map((item, idx) => {
                   const v = item.variants[item.selectedVariantIndex];
                   return (
                     <div key={idx} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100 hover:border-green-100 transition-all group">
                       <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-500 border border-gray-100 p-2">
                         <img src={item.imageUrl} className="w-full h-full object-contain" alt={item.name} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h4 className="text-base font-bold text-gray-900 truncate tracking-tight uppercase">{item.name}</h4>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{v.weightLabel} × {item.qty}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-lg font-black text-gray-900 tracking-tighter">₹{v.offerPrice * item.qty}</p>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                    Delivery <span className="text-green-600">Address</span>
                  </h2>
                  <button onClick={() => setShowNewAddress(!showNewAddress)} className="text-[10px] font-black text-green-600 uppercase tracking-widest hover:underline flex items-center gap-1 border border-green-100 px-4 py-2 rounded-xl bg-white shadow-sm">
                    {showNewAddress ? "Cancel" : "Add New Destination"}
                  </button>
               </div>

               {showNewAddress && (
                 <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Label (e.g. Home, Office)</label>
                        <input className="w-full bg-white px-5 py-4 rounded-2xl border border-gray-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,label:e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                        <input className="w-full bg-white px-5 py-4 rounded-2xl border border-gray-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,phone:e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-6">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Address</label>
                       <input className="w-full bg-white px-5 py-4 rounded-2xl border border-gray-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,addressLine1:e.target.value})} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6 mb-8">
                       <input placeholder="City" className="w-full bg-white px-5 py-4 rounded-2xl border border-gray-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,city:e.target.value})} />
                       <input placeholder="State" className="w-full bg-white px-5 py-4 rounded-2xl border border-gray-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,state:e.target.value})} />
                       <input placeholder="Pincode" className="w-full bg-white px-5 py-4 rounded-2xl border border-gray-100 outline-none focus:border-green-400 transition-all font-bold text-sm" onChange={(e)=>setNewAddress({...newAddress,pincode:e.target.value})} />
                    </div>
                    <button onClick={saveNewAddress} className="w-full bg-gray-900 text-white py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">Save Destination</button>
                 </div>
               )}

               <div className="grid md:grid-cols-2 gap-6">
                 {addresses.map((addr) => {
                   const isSelected = selectedAddress?.id === addr.id;
                   return (
                     <div 
                       key={addr.id} 
                       onClick={() => setSelectedAddress(addr)}
                       className={`relative p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group ${isSelected ? 'border-green-600 bg-white shadow-2xl shadow-green-50 z-10' : 'border-gray-100 bg-white hover:border-green-200'}`}
                     >
                        <div className="flex justify-between items-start mb-5">
                           <div className="flex items-center gap-3">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-300'}`}>
                               <MapPin size={24} />
                             </div>
                             <div>
                               <p className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-none">{addr.label}</p>
                               {addr.isDefault && <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-lg uppercase mt-1.5 inline-block">Default</span>}
                             </div>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={(e)=>{ e.stopPropagation(); setEditingId(addr.id); setForm(addr); }} className="p-2.5 transition-all text-gray-300 hover:text-green-600 hover:bg-green-50 rounded-xl"><Pencil size={14} /></button>
                              <button onClick={(e)=>{ e.stopPropagation(); handleDeleteAddress(addr.id); }} className="p-2.5 transition-all text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={14} /></button>
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-relaxed">{addr.addressLine1}</p>
                           <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-4 right-4 text-green-600 opacity-20"><Check size={40} strokeWidth={4} /></div>
                        )}
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-[2.5rem] p-8 border-2 border-gray-900 shadow-2xl lg:sticky lg:top-36 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12"><Bookmark size={100} /></div>
                
                <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic mb-8">Order Recap</h3>

                <div className="space-y-4 mb-10">
                   <div className="flex justify-between items-baseline px-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SUBTOTAL</span>
                      <span className="text-lg font-black text-gray-900 tracking-tighter">₹{(totalAmount + discount).toFixed(0)}</span>
                   </div>
                   {discount > 0 && (
                     <div className="flex justify-between items-center px-4 py-2 bg-green-50/50 rounded-xl animate-pulse">
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none">LOYALTY SAVINGS</span>
                        <span className="text-lg font-black text-green-600 tracking-tighter">-₹{discount}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-baseline px-2">
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">SHIPPING</span>
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">COMPLEMENTARY</span>
                   </div>
                   
                   <div className="h-px bg-gray-100 my-6"></div>

                   <div className="flex flex-col gap-1 bg-gray-900 text-white p-6 rounded-[2rem] shadow-xl">
                      <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.4em]">FINAL PAYABLE</p>
                      <div className="flex items-baseline justify-between">
                         <span className="text-5xl font-black tracking-tighter italic">₹{totalAmount.toFixed(0)}</span>
                         <ShoppingBag size={24} className="text-white/20" />
                      </div>
                   </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={isPlacingOrder || !selectedAddress}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-green-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <span>{isPlacingOrder ? "PROCESSING..." : "PLACE SECURE ORDER"}</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-8 flex flex-col items-center gap-4 opacity-20">
                   <div className="flex items-center gap-4">
                      <ShieldCheck size={20} />
                      <Truck size={20} />
                   </div>
                   <p className="text-[8px] font-black uppercase tracking-widest text-center">Fast & Secure Worldwide Shipping</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
