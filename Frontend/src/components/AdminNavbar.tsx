import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

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
<header className="fixed top-0 left-0 right-0 z-50
                   h-16 bg-white border-b border-gray-200
                   flex items-center justify-between px-8 shadow-sm">


      <h1 className="text-xl font-bold">Admin Panel</h1>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs text-gray-500">Logged in as</p>
          <p className="font-semibold">
            {profile ? `${profile.firstName} ${profile.lastName}` : "Admin"}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
}