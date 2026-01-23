import {
  ShoppingCart,
  User,
  Search,
  X,
  ShoppingBag,
  Menu,
  Home,
} from "lucide-react";
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
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={26} />
          </button>

          {/* Logo */}
          <Link to="/">
            <img src="/munchz.png" className="h-10 md:h-12 cursor-pointer" />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-8 text-gray-900 text-md">
            <Link to="/">Home</Link>
            <Link to="/productpage">Shop</Link>
            <Link to="/Aboutmain">About</Link>
            <Link to="/track">Track</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-5">

            {/* Search */}
            {!showSearch ? (
              <button onClick={() => setShowSearch(true)}>
                <Search size={22} />
              </button>
            ) : (
              <div className="flex items-center gap-2 border rounded-full px-3 py-1 bg-white shadow-sm">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="outline-none text-sm w-32 md:w-40"
                  autoFocus
                />
                <button onClick={() => setShowSearch(false)}>
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Orders Icon */}
            {profile && (
              <Link to="/user-orders" title="My Orders">
                <ShoppingBag size={24} />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart size={26} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            {profile ? (
              <span
                onClick={() => setOpenProfile(true)}
                className="cursor-pointer font-medium hidden md:block"
              >
                Hi, {profile.firstName}
              </span>
            ) : (
              <Link to="/login" className="hidden md:block">
                <User />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE SIDE MENU */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-black/40 z-50">
          <div className="w-64 bg-white h-full p-6 shadow-lg">
            <div className="flex justify-end">
              <button onClick={() => setMobileMenu(false)}>
                <X />
              </button>
            </div>

            <nav className="flex flex-col gap-6 mt-6 text-lg">
              <Link to="/" onClick={() => setMobileMenu(false)}>Home</Link>
              <Link to="/productpage" onClick={() => setMobileMenu(false)}>Shop</Link>
              <Link to="/Aboutmain" onClick={() => setMobileMenu(false)}>About</Link>
              <Link to="/track" onClick={() => setMobileMenu(false)}>Track</Link>
              <Link to="/contact" onClick={() => setMobileMenu(false)}>Contact</Link>
            </nav>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM ICON BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t md:hidden z-50">
        <div className="flex justify-around items-center py-2">

          <Link to="/" className="flex flex-col items-center text-xs">
            <Home size={22} />
            Home
          </Link>

          <Link to="/productpage" className="flex flex-col items-center text-xs">
            <ShoppingBag size={22} />
            Shop
          </Link>

          <button
            onClick={() => setShowSearch(true)}
            className="flex flex-col items-center text-xs"
          >
            <Search size={22} />
            Search
          </button>

          <Link to="/cart" className="relative flex flex-col items-center text-xs">
            <ShoppingCart size={22} />
            Cart
            {cartCount > 0 && (
              <span className="absolute top-0 right-2 bg-red-500 text-white text-[10px] rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {profile ? (
            <button
              onClick={() => setOpenProfile(true)}
              className="flex flex-col items-center text-xs"
            >
              <User size={22} />
              Profile
            </button>
          ) : (
            <Link to="/login" className="flex flex-col items-center text-xs">
              <User size={22} />
              Login
            </Link>
          )}
        </div>
      </div>

      <ProfileDashboard
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
    </>
  );
}
