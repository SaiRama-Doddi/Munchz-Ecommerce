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
        
        {/* MAIN TRACKING CARD - FULL WIDTH, REDUCED HEIGHT, SQUARE DESIGN */}
        <div className="max-w-6xl w-full bg-white shadow-2xl overflow-hidden border border-green-100 relative aspect-[2.1/1] flex flex-col rounded-none">
          
          {/* BACKGROUND IMAGE - FORCED COVERAGE */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://res.cloudinary.com/dxfdcmxze/image/upload/v1778814010/track_board_banner.jpg_kb5jia.jpg" 
              className="w-full h-full object-cover sm:object-fill"
              alt="Track Background"
            />
          </div>

          {/* INTERACTIVE OVERLAYS (Invisible but Functional) */}
          <div className="absolute inset-0 z-20">
            <form onSubmit={handleTrack} className="h-full w-full relative">
                
                {/* INVISIBLE INPUT FIELD - PRECISION CENTERED (Moved further right to 71%) */}
                <div 
                    className="absolute left-[71.0%] top-[39.8%] -translate-x-1/2 -translate-y-1/2 w-[38%] h-[12%]"
                >
                    <input
                        type="text"
                        value={shipmentId}
                        onChange={(e) => {
                            setShipmentId(e.target.value);
                            if (error) setError(null);
                        }}
                        className="w-full h-full bg-transparent border-none font-black text-gray-800 outline-none text-center text-sm sm:text-base md:text-2xl lg:text-3xl tracking-tight"
                        style={{ caretColor: '#2d4a2e' }}
                        required
                        disabled={validating}
                    />
                    
                    {error && (
                        <div className="absolute -bottom-14 left-0 right-0 text-center text-red-500 font-black italic text-[10px] md:text-xs uppercase tracking-tight bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-2xl border border-red-100 z-50">
                            {error}
                        </div>
                    )}
                </div>

                {/* INVISIBLE TRACK BUTTON (Center X: 71%) */}
                <div 
                    className="absolute left-[71.0%] top-[57.5%] -translate-x-1/2 -translate-y-1/2 w-[38%] h-[12%]"
                >
                    <button
                        type="submit"
                        disabled={!shipmentId.trim() || validating}
                        className="w-full h-full bg-transparent border-none cursor-pointer rounded-full active:bg-black/5 transition-colors flex items-center justify-center"
                        title="Track Now"
                    >
                        {validating && (
                            <div className="w-5 h-5 sm:w-8 sm:h-8 border-4 border-green-900/30 border-t-green-900 rounded-full animate-spin" />
                        )}
                    </button>
                </div>

                {/* INVISIBLE ORDER HISTORY LINK (Center X: 71%) */}
                <div 
                    className="absolute left-[71.0%] top-[78%] -translate-x-1/2 w-[38%] h-[6%] cursor-pointer"
                >
                    <button
                        onClick={() => navigate('/user-orders')}
                        className="w-full h-full bg-transparent border-none cursor-pointer"
                        title="View Order History"
                    />
                </div>

            </form>
          </div>

          {/* MOBILE HINT (Only on very small screens) */}
          <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none z-30 opacity-30 md:hidden">
               <p className="text-[6px] font-black text-white uppercase tracking-[0.2em]">Click the image fields to track</p>
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
