import { ShoppingCart, User, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ProfileDashboard from "./ProfileDashboard";

export default function Header() {
  const { profile } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <>
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo */}
          <img src="/munchz.png" className="h-12" />

          {/* Menu */}
          <nav className="hidden md:flex gap-8 text-gray-700">
            <a href="/">Home</a>
            <a href="#">Shop</a>
            <a href="#">About</a>
            <a href="#">Track</a>
            <a href="#">Contact</a>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4">
            <ShoppingCart />

            {profile ? (
              <span
                onClick={() => setOpenProfile(true)}
                className="cursor-pointer font-medium"
              >
                Hi, {profile.firstName}
              </span>
            ) : (
              <a href="/login">
                <User />
              </a>
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
