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
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../state/CartContext";
import { useState, useEffect } from "react";
import ProfileDashboard from "./ProfileDashboard";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

export default function Header() {
  const { profile } = useAuth();
  const { items } = useCart();
  const cartCount = items.length;
  const location = useLocation();
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(false);
  }, [location.pathname]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?keyword=${searchTerm}`);
      setSearchTerm("");
    }
  };

  const { data: suggestions = [] } = useQuery({
    queryKey: ["search-suggestions", searchTerm],
    enabled: searchTerm.length > 1,
    queryFn: async () => {
      const res = await api.get(`/products/search?keyword=${searchTerm}`);
      return res.data.slice(0, 5);
    },
  });

  return (
    <>
      <header className={`sticky top-0 z-[60] transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-2xl shadow-xl shadow-black/5 py-3' : 'bg-white border-b border-gray-50 py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          
          {/* LOGO SECTION */}
          <div className="flex items-center gap-6">
            <button onClick={() => setOpenMenu(true)} className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-900 active:scale-95 transition-all">
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center group">
              <img
                src="https://res.cloudinary.com/dd4oiwnep/image/upload/v1772772656/Gomunchzlogo_cvt4dt.jpg"
                alt="Munchz Premium"
                className="h-10 md:h-12 w-auto object-contain brightness-105 group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { to: "/", label: "Portfolio" },
              { to: "/productpage", label: "Archive" },
              { to: "/Aboutmain", label: "Heritage" },
              { to: "/track", label: "Logistics" },
              { to: "/contact", label: "Concierge" },
            ].map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `relative text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${isActive ? "text-emerald-600" : "text-gray-400 hover:text-gray-900"} group`}>
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-emerald-600 transition-all duration-500 group-hover:w-full"></span>
              </NavLink>
            ))}
          </nav>

          {/* SEARCH & ACTIONS */}
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden xl:block relative w-64 group">
              <div className="flex items-center bg-gray-50 border border-gray-50 rounded-2xl px-5 py-3 transition-all duration-500 group-focus-within:bg-white group-focus-within:border-emerald-100 group-focus-within:shadow-2xl group-focus-within:shadow-emerald-900/5">
                <Search size={14} className="text-gray-300 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="ACQUIRE..."
                  className="bg-transparent outline-none px-4 w-full text-[10px] font-black text-gray-900 placeholder:text-gray-300 uppercase tracking-widest"
                />
              </div>
              {searchTerm.length > 1 && suggestions.length > 0 && (
                <div className="absolute top-full mt-4 w-full bg-white shadow-3xl shadow-black/10 rounded-[2rem] border border-gray-100 z-[70] overflow-hidden animate-fadeIn">
                  {suggestions.map((p: any) => (
                    <div key={p.id} onClick={() => { navigate(`/product/${p.id}`); setSearchTerm(""); }} className="flex items-center gap-4 px-6 py-4 hover:bg-emerald-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                      <img src={p.imageUrl} className="w-10 h-10 object-contain rounded-lg bg-gray-50" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 line-clamp-1">{p.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {profile && (
                <NavLink to="/user-orders" className={({ isActive }) => `w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-gray-50 text-gray-400 hover:bg-white hover:shadow-sm hover:text-emerald-600'}`}>
                  <ShoppingBag size={20} />
                </NavLink>
              )}
              <NavLink to="/cart" className={({ isActive }) => `relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-gray-50 text-gray-400 hover:bg-white hover:shadow-sm hover:text-emerald-600'}`}>
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse">{cartCount}</span>}
              </NavLink>

              {profile ? (
                <button onClick={() => setOpenProfile(true)} className="flex items-center gap-4 pl-2 pr-6 py-2 bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-500 rounded-[2rem] border border-transparent hover:border-emerald-100 group">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-[12px] font-black text-white shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                    {profile.firstName.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">{profile.firstName}</span>
                </button>
              ) : (
                <NavLink to="/login" className="flex items-center gap-3 px-8 py-3.5 bg-black text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all duration-500 shadow-2xl shadow-black/10 active:scale-95 group">
                  <User size={16} className="group-hover:text-emerald-400 transition-colors" />
                  <span className="hidden md:inline">Account</span>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE FULLSCREEN MENU */}
      {openMenu && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl animate-fadeIn">
          <div className="bg-white w-full h-[90vh] rounded-b-[4rem] p-8 shadow-2xl flex flex-col animate-slideDown">
            <div className="flex justify-between items-center mb-16 px-4">
              <img src="https://res.cloudinary.com/dd4oiwnep/image/upload/v1772772656/Gomunchzlogo_cvt4dt.jpg" className="h-10 w-auto object-contain" />
              <button onClick={() => setOpenMenu(false)} className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 active:scale-90 transition-all"><X size={26}/></button>
            </div>
            <nav className="flex flex-col gap-10 px-4">
              {[
                { to: "/", label: "Portfolio Archive", icon: <Home size={20}/> },
                { to: "/productpage", label: "Signature Goods", icon: <Grid2x2 size={20}/> },
                { to: "/Aboutmain", label: "Heritage Story", icon: <Info size={20}/> },
                { to: "/track", label: "Logistics Grid", icon: <MapPin size={20}/> },
                { to: "/contact", label: "Elite Concierge", icon: <Phone size={20}/> }
              ].map((link, i) => (
                <Link key={i} to={link.to} onClick={() => setOpenMenu(false)} className="flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">{link.icon}</div>
                    <span className="text-lg font-black uppercase tracking-tighter text-gray-900">{link.label}</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-200 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
                </Link>
              ))}
            </nav>
            <div className="mt-auto p-4 flex items-center justify-between bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white"><Sparkles size={24}/></div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-emerald-800">Premium Membership Active</p>
               </div>
               <ChevronRight size={18} className="text-emerald-400" />
            </div>
          </div>
        </div>
      )}

      <ProfileDashboard open={openProfile} onClose={() => setOpenProfile(false)} />

      {/* MOBILE BOTTOM NAV - REDESIGNED */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-2xl border-t border-gray-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-[60] py-4 px-6 rounded-t-[3rem]">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-2 transition-all ${isActive ? "text-emerald-600 scale-110" : "text-gray-300"}`}>
            <Home size={22} /><span className="text-[8px] font-black uppercase tracking-widest">Base</span>
          </NavLink>
          <NavLink to="/productpage" className={({ isActive }) => `flex flex-col items-center gap-2 transition-all ${isActive ? "text-emerald-600 scale-110" : "text-gray-300"}`}>
            <Grid2x2 size={22} /><span className="text-[8px] font-black uppercase tracking-widest">Archive</span>
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `relative flex flex-col items-center gap-2 transition-all ${isActive ? "text-emerald-600 scale-110" : "text-gray-300"}`}>
            <ShoppingCart size={22} /><span className="text-[8px] font-black uppercase tracking-widest">Inventory</span>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-[7px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">{cartCount}</span>}
          </NavLink>
          <button onClick={() => setOpenProfile(true)} className="flex flex-col items-center gap-2 text-gray-300 active:text-emerald-600">
            <User size={22} /><span className="text-[8px] font-black uppercase tracking-widest">Identity</span>
          </button>
        </div>
      </div>
    </>
  );
}
