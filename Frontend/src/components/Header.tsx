import {
  ShoppingCart,
  User,
  Search,
  ShoppingBag,
  Home,
  Grid2x2,
  Menu,
  Info,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../state/CartContext";
import { useState } from "react";
import ProfileDashboard from "./ProfileDashboard";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";


import { useQuery } from "@tanstack/react-query";
import api from "../api/client";




export default function Header() {
  const { profile } = useAuth();
  const { items } = useCart();
  const cartCount = items.length;

  const [openProfile, setOpenProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
const navigate = useNavigate();

const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter" && searchTerm.trim()) {
    navigate(`/search?keyword=${searchTerm}`);
  }
};



const { data: suggestions = [] } = useQuery({
  queryKey: ["search-suggestions", searchTerm],
  enabled: searchTerm.length > 1,
  queryFn: async () => {
    const res = await api.get(`/products/search?keyword=${searchTerm}`);
    return res.data.slice(0, 5); // limit 5 results
  },
});

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-[70px] flex items-center justify-between">

          {/* LEFT: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button onClick={() => setOpenMenu(true)} className="md:hidden">
              <Menu size={26} />
            </button>

            <Link to="/">
              <img src="/munchz.png" className="h-11" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
  {[
    { to: "/", label: "Home" },
    { to: "/productpage", label: "Shop" },
    { to: "/Aboutmain", label: "About" },
    { to: "/track", label: "Track" },
    { to: "/contact", label: "Contact" },
  ].map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      className={({ isActive }) =>
        isActive
          ? "text-green-700 border-b-2 border-green-700 pb-1"
          : "text-gray-800"
      }
    >
      {item.label}
    </NavLink>
  ))}
</nav>


          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 mx-10 max-w-md relative">
  <div className="flex items-center w-full bg-gray-50 border rounded-full px-4 py-2">
    <Search size={18} className="text-gray-500" />
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleSearch}
      placeholder="Search products..."
      className="bg-transparent outline-none px-3 w-full text-sm"
    />
  </div>

  {/* Suggestions Dropdown */}
  {searchTerm.length > 1 && suggestions.length > 0 && (
    <div className="absolute top-full mt-2 w-full bg-white shadow-xl rounded-xl border z-50 overflow-hidden">
      {suggestions.map((p: any) => (
        <div
          key={p.id}
          onClick={() => {
            navigate(`/product/${p.id}`);
            setSearchTerm("");
          }}
          className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 cursor-pointer transition"
        >
          <img
            src={p.imageUrl}
            className="w-10 h-10 object-contain rounded"
          />
          <div>
            <p className="text-sm font-medium">{p.name}</p>
            <p className="text-xs text-gray-500">
              {p.categoryName}
            </p>
          </div>
        </div>
      ))}

      <div
        onClick={() => {
          navigate(`/search?keyword=${searchTerm}`);
          setSearchTerm("");
        }}
        className="px-4 py-3 text-sm text-green-700 hover:bg-green-100 cursor-pointer"
      >
        View all results →
      </div>
    </div>
  )}
</div>


          {/* Right Icons */}
          <div className="flex items-center gap-6 text-gray-700">
           {profile && (
  <NavLink to="/user-orders" title="Orders">
    {({ isActive }) => (
      <ShoppingBag
        size={22}
        className={isActive ? "text-green-700" : "text-gray-700"}
      />
    )}
  </NavLink>
)}

           <NavLink to="/cart" className="relative">
  {({ isActive }) => (
    <>
      <ShoppingCart
        size={24}
        className={isActive ? "text-green-700" : "text-gray-700"}
      />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
          {cartCount}
        </span>
      )}
    </>
  )}
