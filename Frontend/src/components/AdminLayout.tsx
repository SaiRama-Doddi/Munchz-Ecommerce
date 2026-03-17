import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const location = useLocation();
  
  // Simple breadcrumb/title logic
  const pathParts = location.pathname.split("/").filter(Boolean);
  const pageTitle = pathParts[pathParts.length - 1]?.replace(/-/g, " ") || "Dashboard";

  const qc = useQueryClient();
  const { profile } = useAuth();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    sessionStorage.clear();
    qc.clear();
    window.location.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-white flex font-inter">
      <Sidebar />

      <div className="flex-1 ml-72 min-h-screen flex flex-col relative">
        {/* PREMIUM HEADER - Standardized White/Black/Green */}
        <header className="sticky top-0 z-40 bg-white h-20 px-8 flex items-center justify-between border-b border-gray-100 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-black capitalize tracking-tight">
              {pageTitle}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-[10px]">Munchz Admin Dashboard</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-black leading-tight">
                  {profile ? `${profile.firstName} ${profile.lastName}` : "System Admin"}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <User size={20} />
              </div>
              <div className="h-8 w-px bg-gray-100 mx-2"></div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 font-bold text-[10px] uppercase tracking-widest transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8 animate-fadeIn bg-white">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}