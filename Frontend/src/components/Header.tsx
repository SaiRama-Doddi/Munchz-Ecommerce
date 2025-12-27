import { ShoppingCart, User, Search, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../state/CartContext";
import { useState } from "react";
import ProfileDashboard from "./ProfileDashboard";
import { Link } from "react-router-dom";

export default function Header() {
  const { profile } = useAuth();
  const { items } = useCart();

  const cartCount = items.length;

  const [openProfile, setOpenProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/">
  <img src="/munchz.png" className="h-12 cursor-pointer" />
</Link>

          {/* Menu */}
          <nav className="hidden md:flex gap-8 text-gray-900 text-md">
            <Link to="/">Home</Link>
            <Link to="/productpage">Shop</Link>
            <Link to="/Aboutmain">About</Link>
            <Link to="/track">Track</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-5 relative">

            {/* 🔍 Search */}
            {!showSearch ? (
              <button onClick={() => setShowSearch(true)}>
                <Search size={22} />
              </button>
            ) : (
              <div className="flex items-center gap-2 border rounded-full px-3 py-1 bg-white shadow-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="outline-none text-sm w-40"
                  autoFocus
                />
                <button onClick={() => setShowSearch(false)}>
                  <X size={16} />
                </button>
              </div>
            )}

            {/* 🛒 Cart with Count */}
            <Link to="/cart" className="relative">
              <ShoppingCart size={26} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 👤 Profile / Login */}
            {profile ? (
              <span
                onClick={() => setOpenProfile(true)}
                className="cursor-pointer font-medium"
              >
                Hi, {profile.firstName}
              </span>
            ) : (
              <Link to="/login">
                <User />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Profile Sidebar */}
      <ProfileDashboard
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
    </>
  );
}
