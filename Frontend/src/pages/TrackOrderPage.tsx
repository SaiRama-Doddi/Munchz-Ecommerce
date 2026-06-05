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
    <div className="min-h-screen font-sans bg-transparent flex flex-col">
      <TopHeader />
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 md:p-8 lg:p-12">
        
        {/* MAIN TRACKING CARD - SPLIT COLUMN LAYOUT */}
        <div className="max-w-6xl w-full bg-white shadow-2xl overflow-hidden border border-green-100 flex flex-col md:flex-row min-h-[500px] md:min-h-[550px] rounded-[2.5rem]">
          
          {/* Left Side: The Image properly displayed */}
          <div className="md:w-1/2 w-full relative min-h-[300px] md:min-h-0 overflow-hidden bg-gray-50 border-r border-green-50">
            <img 
              src="https://res.cloudinary.com/dxfdcmxze/image/upload/f_auto,q_auto/v1780413088/track_board_banner_t1yvlz.jpg" 
              className="absolute inset-0 w-full h-full object-cover object-left"
              alt="Track Banner"
            />
          </div>

          {/* Right Side: Tracking Form (Light Green Color Background) */}
          <div className="md:w-1/2 w-full p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-green-50/70">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter uppercase italic">
                  Find Order
                </h2>
                <p className="text-gray-600 font-bold italic">
                  Look for the Shipment ID in your confirmation email or order history.
                </p>
              </div>

              <form onSubmit={handleTrack} className="space-y-6">
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
                    className={`w-full pl-14 pr-6 py-5 bg-white border-2 rounded-3xl font-bold text-gray-800 placeholder:text-gray-300 transition-all outline-none ${
                      error
                        ? "border-red-200 focus:border-red-500 focus:ring-red-50"
                        : "border-gray-200 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    }`}
                    required
                    disabled={validating}
                  />

                  {error && (
                    <div className="flex items-center gap-2 mt-3 px-2 text-red-600 font-bold">
                      <AlertCircle size={16} />
                      <span className="text-sm italic">{error}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!shipmentId.trim() || validating}
                  className="w-full bg-green-700 text-white py-5 rounded-3xl font-black text-base uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-green-800 hover:shadow-2xl hover:shadow-green-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  {validating ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Validating...
                    </div>
                  ) : (
                    <>
                      Track Now
                      <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-green-200/50 text-center">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-3">Need help?</p>
                <button
                  onClick={() => navigate('/user-orders')}
                  className="text-green-700 font-black hover:underline underline-offset-8 decoration-4 decoration-green-100 transition-all"
                >
                  VIEW MY COMPLETE ORDER HISTORY
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
