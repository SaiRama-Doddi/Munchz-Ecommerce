import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Layers,
  ShoppingBag,
  ClipboardList,
  Warehouse,
  TicketPercent,
  PackagePlus,
  PackageSearch,
  Store,
  Home,
  LogOut,
} from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/category", label: "Categories", icon: Layers },
  { to: "/admin/sub-category", label: "Subcategories", icon: Layers },
  { to: "/admin/products", label: "Products", icon: ShoppingBag },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/addstock", label: "Add Stock", icon: PackagePlus },
  { to: "/admin/inventory", label: "Stock List", icon: Warehouse },
  { to: "/admin/stock-entry", label: "Stock Entry", icon: PackagePlus },
  { to: "/admin/stock-details", label: "Stock Details", icon: PackageSearch },
  { to: "/admin/offline-add", label: "Add Offline Stock", icon: Store },
  { to: "/admin/offline-inventory", label: "Offline Inventory", icon: Store },
  { to: "/admin/complete-stock", label: "Complete Stock", icon: Boxes },
  { to: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { to: "/admin/reviews", label: "Reviews", icon: ClipboardList },
];

export default function Sidebar() {
  const navigate = useNavigate();

  // 🔹 Get profile safely
  const storedProfile = localStorage.getItem("profile");
  const profile = storedProfile ? JSON.parse(storedProfile) : null;
  const email = profile?.email || "Admin";

  // 🔹 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    localStorage.removeItem("roles");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 py-6 shadow-xl flex flex-col">

      {/* BRAND */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center font-bold text-lg">
          🛒
        </div>
        <div>
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <p className="text-xs text-gray-400">E-Commerce</p>
        </div>
      </div>

      {/* ADMIN INFO */}
      <div className="bg-slate-700/40 rounded-lg p-3 mb-6">
        <p className="text-xs text-gray-400">Logged in as</p>
        <p className="text-sm font-semibold truncate">{email}</p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* LOGOUT BUTTON */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
