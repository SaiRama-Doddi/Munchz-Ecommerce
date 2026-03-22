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
    <div className="w-full min-h-screen bg-white font-medium">
      {isPlacingOrder && <PremiumSpinner text="Processing Order" subtext="Securing your payment connection..." />}
      {isRedirecting && <PremiumSpinner text="Success! 🎉" subtext="Your snacks are on the way. Redirecting..." />}

      {/* STICKY HEADER - MINIMAL */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-8 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => navigate(-1)} className="p-3 hover:bg-green-50 rounded-2xl transition-colors border border-gray-100 hover:border-green-200">
              <ArrowLeft size={24} className="text-gray-400 hover:text-green-600" />
            </button>
            <h1 className="text-2xl sm:text-4xl font-medium text-gray-900 tracking-tighter uppercase leading-none">Checkout</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-green-600 font-medium text-xs uppercase tracking-widest bg-green-50 px-5 py-3 rounded-2xl">
             <ShieldCheck size={18} /> 100% Secure
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 pb-32">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* LEFT: ITEMS & ADDRESS */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* ORDER ITEMS */}
            <div className="space-y-10">
               <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 leading-none">
                  Curated <span className="text-green-600">Items</span>
               </h2>
               <div className="space-y-6">
                 {items.map((item, idx) => {
                   const v = item.variants[item.selectedVariantIndex];
                   return (
                     <div key={idx} className="flex items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                       <div className="w-24 h-24 bg-[#ecfdf5]/40 rounded-3xl overflow-hidden flex-shrink-0 border border-gray-50 p-4">
                         <img src={item.imageUrl} className="w-full h-full object-contain" alt={item.name} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h4 className="text-lg sm:text-2xl font-medium text-gray-900 truncate tracking-tight uppercase">{item.name}</h4>
                         <p className="text-[10px] text-gray-400 font-medium uppercase mt-2 tracking-widest">{v.weightLabel} × {item.qty}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-xl sm:text-3xl font-medium text-gray-900 tracking-tighter italic">₹{v.offerPrice * item.qty}</p>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="space-y-10">
               <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 leading-none">
                    Delivery <span className="text-green-600">Address</span>
                  </h2>
                  <button onClick={() => setShowNewAddress(!showNewAddress)} className="text-[10px] font-medium text-green-600 uppercase tracking-widest hover:underline border border-green-100 px-6 py-3 rounded-2xl bg-white shadow-sm self-start">
                    {showNewAddress ? "Cancel" : "Add New Destination"}
                  </button>
               </div>

               {showNewAddress && (
                 <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid sm:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Label (e.g. Home, Office)</label>
                        <input className="w-full bg-white px-6 py-5 rounded-3xl border border-gray-100 outline-none focus:border-green-400 transition-all font-medium text-sm" onChange={(e)=>setNewAddress({...newAddress,label:e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                        <input className="w-full bg-white px-6 py-5 rounded-3xl border border-gray-100 outline-none focus:border-green-400 transition-all font-medium text-sm" onChange={(e)=>setNewAddress({...newAddress,phone:e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2 mb-8">
                       <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Full Address</label>
                       <input className="w-full bg-white px-6 py-5 rounded-3xl border border-gray-100 outline-none focus:border-green-400 transition-all font-medium text-sm" onChange={(e)=>setNewAddress({...newAddress,addressLine1:e.target.value})} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-8 mb-10">
                       <input placeholder="City" className="w-full bg-white px-6 py-5 rounded-3xl border border-gray-100 outline-none focus:border-green-400 transition-all font-medium text-sm" onChange={(e)=>setNewAddress({...newAddress,city:e.target.value})} />
                       <input placeholder="State" className="w-full bg-white px-6 py-5 rounded-3xl border border-gray-100 outline-none focus:border-green-400 transition-all font-medium text-sm" onChange={(e)=>setNewAddress({...newAddress,state:e.target.value})} />
                       <input placeholder="Pincode" className="w-full bg-white px-6 py-5 rounded-3xl border border-gray-100 outline-none focus:border-green-400 transition-all font-medium text-sm" onChange={(e)=>setNewAddress({...newAddress,pincode:e.target.value})} />
                    </div>
                    <button onClick={saveNewAddress} className="w-full bg-gray-900 text-white py-6 rounded-3xl font-medium text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-gray-200">Save Destination</button>
                 </div>
               )}

               <div className="grid md:grid-cols-2 gap-8">
                 {addresses.map((addr) => {
                   const isSelected = selectedAddress?.id === addr.id;
                   return (
                     <div 
                       key={addr.id} 
                       onClick={() => setSelectedAddress(addr)}
                       className={`relative p-8 rounded-[3rem] border-2 transition-all cursor-pointer group ${isSelected ? 'border-green-600 bg-white shadow-2xl shadow-green-50' : 'border-gray-50 bg-gray-50/50 hover:border-green-200'}`}
                     >
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSelected ? 'bg-green-600 text-white' : 'bg-white text-gray-300 shadow-sm'}`}>
                               <MapPin size={24} />
                             </div>
                             <div>
                               <p className="text-lg font-medium text-gray-900 uppercase tracking-tighter leading-none">{addr.label}</p>
                               {addr.isDefault && <span className="text-[9px] font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-lg uppercase mt-2 inline-block tracking-widest">Default</span>}
                             </div>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={(e)=>{ e.stopPropagation(); setEditingId(addr.id); setForm(addr); }} className="p-3 transition-all text-gray-300 hover:text-green-600 hover:bg-green-50 rounded-2xl"><Pencil size={18} /></button>
                              <button onClick={(e)=>{ e.stopPropagation(); handleDeleteAddress(addr.id); }} className="p-3 transition-all text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-2xl"><Trash2 size={18} /></button>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed">{addr.addressLine1}</p>
                           <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-6 right-6 text-green-600 opacity-20"><Check size={48} strokeWidth={4} /></div>
                        )}
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-[3rem] p-10 border border-gray-900 shadow-2xl lg:sticky lg:top-40 relative">
                <h3 className="text-2xl font-medium text-gray-900 mb-10 tracking-tighter uppercase">Order Summary</h3>

                <div className="space-y-6 mb-12">
                   <div className="flex justify-between items-baseline px-2">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.3em]">Subtotal</span>
                      <span className="text-2xl font-medium text-gray-900 tracking-tighter">₹{(totalAmount + discount).toFixed(0)}</span>
                   </div>
                   {discount > 0 && (
                     <div className="flex justify-between items-center px-6 py-4 bg-green-50 rounded-2xl">
                        <span className="text-[10px] font-medium text-green-600 uppercase tracking-widest">Savings</span>
                        <span className="text-2xl font-medium text-green-600 tracking-tighter">-₹{discount}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-baseline px-2">
                      <span className="text-[10px] font-medium text-green-600 uppercase tracking-widest">Shipping</span>
                      <span className="text-[10px] font-medium text-green-600 uppercase tracking-[0.2em]">Complementary</span>
                   </div>
                   
                   <div className="h-px bg-gray-100 my-8"></div>

                   <div className="flex flex-col gap-2 bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-xl">
                      <p className="text-[8px] font-medium text-white/40 uppercase tracking-[0.5em]">Final Payable</p>
                      <div className="flex items-baseline justify-between">
                         <span className="text-6xl font-medium tracking-tighter italic">₹{totalAmount.toFixed(0)}</span>
                         <ShoppingBag size={32} className="text-white/20" />
                      </div>
                   </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={isPlacingOrder || !selectedAddress}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-7 rounded-[2rem] font-medium text-xl shadow-xl shadow-green-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  <span>{isPlacingOrder ? "PROCESSING..." : "PLACE SECURE ORDER"}</span>
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-12 flex flex-col items-center gap-6 opacity-20">
                   <div className="flex items-center gap-8">
                      <ShieldCheck size={24} />
                      <Truck size={24} />
                      <ShoppingBag size={24} />
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
