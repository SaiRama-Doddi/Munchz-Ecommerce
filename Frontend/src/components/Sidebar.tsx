import { useState } from "react";
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
  ChevronRight,
  CreditCard,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: boolean | (() => void);
}

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
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
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

export default function Sidebar({ isOpen = true, onClose = () => {} }: SidebarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const filteredItems = items.reduce((acc: any[], item, index) => {
    if (item.type === "header") {
      // Find following items until next header or end
      const nextItems = [];
      for (let i = index + 1; i < items.length; i++) {
        if (items[i].type === "header") break;
        if (items[i].label.toLowerCase().includes(searchQuery.toLowerCase())) {
          nextItems.push(items[i]);
        }
      }
      
      if (nextItems.length > 0) {
        acc.push(item);
      }
    } else {
      const isHeaderPrev = index > 0 && items[index - 1].type === "header";
      if (!isHeaderPrev && item.label.toLowerCase().includes(searchQuery.toLowerCase())) {
        acc.push(item);
      }
      // If it has a header, it was already handled or skipped by the header check
      if (isHeaderPrev && item.label.toLowerCase().includes(searchQuery.toLowerCase())) {
        acc.push(item);
      }
    }
    return acc;
  }, []);

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />

      <aside className={`fixed left-0 top-0 w-72 h-screen bg-emerald-600 text-white px-6 py-8 border-r border-emerald-500 shadow-xl flex flex-col z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-10 px-2 group">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { navigate("/admin/dashboard"); handleClose(); }}>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="text-emerald-600" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">GoMunchZ</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-100 font-black">Premium Admin</p>
            </div>
          </div>
          
          <button 
            onClick={handleClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <PackageSearch size={14} className="text-emerald-200" />
        </div>
        <input 
          type="text" 
          placeholder="Quick search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-emerald-500/50 border border-emerald-400/30 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:bg-emerald-500 transition-all placeholder:text-emerald-100 text-white"
        />
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
        {filteredItems.map((item, idx) => {
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
    </aside>
    </>
  );
}
