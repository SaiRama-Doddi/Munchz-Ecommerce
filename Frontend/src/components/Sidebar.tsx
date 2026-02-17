import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Layers,
  ShoppingBag,
  ClipboardList,
  Warehouse,
  History,
  TicketPercent,
  PackagePlus,
  PackageSearch,
  Store,
  Home,
} from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/category", label: "Categories", icon: Layers },
  { to: "/sub-category", label: "Subcategories", icon: Layers },
  { to: "/admin/products", label: "Products", icon: ShoppingBag },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/addstock", label: "Add Stock", icon: PackagePlus },
  { to: "/inventory", label: "Stock List", icon: Warehouse },
  { to: "/Stockhistory", label: "Stock History", icon: History },
  { to: "/adminStockEntry", label: "Stock Entry", icon: PackagePlus },
  { to: "/adminStockDetails", label: "Stock Details", icon: PackageSearch },
  { to: "/offline-inventorys/add", label: "Add Offline Stock", icon: Store },
  { to: "/offline-inventory", label: "Offline Inventory", icon: Store },
  { to: "/AdminCompleteStock", label: "Complete Stock", icon: Boxes },
  { to: "/admincoupons", label: "Coupons", icon: TicketPercent },
  { to: "/adminreviews", label: "Reviews", icon: ClipboardList },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 py-6 shadow-xl overflow-y-auto">

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

      {/* NAV */}
      <nav className="flex flex-col gap-1">
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
    </aside>
  );
}