</NavLink>


            {profile ? (
  <button
    onClick={() => setOpenProfile(true)}
    className="text-sm font-medium text-gray-700 cursor-pointer"
  >
    Hi, {profile.firstName}
  </button>
) : (
  <NavLink to="/login">
    {({ isActive }) => (
      <User
        size={22}
        className={isActive ? "text-green-700" : "text-gray-700"}
      />
    )}
  </NavLink>
)}

          </div>
        </div>
      </header>

      {/* ================= MOBILE SEARCH ================= */}
      <div className="md:hidden px-4 py-3 bg-white border-b relative">
  <div className="flex items-center bg-gray-50 border rounded-full px-4 py-2">
    <Search size={18} className="text-gray-500" />
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleSearch}
      placeholder="Search products..."
      className="bg-transparent outline-none px-3 w-full text-sm"
    />
  </div>

  {searchTerm.length > 1 && suggestions.length > 0 && (
    <div className="absolute left-4 right-4 mt-2 bg-white shadow-xl rounded-xl border z-50 overflow-hidden">
      {suggestions.map((p: any) => (
        <div
          key={p.id}
          onClick={() => {
            navigate(`/product/${p.id}`);
            setSearchTerm("");
          }}
          className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 cursor-pointer"
        >
          <img
            src={p.imageUrl}
            className="w-10 h-10 object-contain rounded"
          />
          <div>
            <p className="text-sm font-medium">{p.name}</p>
            <p className="text-xs text-gray-500">
              {p.categoryName}
            </p>
          </div>
        </div>
      ))}

      <div
        onClick={() => {
          navigate(`/search?keyword=${searchTerm}`);
          setSearchTerm("");
        }}
        className="px-4 py-3 text-sm text-green-700 hover:bg-green-100 cursor-pointer"
      >
        View all results →
      </div>
    </div>
  )}
</div>


      {/* ================= LEFT SIDEBAR MENU ================= */}
      {openMenu && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="bg-white w-72 h-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setOpenMenu(false)}>
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-gray-800 font-medium">

              <Link to="/" onClick={() => setOpenMenu(false)} className="flex items-center gap-3">
                <Home size={20} /> Home
              </Link>

              <Link to="/productpage" onClick={() => setOpenMenu(false)} className="flex items-center gap-3">
                <Grid2x2 size={20} /> Shop
              </Link>

              <Link to="/Aboutmain" onClick={() => setOpenMenu(false)} className="flex items-center gap-3">
                <Info size={20} /> About
              </Link>

              <Link to="/track" onClick={() => setOpenMenu(false)} className="flex items-center gap-3">
                <MapPin size={20} /> Track
              </Link>

              <Link to="/contact" onClick={() => setOpenMenu(false)} className="flex items-center gap-3">
                <Phone size={20} /> Contact
              </Link>

              <Link to="/cart" onClick={() => setOpenMenu(false)} className="flex items-center gap-3">
                <ShoppingCart size={20} /> Cart ({cartCount})
              </Link>
            </nav>
          </div>
        </div>
      )}

      <ProfileDashboard open={openProfile} onClose={() => setOpenProfile(false)} />

        {/* ================= MOBILE BOTTOM BAR ================= */}
<div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] z-40">
  <div className="flex justify-around items-center h-[64px]">

    <NavLink
      to="/"
      className={({ isActive }) =>
        `flex flex-col items-center text-[11px] gap-1 ${
          isActive ? "text-green-700 font-semibold" : "text-gray-700"
        }`
      }
    >
      <Home size={22} />
      Home
    </NavLink>

    <NavLink
      to="/productpage"
      className={({ isActive }) =>
        `flex flex-col items-center text-[11px] gap-1 ${
          isActive ? "text-green-700 font-semibold" : "text-gray-700"
        }`
      }
    >
      <Grid2x2 size={22} />
      Shop
    </NavLink>

    <NavLink
      to="/cart"
      className={({ isActive }) =>
        `relative flex flex-col items-center text-[11px] gap-1 ${
          isActive ? "text-green-700 font-semibold" : "text-gray-700"
        }`
      }
    >
      <ShoppingCart size={22} />
      Cart
      {cartCount > 0 && (
        <span className="absolute top-0 right-3 bg-red-500 text-white text-[9px] px-1 rounded-full">
          {cartCount}
        </span>
      )}
    </NavLink>

    {profile && (
      <NavLink
        to="/user-orders"
        className={({ isActive }) =>
          `flex flex-col items-center text-[11px] gap-1 ${
            isActive ? "text-green-700 font-semibold" : "text-gray-700"
          }`
        }
      >
        <ShoppingBag size={22} />
        Orders
      </NavLink>
    )}

    {profile ? (
      <button
        onClick={() => setOpenProfile(true)}
        className="flex flex-col items-center text-[11px] gap-1 text-gray-700 cursor-pointer"
      >
        <User size={22} />
        Profile
      </button>
    ) : (
      <NavLink
        to="/login"
        className={({ isActive }) =>
          `flex flex-col items-center text-[11px] gap-1 ${
            isActive ? "text-green-700 font-semibold" : "text-gray-700"
          }`
        }
      >
        <User size={22} />
        Login
      </NavLink>
    )}
  </div>
</div>


    </>
  );
}