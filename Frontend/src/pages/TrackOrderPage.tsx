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

      <main className="flex-grow max-w-7xl mx-auto px-4 pt-0 pb-6 md:pb-10 lg:pb-14 w-full flex flex-col items-center">
        {/* MAIN TRACKING CARD - SPLIT COLUMN LAYOUT */}
        <div className="max-w-6xl w-full -mt-4 md:-mt-6 lg:-mt-8 bg-white shadow-[0_20px_50px_rgba(22,101,52,0.08)] overflow-hidden border border-green-100/50 flex flex-col md:flex-row min-h-0 md:min-h-[500px] rounded-[2.5rem]">
          
          {/* Left Side: The Image properly displayed */}
          <div className="md:w-1/2 w-full relative min-h-[250px] md:min-h-0 overflow-hidden bg-gray-50 border-b md:border-b-0 md:border-r border-green-100 group">
            <img 
               src="https://res.cloudinary.com/dxfdcmxze/image/upload/f_auto,q_auto/v1780413088/track_board_banner_t1yvlz.jpg" 
              className="absolute inset-0 w-full h-full object-cover object-left transition-transform duration-700 group-hover:scale-105"
              alt="Track Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-950/20 via-transparent to-transparent opacity-80" />
          </div>

          {/* Right Side: Tracking Form (Light Green Color Background) */}
          <div className="md:w-1/2 w-full p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-gradient-to-br from-green-50/20 via-white to-amber-50/15">
            <div className="max-w-md mx-auto w-full space-y-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">
                  Find Your <span className="text-green-600">Order</span>
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Enter the Shipment ID sent via SMS or email to get started.
                </p>
              </div>

              <form onSubmit={handleTrack} className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                    <Search className={`transition-colors ${error ? "text-red-400" : "text-gray-400 group-focus-within:text-green-600"}`} size={20} />
                  </div>
                  <input
                    type="text"
                    value={shipmentId}
                    onChange={(e) => {
                      setShipmentId(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter Shipment ID (e.g. 123047...)"
                    className={`w-full pl-14 pr-6 py-4 bg-white border-2 rounded-[1.5rem] font-semibold text-gray-800 placeholder:text-gray-300 transition-all outline-none text-sm ${
                      error
                        ? "border-red-200 focus:border-red-500 focus:ring-red-50"
                        : "border-gray-200 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-50"
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
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-[1.5rem] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  {validating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Validating...
                    </div>
                  ) : (
                    <>
                      <span>Track Now</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-6 border-t border-green-100 flex flex-col items-center">
                <button
                  onClick={() => navigate('/user-orders')}
                  className="text-xs font-bold text-green-700 hover:text-green-800 transition-colors uppercase tracking-wider hover:underline underline-offset-4"
                >
                  View complete order history
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-green-50 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mb-1.5 text-green-600">
                    <span className="text-sm">⚡</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">Instant Status</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mb-1.5 text-green-600">
                    <span className="text-sm">🔒</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">Secure Info</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mb-1.5 text-green-600">
                    <span className="text-sm">📞</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">24/7 Helpline</span>
                </div>
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
