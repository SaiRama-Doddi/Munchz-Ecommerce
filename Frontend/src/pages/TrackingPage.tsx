import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Truck, 
  Package, 
  CheckCircle, 
  Clipboard, 
  MapPin, 
  Calendar, 
  ArrowLeft,
  Clock,
  AlertCircle
} from "lucide-react";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface TrackingActivity {
  date: string;
  status: string;
  location: string;
  activity: string;
}

interface TrackingData {
  tracking_data: {
    track_status: number;
    shipment_status: string;
    shipment_track: any[];
    shipment_track_activities: TrackingActivity[];
    track_url?: string;
    expected_date?: string;
  };
}

export default function TrackingPage() {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/shipping/track/${shipmentId}`);
        setTracking(res.data);
      } catch (err: any) {
        console.error("Tracking fetch failed", err);
        setError("Unable to fetch tracking information. It might take some time for tracking to be updated after shipment creation.");
      } finally {
        setLoading(false);
      }
    };

    if (shipmentId) {
      fetchTracking();
    }
  }, [shipmentId]);

  // Map Shiprocket status to steps (0-3)
  // 1: NEW, 6: PICKED UP, 17: IN TRANSIT, 18: OUT FOR DELIVERY, 7: DELIVERED
  const getActiveStep = (status: string | undefined): number => {
    if (!status) return 0;
    const s = status.toUpperCase();
    if (s.includes("DELIVERED")) return 4;
    if (s.includes("OUT FOR DELIVERY") || s.includes("REACHED")) return 3;
    if (s.includes("IN TRANSIT") || s.includes("SHIPPED")) return 2;
    if (s.includes("PICKED UP") || s.includes("MANIFESTED")) return 1;
    return 0; // Processed
  };

  const currentStep = getActiveStep(tracking?.tracking_data?.shipment_status);

  const steps = [
    { label: "Order Processed", icon: Clipboard },
    { label: "Shipped", icon: Package },
    { label: "En Route", icon: Truck },
    { label: "Delivered", icon: CheckCircle },
  ];

  return (
    <div className="bg-[#f0f9f1] min-h-screen font-sans">
      <TopHeader />
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-green-50">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Fetching real-time tracking data...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl shadow-lg border border-red-50 p-10 text-center animate-fadeIn">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-base font-bold text-gray-800 mb-4">Tracking Not Available Yet</h2>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              {error}
            </p>
            <button 
              onClick={() => navigate('/user-orders')}
              className="mt-8 px-8 py-3 bg-green-700 text-white rounded-full font-bold hover:bg-green-800 transition-all shadow-lg shadow-green-100"
            >
              Return to My Orders
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-green-50 relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full opacity-50 -mr-10 -mt-10"></div>
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-1 uppercase tracking-tighter">
                      Shipment Tracking
                    </h1>
                    <p className="text-green-600 font-bold flex items-center gap-2">
                       <span className="bg-green-100 px-3 py-1 rounded-lg">ID: {shipmentId}</span>
                    </p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-1">Status</p>
                     <span className="px-5 py-2 bg-green-600 text-white rounded-full font-black text-sm uppercase tracking-wide shadow-md">
                        {tracking?.tracking_data?.shipment_status || "Processing"}
                     </span>
                  </div>
               </div>

               {/* Custom Progress Bar */}
               <div className="mt-16 mb-8 px-4">
                  <div className="relative">
                    {/* Background Line */}
                    <div className="absolute top-6 left-0 w-full h-1.5 bg-gray-100 rounded-full"></div>
                    
                    {/* Active Line */}
                    <div 
                      className="absolute top-6 left-0 h-1.5 bg-green-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                      style={{ width: `${Math.min(100, (currentStep / 3) * 100)}%` }}
                    ></div>

                    {/* Steps */}
                    <div className="relative flex justify-between">
                      {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = idx <= currentStep;
                        return (
                          <div key={idx} className="flex flex-col items-center group">
                            <div className={`
                              w-12 h-12 rounded-2xl flex items-center justify-center z-10 
                              transition-all duration-500 transform
                              ${isActive 
                                ? "bg-green-600 text-white shadow-lg scale-110 rotate-3" 
                                : "bg-white text-gray-300 border-2 border-gray-100 group-hover:border-green-200"}
                            `}>
                              <Icon size={24} className={isActive ? "animate-pulse" : ""} />
                            </div>
                            <span className={`
                              mt-4 text-xs font-black uppercase tracking-wider
                              ${isActive ? "text-green-700" : "text-gray-400"}
                            `}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
               </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Left Column: Shipment Details */}
               <div className="md:col-span-1 space-y-6">
                  <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-50">
                    <h3 className="text-base font-bold text-gray-800 mb-4 border-b pb-3">Shipment Info</h3>
                    <div className="space-y-4">
                       <div className="flex gap-4">
                          <div className="bg-green-50 p-2 rounded-xl h-fit">
                             <MapPin size={18} className="text-green-600" />
                          </div>
                          <div>
                             <p className="text-xs text-gray-400 font-bold uppercase">Destination</p>
                             <p className="text-sm font-bold text-gray-700">Customer Address</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="bg-green-50 p-2 rounded-xl h-fit">
                             <Calendar size={18} className="text-green-600" />
                          </div>
                          <div>
                             <p className="text-xs text-gray-400 font-bold uppercase">Estimated Delivery</p>
                             <p className="text-sm font-bold text-gray-700">
                                {tracking?.tracking_data?.expected_date || "To be updated"}
                             </p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-green-700 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden group border-4 border-white">
                      <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform">
                          <Truck size={120} />
                      </div>
                      <h3 className="text-base font-black mb-2 italic">Fast Delivery</h3>
                      <p className="text-green-100 text-sm font-medium leading-relaxed">
                        GoMunchz is committed to bringing your favorite items as quickly as possible.
                      </p>
                  </div>
               </div>

               {/* Right Column: Tracking History */}
               <div className="md:col-span-2">
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-green-50 min-h-full">
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                      <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">Timeline</h3>
                      <Clock size={20} className="text-green-600" />
                    </div>

                    <div className="space-y-8 relative">
                      {/* Vertical Line for Timeline */}
                      <div className="absolute top-2 left-4 w-0.5 h-[calc(100%-40px)] bg-gray-100"></div>

                      {tracking?.tracking_data?.shipment_track_activities && tracking.tracking_data.shipment_track_activities.length > 0 ? (
                        tracking.tracking_data.shipment_track_activities.map((activity, idx) => (
                        <div key={idx} className="relative pl-12 group">
                          {/* Dot on Timeline */}
                          <div className={`
                            absolute top-1 left-[14px] w-2.5 h-2.5 rounded-full border-2 bg-white transition-colors
                            ${idx === 0 ? "border-green-600 ring-4 ring-green-100" : "border-gray-300 group-hover:border-green-300"}
                          `}></div>
                          
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                             <div className="space-y-1">
                                <p className={`font-black text-sm uppercase tracking-tight ${idx === 0 ? "text-green-700" : "text-gray-700"}`}>
                                   {activity.activity}
                                </p>
                                <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                                   <MapPin size={10} /> {activity.location || "In Transit"}
                                </p>
                             </div>
                             <div className="bg-gray-50 px-4 py-1.5 rounded-xl border border-gray-100 h-fit whitespace-nowrap">
                                <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">
                                   {activity.date}
                                </p>
                             </div>
                          </div>
                        </div>
                      ))
                      ) : (
                        <div className="text-center py-12">
                           <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                              <Package size={24} className="text-gray-300" />
                           </div>
                           <p className="text-gray-500 font-bold italic">No update history found yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
