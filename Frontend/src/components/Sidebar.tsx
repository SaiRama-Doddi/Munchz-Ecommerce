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
  ChevronRight,
} from "lucide-react";

const items = [
  { to: "/", label: "Store Front", icon: Home },
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { 
    label: "Inventory", 
    type: "header" 
  },
  { to: "/admin/category", label: "Categories", icon: Layers },
  { to: "/admin/sub-category", label: "Subcategories", icon: Layers },
  { to: "/admin/products", label: "Products", icon: ShoppingBag },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { 
    label: "Stock Management", 
    type: "header" 
  },
  { to: "/admin/addstock", label: "Add Stock", icon: PackagePlus },
  { to: "/admin/inventory", label: "Stock List", icon: Warehouse },
  { to: "/admin/stock-entry", label: "Stock Entry", icon: PackagePlus },
  { to: "/admin/stock-details", label: "Stock Details", icon: PackageSearch },
  { to: "/admin/offline-add", label: "Add Offline Stock", icon: Store },
  { to: "/admin/offline-inventory", label: "Offline Inventory", icon: Store },
  { to: "/admin/complete-stock", label: "Complete Stock", icon: Boxes },
  { 
    label: "Marketing & Reviews", 
    type: "header" 
  },
  { to: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { to: "/admin/reviews", label: "Reviews", icon: ClipboardList },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const storedProfile = localStorage.getItem("profile");
  const profile = storedProfile ? JSON.parse(storedProfile) : null;
  const email = profile?.email || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    localStorage.removeItem("roles");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen sidebar-glass text-slate-300 px-6 py-8 shadow-2xl flex flex-col z-50">
      
      {/* BRAND */}
      <div className="flex items-center gap-4 mb-10 px-2 group cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
        <div className="w-12 h-12 bg-accent-gradient rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
          <ShoppingBag className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Munchz</h1>
          <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold">Premium Admin</p>
        </div>
      </div>

      {/* SEARCH / QUICK NAV (OPTIONAL UI POLISH) */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <PackageSearch size={14} className="text-slate-500" />
        </div>
        <input 
          type="text" 
          placeholder="Quick search..." 
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
        {items.map((item, idx) => {
          if (item.type === "header") {
            return (
              <p key={`header-${idx}`} className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-6 mb-2 px-4">
                {item.label}
              </p>
            );
          }

          const Icon = item.icon!;
          return (
            <NavLink
              key={item.to}
              to={item.to!}
              className={({ isActive }) =>
                `group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
                    : "hover:bg-slate-800/50 hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="transition-colors duration-300 group-hover:text-emerald-400" />
                <span>{item.label}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER / USER INFO */}
      <div className="mt-8 pt-6 border-t border-slate-800/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 border border-slate-700">
            {email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{profile?.firstName || "Admin"}</p>
            <p className="text-xs text-slate-500 truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/20"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
