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
      
      // Call backend to check if the ID is valid
      const res = await axios.get(`/shipping/track/${id}`);
      const data = res.data;

      // Extract tracking details
      // Shiprocket returning track_status: 0 or error field means it's likely invalid/not found
      const trackingData = data?.tracking_data;
      
      if (trackingData && (trackingData.track_status === 1 || (trackingData.shipment_track_activities && trackingData.shipment_track_activities.length > 0))) {
        // Valid tracking found
        navigate(`/track/${id}`);
      } else {
        // Not found or error from Shiprocket
        setError("please check your tracking id");
      }
    } catch (err) {
      console.error("Validation failed", err);
      setError("please check your tracking id");
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans">
      <TopHeader />
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-24">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-green-50 flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left Side: Illustration & Info */}
          <div className="md:w-1/2 bg-green-700 p-12 text-white flex flex-col justify-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-600 rounded-full opacity-20 pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full opacity-10"></div>

            <div className="relative z-10">
              <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
                <Truck size={40} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tighter uppercase italic">
                Track Your <br /> <span className="text-green-300">Cravings.</span>
              </h1>
              <p className="text-green-100 text-lg font-medium max-w-md leading-relaxed">
                Enter your shipment ID to see exactly where your GoMunchZ goodies are in real-time. From our kitchen to your doorstep.
              </p>

              <div className="mt-12 space-y-4">
                 <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <Package className="text-green-300" size={24} />
                    <span className="font-bold uppercase tracking-wider text-sm">Real-time GPS Tracking</span>
                 </div>
                 <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <MapPin className="text-green-300" size={24} />
                    <span className="font-bold uppercase tracking-wider text-sm">Status History Updates</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Side: Tracking Form */}
          <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter uppercase italic">
                  Find Order
                </h2>
                <p className="text-gray-500 font-medium italic">
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
                    className={`w-full pl-14 pr-6 py-5 bg-gray-50 border-2 rounded-3xl font-bold text-gray-800 placeholder:text-gray-300 transition-all outline-none ${
                      error 
                        ? "border-red-200 bg-red-50 focus:border-red-500 focus:ring-red-50" 
                        : "border-gray-100 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-50"
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
                  className="w-full bg-green-700 text-white py-6 rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-green-800 hover:shadow-2xl hover:shadow-green-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
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

              <div className="mt-12 pt-10 border-t border-gray-100 text-center">
                 <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Need help?</p>
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
