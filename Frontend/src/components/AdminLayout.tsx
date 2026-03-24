import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { User, LogOut, Menu } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const location = useLocation();

  // Simple breadcrumb/title logic
  const pathParts = location.pathname.split("/").filter(Boolean);
  const pageTitle = pathParts[pathParts.length - 1]?.replace(/-/g, " ") || "Dashboard";

  const qc = useQueryClient();
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    sessionStorage.clear();
    qc.clear();
    window.location.replace("/login");
  };

  return (
    <div className="min-h-screen bg-white flex font-inter">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-72 min-h-screen flex flex-col relative">
        {/* PREMIUM HEADER - Standardized White/Black/Green */}
        <header className="sticky top-0 z-40 bg-white h-20 px-4 md:px-8 flex items-center justify-between border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-lg md:text-xl text-black capitalize whitespace-nowrap">
                {pageTitle}
              </h2>
              <p className="hidden xs:block text-xs text-gray-400 uppercase text-[9px] md:text-[10px]">GoMunchz Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-xs text-black leading-tight">
                  {profile ? `${profile.firstName} ${profile.lastName}` : "System Admin"}
                </p>
                <p className="text-[10px] text-gray-400 uppercase">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <User size={20} />
              </div>
              <div className="h-8 w-px bg-gray-100 mx-2"></div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 text-[10px] uppercase transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 md:p-8 animate-fadeIn bg-white">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
