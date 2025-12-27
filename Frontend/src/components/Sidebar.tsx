import { NavLink } from "react-router-dom";

const items = [
    { to: "/", label: "Home" },
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/category", label: "Categories" },
  { to: "/sub-category", label: "Subcategories" },
  { to: "/admin/products", label: "Admin Products" },
  { to: "/admin/orders", label: "Orders" },
    { to: "/addstock", label: "Add Stock" },
    { to: "/inventory", label: "Stock List" },
     { to: "/Stockhistory", label: "Stock History" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <div className="text-xl font-bold mb-6">Admin</div>

      <nav className="flex flex-col gap-2">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `p-2 rounded transition ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100"
              }`
            }
          >
            {i.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
