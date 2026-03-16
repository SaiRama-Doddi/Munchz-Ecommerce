import Sidebar from "./Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, User, Package, Clock, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { SearchProvider, useSearch } from "../context/SearchContext";
import axios from "axios";

export default function AdminLayout() {
  return (
    <SearchProvider>
      <AdminLayoutContent />
    </SearchProvider>
  );
}

function AdminLayoutContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSearchQuery } = useSearch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [todayOrders, setTodayOrders] = useState<any[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Simple breadcrumb/title logic
  const pathParts = location.pathname.split("/").filter(Boolean);
  const pageTitle = pathParts[pathParts.length - 1]?.replace(/-/g, " ") || "Dashboard";

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("/order/api/orders/adminallorders?page=0&size=5,desc", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orders = res.data.content || res.data || [];
        
        // Filter for "Today"
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const filtered = orders.filter((o: any) => {
          const orderDate = new Date(o.placedAt);
          return orderDate >= startOfDay;
        });
        
        setTodayOrders(filtered);
      } catch (err) {
        console.error("Layout Fetch Error:", err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 60000); // Pulse every minute
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <div className="flex-1 ml-72 min-h-screen flex flex-col relative">
        {/* PREMIUM HEADER */}
        <header className="sticky top-0 z-40 glass-effect h-20 px-8 flex items-center justify-between border-b border-slate-200/60 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight">
              {pageTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium">Welcome back to your command center</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-slate-100/80 rounded-full px-4 py-2 border border-slate-200/50 group focus-within:bg-white focus-within:border-emerald-500 transition-all duration-300">
              <Search size={16} className="text-slate-400 group-focus-within:text-emerald-500" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs ml-3 w-48 text-slate-600 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-full bg-white text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 shadow-sm transition-all duration-300 relative border border-slate-200/50 active:scale-95"
              >
                <Bell size={20} />
                {todayOrders.length > 0 && (
                  <span className="absolute top-2 right-2.5 w-4 h-4 bg-rose-500 text-[10px] font-black text-white rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                    {todayOrders.length}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 z-[100] animate-fadeIn">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-black text-slate-900 flex items-center gap-2 tracking-tight">
                        Today's Alerts
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">{todayOrders.length} New</span>
                      </h3>
                      <button 
                        onClick={() => navigate("/admin/orders")}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {todayOrders.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-300">
                          <Package size={48} className="opacity-10 mb-4" />
                          <p className="text-xs font-bold uppercase tracking-widest italic">All caught up!</p>
                        </div>
                      ) : (
                        todayOrders.map((order) => (
                          <div 
                            key={order.id}
                            onClick={() => {
                              setShowNotifications(false);
                              navigate("/admin/orders");
                            }}
                            className="p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-4">
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                  <Package size={18} />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-800 leading-tight">
                                    {order.shippingAddress?.fullName || "Guest User"}
                                  </p>
                                  <p className="text-xs text-slate-500 font-medium">
                                    Order #{order.id} • <span className="text-emerald-500 font-black">₹{order.totalAmount}</span>
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                    <Clock size={10} />
                                    {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {todayOrders.length > 0 && (
                      <button 
                        onClick={() => navigate("/admin/orders")}
                        className="w-full mt-4 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                      >
                        Launch Order Management
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              <div className="h-10 w-px bg-slate-200 mx-2"></div>

              <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors duration-300">
                <div className="w-9 h-9 rounded-full bg-accent-gradient flex items-center justify-center text-white shadow-md">
                  <User size={18} />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8 animate-fadeIn">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}