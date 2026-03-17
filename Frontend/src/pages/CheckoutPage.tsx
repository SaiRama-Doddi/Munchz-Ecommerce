import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import paymentApi from "../api/paymentApi";
import { listAddressesApi, addAddressApi, updateAddressApi, deleteAddressApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../state/CartContext";
import type { CartItem, Address } from "../types/checkout";
import { ArrowLeft, Pencil, Trash2, Lock, Check, Plus, ChevronRight, MapPin, Phone, ShieldCheck } from "lucide-react";
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
    await addAddressApi({ ...newAddress, phone: newAddress.phone?.trim() || "", country: "India", isDefault: true });
    const res = await listAddressesApi();
    setAddresses(res.data);
    setSelectedAddress(res.data.find((a: Address) => a.isDefault));
    setShowNewAddress(false);
  };

  const handleUpdateAddress = async (id: string) => {
    const payload = { ...form, phone: form.phone?.trim() || "" };
    await updateAddressApi(id, payload);
    const res = await listAddressesApi();
    setAddresses(res.data);
    setEditingId(null);
    setForm({ country: "India", isDefault: false });
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Remove this destination from archive?")) return;
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

  const openRazorpay = (paymentData: any, orderId: string) => {
    const options = {
      key: paymentData.key,
      amount: paymentData.amount,
      currency: paymentData.currency,
      name: "Munchz Premium",
      description: "Priority Acquisition Authorization",
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
          }, 2000);
        } catch {
          alert("Verification failure during acquisition protocol.");
        }
      },
      prefill: { name: `${profile?.firstName} ${profile?.lastName}`, email: profile?.email },
      theme: { color: "#059669" },
    };
    const rzp = new (window as any).Razorpay(options);
    setIsPlacingOrder(false);
    rzp.open();
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please designate a transfer destination.");
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
        alert("Payment gateway protocol expansion failed.");
        setIsPlacingOrder(false);
        return;
      }
      openRazorpay(paymentRes.data, orderId);
    } catch (err) {
      console.error(err);
      alert("Acquisition protocol failed. Trace back and retry.");
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {isPlacingOrder && <PremiumSpinner text="Authorizing Priority Order..." subtext="Connecting to the secure financial grid..." />}
      {isRedirecting && <PremiumSpinner text="Authorization Confirmed 🎉" subtext="The Munchz are being prioritized. Finalizing transfer..." />}

      <main className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-emerald-600 transition-all mb-12 group">
             <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
             Return to Inventory
          </button>

          <header className="mb-20">
             <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-emerald-600"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Protocol: Final Acquisition</p>
             </div>
             <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">Authorize Your <span className="text-emerald-600 italic">Selection</span></h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-20 items-start">
             
             <div className="space-y-24">
                
                {/* STEP 1: REVIEW */}
                <section>
                   <div className="flex items-center gap-6 mb-10">
                      <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-sm font-black">01</div>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">Inventory Verification</h3>
                   </div>

                   <div className="premium-card bg-gray-50/50 rounded-[3rem] p-8 lg:p-12 border border-gray-100">
                      <div className="space-y-10">
                         {items.map((item, idx) => {
                           const v = item.variants[item.selectedVariantIndex];
                           return (
                             <div key={idx} className="flex gap-8 items-center group">
                                <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden p-4 border border-gray-100 shrink-0 group-hover:border-emerald-200 transition-colors shadow-sm">
                                   <img src={item.imageUrl} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                                </div>
                                <div className="flex-1">
                                   <p className="text-sm font-black uppercase tracking-wide text-gray-900 line-clamp-1">{item.name}</p>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-2">{v.weightLabel} Selections • Qty {item.qty}</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-2xl font-black text-gray-900 tracking-tighter italic">₹{v.offerPrice * item.qty}</p>
                                </div>
                             </div>
                           );
                         })}
                      </div>
                   </div>
                </section>

                {/* STEP 2: DESTINATION */}
                <section>
                   <div className="flex items-center gap-6 mb-10">
                      <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-sm font-black">02</div>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">Transfer Destination</h3>
                   </div>

                   <div className="premium-card bg-white rounded-[4rem] p-8 lg:p-12 border border-gray-50 shadow-2xl shadow-emerald-900/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {addresses.map((addr) => {
                           const selected = selectedAddress?.id === addr.id;
                           return (
                             <div key={addr.id} onClick={() => setSelectedAddress(addr)} className={`group relative overflow-hidden rounded-[2.5rem] p-8 cursor-pointer transition-all duration-500 border-2 ${selected ? 'bg-emerald-50/30 border-emerald-600 shadow-xl shadow-emerald-600/10 scale-[1.03]' : 'bg-gray-50/50 border-gray-100 hover:border-emerald-100 hover:bg-white'}`}>
                                <div className="flex justify-between items-start mb-6">
                                   <div className={`p-2.5 rounded-xl transition-all ${selected ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-white text-gray-300'}`}><MapPin size={18} /></div>
                                   <div className="flex gap-3">
                                      <button onClick={(e) => { e.stopPropagation(); setEditingId(addr.id); setForm(addr); }} className="w-8 h-8 rounded-lg bg-white text-gray-300 hover:text-emerald-600 shadow-sm flex items-center justify-center transition-all"><Pencil size={14} /></button>
                                      <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }} className="w-8 h-8 rounded-lg bg-white text-gray-300 hover:text-red-500 shadow-sm flex items-center justify-center transition-all"><Trash2 size={14} /></button>
                                   </div>
                                </div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-2">{addr.label} Portfolio</h4>
                                <p className="text-[13px] font-bold text-gray-500 leading-relaxed mb-6">{addr.addressLine1}</p>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{addr.city}, {addr.pincode}</p>
                                   {selected && <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest"><Check size={12}/> Authorized</div>}
                                </div>
                             </div>
                           );
                         })}
                      </div>

                      <button onClick={() => setShowNewAddress(!showNewAddress)} className="h-16 w-full flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-700 mt-12 transition-all group bg-emerald-50/30 border border-emerald-100/50 rounded-2xl">
                         <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                         Integrate New Destination Archive
                      </button>

                      {showNewAddress && (
                        <div className="mt-10 p-10 bg-gray-50 rounded-[3rem] border border-gray-100 space-y-8 animate-fadeIn">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <input placeholder="Archive Label (e.g. Primary Residence)" className="h-16 px-8 rounded-2xl border border-gray-100 focus:border-emerald-600 bg-white outline-none font-bold text-sm transition-all" onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
                              <input placeholder="Priority Phone" className="h-16 px-8 rounded-2xl border border-gray-100 focus:border-emerald-600 bg-white outline-none font-bold text-sm transition-all" onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                           </div>
                           <input placeholder="Detailed Location Identity" className="h-16 px-8 rounded-2xl border border-gray-100 focus:border-emerald-600 bg-white outline-none font-bold text-sm transition-all w-full" onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              <input placeholder="City" className="h-16 px-8 rounded-2xl border border-gray-100 focus:border-emerald-600 bg-white outline-none font-bold text-sm transition-all" onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                              <input placeholder="Region/State" className="h-16 px-8 rounded-2xl border border-gray-100 focus:border-emerald-600 bg-white outline-none font-bold text-sm transition-all" onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                              <input placeholder="Index/Pincode" className="h-16 px-8 rounded-2xl border border-gray-100 focus:border-emerald-600 bg-white outline-none font-bold text-sm transition-all" onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                           </div>
                           <button onClick={saveNewAddress} className="w-full h-18 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-black/10">Authorize Secure Storage</button>
                        </div>
                      )}
                   </div>
                </section>
             </div>

             {/* SIDEBAR SUMMARY */}
             <aside className="sticky top-32 space-y-12">
                <div className="premium-card bg-black text-white p-10 lg:p-12 rounded-[4rem] shadow-3xl shadow-emerald-900/30 relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-[100px] -ml-32 -mt-32"></div>
                   <h3 className="text-2xl font-black uppercase tracking-tight mb-10 relative z-10 italic tracking-tighter">Acquisition <span className="text-emerald-400">Ledger</span></h3>
                   
                   <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-white/40"><span>Inventory Value</span><span className="text-white">₹{totalAmount + discount}</span></div>
                      {discount > 0 && <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-emerald-400"><span>Privilege Applied</span><span>-₹{discount}</span></div>}
                      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-white/40"><span>Transfer Logistics</span><span className="text-emerald-400">FREE</span></div>
                      <div className="h-px bg-white/10 my-6"></div>
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Final Transfer</p>
                            <p className="text-lg font-black uppercase">Total Payable</p>
                         </div>
                         <p className="text-4xl font-black text-emerald-400 tracking-tighter italic">₹{totalAmount}</p>
                      </div>
                   </div>

                   <button onClick={placeOrder} disabled={isPlacingOrder} className="w-full h-20 bg-white text-black rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all duration-500 mt-12 shadow-2xl shadow-emerald-400/20 active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50 relative z-10">
                      {isPlacingOrder ? "TRANSFER IN PROGRESS..." : "AUTHORIZE PAYMENT"}
                      <ChevronRight size={18} className="text-emerald-600 group-hover:translate-x-2 transition-transform" />
                   </button>

                   <div className="mt-10 flex flex-col items-center gap-4 relative z-10">
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 bg-white/5 px-6 py-2.5 rounded-full border border-white/5"><ShieldCheck size={14} className="text-emerald-500" /> Secure SSL Grid</div>
                      <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest text-center leading-relaxed">Razorpay Secure Protocol Active. <br/>Acquisition ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                   </div>
                </div>
             </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
