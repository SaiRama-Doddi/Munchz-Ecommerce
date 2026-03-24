import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";

export default function AdminNavbar() {
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
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect h-16 flex items-center justify-between px-8 shadow-sm border-b border-slate-200/60">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white text-xs font-black">GM</span>
        </div>
        <h1 className="text-lg font-black text-slate-800 tracking-tight">GoMunchz Admin</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right flex items-center gap-3">
          <div className="hidden sm:block">
            <p className="text-xs text-slate-500 font-medium leading-tight">Admin Access</p>
            <p className="text-sm font-semibold text-slate-800">
              {profile ? `${profile.firstName} ${profile.lastName}` : "System Admin"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
            <User size={20} />
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-500/10 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center gap-2"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}