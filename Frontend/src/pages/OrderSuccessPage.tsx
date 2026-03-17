import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Truck, ArrowRight, PackageCheck, ShoppingBag } from "lucide-react";
import orderApi from "../api/orderApi";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [order, setOrder] = useState<any>(null);

  if (!state || !state.orderId) {
    useEffect(() => {
      navigate("/", { replace: true });
    }, [navigate]);
    return null;
  }

  const { orderId } = state as { orderId: string };

  useEffect(() => {
    orderApi.get(`/api/orders/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error("Failed to fetch order details", err));
  }, [orderId]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[150px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[150px] opacity-60"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10 text-center">
        <div className="premium-card bg-white rounded-[3rem] p-10 lg:p-16 border border-gray-50 shadow-2xl shadow-emerald-900/10">
          
          {/* CELEBRATION ICON */}
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-24 h-24 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-600/40 rotate-12 hover:rotate-0 transition-transform duration-700">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-6 bg-emerald-600"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Authorization Confirmed</p>
            <span className="h-px w-6 bg-emerald-600"></span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            The Munchz are <br />
            <span className="text-emerald-600 italic">En Route.</span>
          </h1>

          <p className="text-gray-400 font-bold text-[13px] uppercase tracking-widest mt-8 max-w-md mx-auto leading-relaxed">
            Your gourmet selection has been secured. Our artisans are preparing your package for priority dispatch.
          </p>

          {/* TRACKING SECTION */}
          {order?.shiprocketShipmentId ? (
            <div className="mt-12 group p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center gap-8 transition-all hover:bg-white hover:shadow-xl hover:border-emerald-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Truck size={32} strokeWidth={1.5} />
              </div>
              <div className="text-center md:text-left flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Shiprocket Logistics Ready</p>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Active Tracking Protocol</h3>
              </div>
              <button 
                onClick={() => navigate(`/track/${order.shiprocketShipmentId}`)}
                className="bg-black text-white px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-3 shadow-lg shadow-black/10"
              >
                Launch Tracker
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="mt-12 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col items-center gap-4">
               <PackageCheck size={32} className="text-gray-300" />
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Processing in Warehouse</p>
            </div>
          )}

          {/* ORDER DETAILS SUMMARY */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50 pt-12">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Order Identifier</p>
              <p className="text-xs font-black text-gray-900 tracking-widest break-all bg-gray-50 px-4 py-2 rounded-lg inline-block uppercase">
                {orderId.slice(-12)}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Transaction Status</p>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div>
                Settled Successfully
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-16 flex flex-col md:flex-row gap-6">
            <button
              onClick={() => navigate("/user-orders")}
              className="flex-1 h-18 bg-black text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all duration-500 shadow-xl shadow-black/10 flex items-center justify-center gap-4 group"
            >
              My Vault Selections
              <ShoppingBag size={16} className="text-emerald-400" />
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex-1 h-18 border-2 border-gray-100 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] text-gray-900 hover:border-emerald-600 hover:text-emerald-600 transition-all duration-500"
            >
              Continue Exploring
            </button>
          </div>
        </div>

        <p className="mt-12 text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Gourmet Experience Delivered • Munchz Premium</p>
      </div>
    </div>
  );
}