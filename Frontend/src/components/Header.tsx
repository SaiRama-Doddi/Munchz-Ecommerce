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
  Layers,
  BookOpen,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../hooks/usePermissions";
import { useCart } from "../state/CartContext";
import { useState } from "react";
import { getProductUrl } from "../utils/slugify";
import ProfileDashboard from "./ProfileDashboard";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { blogs } from "../data/blogData";


import { useQuery } from "@tanstack/react-query";
import api from "../api/client";




export default function Header() {
  const { profile } = useAuth();
  const { isAdmin, isSubAdmin } = usePermissions();
  const { items } = useCart();
  const cartCount = items.length;

  const [openProfile, setOpenProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [showBlogDropdown, setShowBlogDropdown] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
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

      <header className="sticky top-0 z-50 w-full bg-[#ecfdf5]/95 backdrop-blur-md border-b border-green-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">

          {/* LEFT */}

          <div className="flex items-center gap-3">

            <button
              onClick={() => setOpenMenu(true)}
              className="md:hidden p-2 rounded-lg hover:bg-white transition cursor-pointer"
            >
              <Menu size={26} />
            </button>

            <Link to="/" className="flex items-center cursor-pointer">
              <img
                src="https://res.cloudinary.com/dd4oiwnep/image/upload/v1774178657/gomunchz_logo_transparent_r8r0a8.png"
                alt="GoMunchz"
                className="h-14 md:h-16 lg:h-18 w-auto object-contain cursor-pointer"
              />
            </Link>

          </div>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <NavLink to="/" className={({ isActive }) => isActive ? "text-green-700 border-b-2 border-green-700 pb-1" : "text-gray-800 hover:text-green-700"}>Home</NavLink>
            <NavLink to="/Aboutmain" className={({ isActive }) => isActive ? "text-green-700 border-b-2 border-green-700 pb-1" : "text-gray-800 hover:text-green-700"}>About Us</NavLink>
            <NavLink to="/productpage" className={({ isActive }) => isActive ? "text-green-700 border-b-2 border-green-700 pb-1" : "text-gray-800 hover:text-green-700"}>Shop</NavLink>

            {/* Blog Dropdown */}
            <div 
              className="relative group py-4 h-full flex items-center"
              onMouseEnter={() => setShowBlogDropdown(true)}
              onMouseLeave={() => setShowBlogDropdown(false)}
            >
              <div className="flex items-center gap-1 cursor-pointer text-gray-800 hover:text-green-700 transition-colors">
                <span>Blog</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${showBlogDropdown ? "rotate-180" : ""}`} />
              </div>

              {showBlogDropdown && (
                <div className="absolute top-full left-0 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="px-4 mb-2 pb-2 border-b border-gray-50">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Our Latest Stories</p>
                  </div>
                  {blogs.map((blog) => (
                    <Link
                      key={blog.id}
                      to={`/blog/${blog.slug}`}
                      className="block px-4 py-3 hover:bg-green-50 transition-colors group/item"
                      onClick={() => setShowBlogDropdown(false)}
                    >
                      <p className="text-sm font-semibold text-gray-800 group-hover/item:text-green-700 leading-tight">
                        {blog.title}
                      </p>
                    </Link>
                  ))}
                  <Link 
                    to="/blog" 
                    className="mt-2 mx-4 py-2 text-center block bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition"
                    onClick={() => setShowBlogDropdown(false)}
                  >
                    View All Blogs
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/track" className={({ isActive }) => isActive ? "text-green-700 border-b-2 border-green-700 pb-1" : "text-gray-800 hover:text-green-700"}>Track</NavLink>
            <NavLink to="/gifting" className={({ isActive }) => isActive ? "text-green-700 border-b-2 border-green-700 pb-1" : "text-gray-800 hover:text-green-700"}>Gifting</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "text-green-700 border-b-2 border-green-700 pb-1" : "text-gray-800 hover:text-green-700"}>Contact Us</NavLink>
          </nav>


          {/* DESKTOP SEARCH (Large screens only) */}

          < div className="hidden lg:flex flex-1 mx-4 max-w-[300px] relative cursor-pointer" >

            <div className="flex items-center w-full bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm cursor-text">

              <Search size={18} className="text-gray-500 cursor-pointer" />

              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search products..."
                className="bg-transparent outline-none px-3 w-full text-sm"
              />

            </div>


            {
              searchTerm.length > 1 && suggestions.length > 0 && (

                <div className="absolute top-full mt-2 w-full bg-white shadow-xl rounded-xl border z-50 overflow-hidden">

                  {suggestions.map((p: any) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        navigate(getProductUrl(p.id, p.name));
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
                        <p className="text-xs text-gray-500">{p.categoryName}</p>
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

              )
            }

          </div >


          {/* RIGHT ICONS */}

          < div className="flex items-center gap-5 text-gray-700" >

            {profile && (
              <NavLink to="/user-orders">
                {({ isActive }) => (
                  <ShoppingBag
                    size={22}
                    className={isActive ? "text-green-700" : "text-gray-700"}
                  />
                )}
              </NavLink>
            )
            }


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


            {
              profile ? (
                <div className="flex items-center gap-4">
                  {(isAdmin || isSubAdmin) && (
                    <Link 
                      to="/admin/dashboard" 
                      className="hidden sm:block text-xs font-bold bg-green-600 text-white px-3 py-1.5 rounded-full hover:bg-green-700 transition shadow-sm"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => setOpenProfile(true)}
                    className="text-sm font-medium text-gray-700 hover:text-green-700 transition cursor-pointer"
                  >
                    Hi, {profile.firstName}
                  </button>
                </div>
              ) : (
                <NavLink to="/login">
                  {({ isActive }) => (
                    <User
                      size={22}
                      className={isActive ? "text-green-700" : "text-gray-700"}
                    />
                  )}
                </NavLink>
              )
            }

          </div >

        </div >

      </header >


      {/* ================= MOBILE + TABLET SEARCH ================= */}

      < div className="lg:hidden px-4 py-3 bg-white  relative" >

        <div className="relative">

          <div className="flex items-center bg-white  border-gray-200 rounded-full px-4 py-2 shadow-sm">

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

            <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-xl border z-50 overflow-hidden">

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
                    <p className="text-xs text-gray-500">{p.categoryName}</p>
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

      </div >


      {/* ================= SIDEBAR ================= */}

      {
        openMenu && (

          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">

            <div className="bg-white w-[280px] h-full p-6 shadow-2xl">

              <div className="flex justify-between items-center mb-10">

                <Link to="/" onClick={() => setOpenMenu(false)} className="flex items-center">
                  <img
                    src="https://res.cloudinary.com/dd4oiwnep/image/upload/v1774171195/gomunchz_logo_resized_ynw790.png"
                    alt="GoMunchz"
                    className="h-20 w-auto object-contain"
                  />
                </Link>

                <button
                  onClick={() => {
                    setOpenMenu(false);
                    setMobileBlogOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-white"
                >
                  <X size={22} />
                </button>

              </div>

              <nav className="flex flex-col gap-7 text-gray-800 font-medium text-sm h-[calc(100%-80px)] overflow-y-auto">

                {!mobileBlogOpen ? (
                  <>
                    <Link to="/" onClick={() => setOpenMenu(false)} className="flex items-center gap-3 hover:text-green-700 transition-colors">
                      <Home size={20} /> Home
                    </Link>

                    <Link to="/Aboutmain" onClick={() => setOpenMenu(false)} className="flex items-center gap-3 hover:text-green-700 transition-colors">
                      <Info size={20} /> About Us
                    </Link>

                    <Link to="/productpage" onClick={() => setOpenMenu(false)} className="flex items-center gap-3 hover:text-green-700 transition-colors">
                      <Grid2x2 size={20} /> Shop
                    </Link>

                    <button 
                      onClick={() => setMobileBlogOpen(true)}
                      className="flex items-center justify-between w-full hover:text-green-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen size={20} /> Blog
                      </div>
                      <ChevronDown size={18} className="-rotate-90" />
                    </button>

                    <Link to="/track" onClick={() => setOpenMenu(false)} className="flex items-center gap-3 hover:text-green-700 transition-colors">
                      <MapPin size={20} /> Track
                    </Link>

                    <Link to="/gifting" onClick={() => setOpenMenu(false)} className="flex items-center gap-3 hover:text-green-700 transition-colors">
                      <ShoppingBag size={20} /> Gifting
                    </Link>

                    <Link to="/contact" onClick={() => setOpenMenu(false)} className="flex items-center gap-3 hover:text-green-700 transition-colors">
                      <Phone size={20} /> Contact Us
                    </Link>

                    <Link to="/cart" onClick={() => setOpenMenu(false)} className="flex items-center gap-3 hover:text-green-700 transition-colors">
                      <ShoppingCart size={20} /> Cart ({cartCount})
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-300">
                    <button 
                      onClick={() => setMobileBlogOpen(false)}
                      className="flex items-center gap-2 text-green-700 font-bold mb-2 group"
                    >
                      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                      <span>Back to Menu</span>
                    </button>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2 mb-4">Our Latest Stories</p>
                      
                      {blogs.map((blog) => (
                        <Link
                          key={blog.id}
                          to={`/blog/${blog.slug}`}
                          onClick={() => {
                            setOpenMenu(false);
                            setMobileBlogOpen(false);
                          }}
                          className="flex items-start gap-3 py-3 px-2 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-700 transition-all text-sm leading-snug font-semibold"
                        >
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                          {blog.title}
                        </Link>
                      ))}

                      <Link
                        to="/blog"
                        onClick={() => {
                          setOpenMenu(false);
                          setMobileBlogOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 mt-6 py-3 bg-green-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition"
                      >
                        View All Articles
                      </Link>
                    </div>
                  </div>
                )}

              </nav>

            </div>

          </div>

        )
      }


      <ProfileDashboard open={openProfile} onClose={() => setOpenProfile(false)} />


      {/* ================= MOBILE BOTTOM BAR ================= */}

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">

        <div className="flex justify-around items-center h-[64px]">

          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center text-[11px] ${isActive ? "text-green-700 font-semibold" : "text-gray-600"}`}>
            <Home size={22} />
            Home
          </NavLink>

          <NavLink to="/productpage" className={({ isActive }) => `flex flex-col items-center text-[11px] ${isActive ? "text-green-700 font-semibold" : "text-gray-600"}`}>
            <Grid2x2 size={22} />
            Shop
          </NavLink>

          <NavLink to="/cart" className={({ isActive }) => `relative flex flex-col items-center text-[11px] ${isActive ? "text-green-700 font-semibold" : "text-gray-600"}`}>
            <ShoppingCart size={22} />
            Cart

            {cartCount > 0 && (
              <span className="absolute -top-1 right-3 bg-red-500 text-white text-[9px] px-1 rounded-full">
                {cartCount}
              </span>
            )}

          </NavLink>

          {profile && (
            <NavLink to="/user-orders" className={({ isActive }) => `flex flex-col items-center text-[11px] ${isActive ? "text-green-700 font-semibold" : "text-gray-600"}`}>
              <ShoppingBag size={22} />
              Orders
            </NavLink>
          )}

          {profile ? (
            <button onClick={() => setOpenProfile(true)} className="flex flex-col items-center text-[11px] text-gray-600">
              <User size={22} />
              Profile
            </button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `flex flex-col items-center text-[11px] ${isActive ? "text-green-700 font-semibold" : "text-gray-600"}`}>
              <User size={22} />
              Login
            </NavLink>
          )}

        </div>

      </div>

    </>
  );
}
