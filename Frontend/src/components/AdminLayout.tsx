import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Bell, Search, User } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  
  // Simple breadcrumb/title logic
  const pathParts = location.pathname.split("/").filter(Boolean);
  const pageTitle = pathParts[pathParts.length - 1]?.replace(/-/g, " ") || "Dashboard";

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
                className="bg-transparent border-none outline-none text-xs ml-3 w-48 text-slate-600 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-full bg-white text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 shadow-sm transition-all duration-300 relative border border-slate-200/50">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
              </button>
              
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