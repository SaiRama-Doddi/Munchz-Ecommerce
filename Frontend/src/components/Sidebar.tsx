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
    <aside className="fixed left-0 top-0 w-72 h-screen bg-emerald-600 text-white px-6 py-8 border-r border-emerald-500 shadow-xl flex flex-col z-50">
      
      <div className="flex items-center gap-4 mb-10 px-2 group cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-300">
          <ShoppingBag className="text-emerald-600" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">GoMunchZ</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-100 font-black">Premium Admin</p>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <PackageSearch size={14} className="text-emerald-200" />
        </div>
        <input 
          type="text" 
          placeholder="Quick search..." 
          className="w-full bg-emerald-500/50 border border-emerald-400/30 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:bg-emerald-500 transition-all placeholder:text-emerald-100 text-white"
        />
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
        {items.map((item, idx) => {
          if (item.type === "header") {
            return (
              <p key={`header-${idx}`} className="text-[10px] uppercase tracking-widest text-emerald-200/60 font-black mt-8 mb-3 px-4 italic">
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
                `group flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-white text-emerald-700 shadow-xl shadow-black/10 translate-x-1"
                    : "text-emerald-50 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="" />
                <span>{item.label}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER / USER INFO */}
      <div className="mt-8 pt-6 border-t border-emerald-500/30">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xs font-black text-emerald-600 shadow-lg">
            {email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white truncate">{profile?.firstName || "Admin"}</p>
            <p className="text-[10px] text-emerald-200 truncate font-black uppercase tracking-tighter">{email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-black text-white hover:bg-red-500 transition-all duration-300 border border-white/20"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
