import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Truck, Package, MapPin, ArrowRight, AlertCircle } from "lucide-react";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TrackOrderPage() {
  const [shipmentId, setShipmentId] = useState("");
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = shipmentId.trim();
    if (!id) return;

    try {
      setValidating(true);
      setError(null);
      const res = await axios.get(`/shipping/track/${id}`);
      const data = res.data;
      const trackingData = data?.tracking_data;

      if (trackingData && (trackingData.track_status === 1 || (trackingData.shipment_track_activities && trackingData.shipment_track_activities.length > 0))) {
        navigate(`/track/${id}`);
      } else {
        setError("Please check your Tracking ID");
      }
    } catch (err) {
      console.error("Validation failed", err);
      setError("Please check your Tracking ID");
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#f9fdf7] flex flex-col">
      <TopHeader />
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-3 md:py-5 w-full flex flex-col items-center">
        {/* MAIN TRACKING CARD - SPLIT COLUMN LAYOUT */}
        <div className="max-w-6xl w-full bg-white shadow-[0_30px_70px_rgba(22,101,52,0.06)] overflow-hidden border border-green-100/30 flex flex-col md:flex-row md:h-[530px] rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 hover:shadow-[0_40px_80px_rgba(22,101,52,0.09)]">
          
          {/* Left Side: The Image properly displayed */}
          <div className="md:w-1/2 w-full md:relative md:h-full overflow-hidden bg-[#e4edd4] border-b md:border-b-0 md:border-r border-green-100/20 group">
            <img 
               src="https://res.cloudinary.com/dxfdcmxze/image/upload/f_auto,q_auto/v1780999951/track_borad_ivxwrr.jpg" 
              className="w-full h-auto block md:absolute md:inset-0 md:w-full md:h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              alt="Track Banner"
            />
          </div>

          {/* Right Side: Tracking Form (Light Green Color Background) */}
          <div className="md:w-1/2 w-full p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-center bg-gradient-to-br from-green-50/10 via-white to-amber-50/10 md:h-full overflow-hidden">
            <div className="max-w-md mx-auto w-full space-y-4">
              <div className="text-center md:text-left">
                <span className="text-[9px] font-bold text-green-600 tracking-widest uppercase block">Order Tracking</span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
                  Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Order</span>
                </h2>
                <p className="text-[11px] text-gray-500 font-medium">
                  Enter the Shipment ID sent via SMS or email to get started.
                </p>
              </div>

              <form onSubmit={handleTrack} className="space-y-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                    <Search className={`transition-colors ${error ? "text-red-400" : "text-gray-400 group-focus-within:text-green-600"}`} size={16} />
                  </div>
                  <input
                    type="text"
                    value={shipmentId}
                    onChange={(e) => {
                      setShipmentId(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter Shipment ID (e.g. 123047...)"
                    className={`w-full pl-10 pr-5 py-2.5 bg-gray-50/20 border rounded-2xl font-semibold text-gray-800 placeholder:text-gray-400 transition-all outline-none text-xs ${
                      error
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/5"
                        : "border-gray-200 focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-600/5 shadow-sm"
                    }`}
                    required
                    disabled={validating}
                  />

                  {error && (
                    <div className="flex items-center gap-2 mt-2 px-2 text-red-600 font-bold">
                      <AlertCircle size={14} />
                      <span className="text-xs italic">{error}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!shipmentId.trim() || validating}
                  className="group w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-10 py-3 rounded-2xl shadow-lg shadow-green-600/10 hover:shadow-xl hover:shadow-green-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {validating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Validating...
                    </div>
                  ) : (
                    <>
                      <span>Track Now</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-gray-100 flex flex-col items-center">
                <button
                  onClick={() => navigate('/user-orders')}
                  className="text-[10px] font-bold text-green-700 hover:text-green-800 transition-colors uppercase tracking-wider hover:underline underline-offset-4"
                >
                  View complete order history
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

// Reuse icon
function Leaf({ size, className }: { size: number; className?: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a8 8 0 0 1-10 10Z" />
            <path d="M21 2c-2 2-2.74 3-4.5 3.5" />
            <path d="M11 20c5-1 7-3.47 7-3.47" />
        </svg>
    );
}
