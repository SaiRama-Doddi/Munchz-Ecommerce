import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { User } from "lucide-react";

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
            <div className="flex items-center gap-3">
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