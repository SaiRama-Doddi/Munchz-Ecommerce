import {
  Instagram,
  MessageCircle,
  Phone,
  Youtube,
  Mail,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#022405] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">

        {/* ================= TOP SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <img
              src="/munchz.png"
              alt="Munchz"
              className="h-14 mb-4 cursor-pointer"
              onClick={() => navigate("/")}
            />

            <p className="text-sm text-white/80 leading-relaxed max-w-xs">
              Premium healthy snacks made with real ingredients,
              crafted for energy, balance, and everyday performance.
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>

            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-green-400" />
                <span>Hyderabad, Telangana, India</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={16} className="text-green-400" />
                <span>support@munchz.com</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={16} className="text-green-400" />
                <span>+91 9XXXXXXXXX</span>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li
                className="cursor-pointer hover:text-green-400 transition"
                onClick={() => navigate("/about")}
              >
                About Us
              </li>
              <li className="cursor-pointer hover:text-green-400 transition">
                Help & Support
              </li>
              <li className="cursor-pointer hover:text-green-400 transition">
                Shipping & Delivery
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="cursor-pointer hover:text-green-400 transition">
                Privacy Policy
              </li>
              <li className="cursor-pointer hover:text-green-400 transition">
                Terms & Conditions
              </li>
              <li className="cursor-pointer hover:text-green-400 transition">
                Refund Policy
              </li>
            </ul>
          </div>
        </div>

        {/* ================= DIVIDER ================= */}
        <div className="border-t border-white/10 mt-14 pt-8">

          {/* SOCIAL + COPYRIGHT */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* SOCIAL ICONS */}
            <div className="flex gap-5">
              <Instagram className="cursor-pointer hover:text-green-400 transition" />
              <MessageCircle className="cursor-pointer hover:text-green-400 transition" />
              <Phone className="cursor-pointer hover:text-green-400 transition" />
              <Youtube className="cursor-pointer hover:text-green-400 transition" />
            </div>

            {/* COPYRIGHT */}
            <p className="text-xs text-white/60 text-center md:text-right">
              © {new Date().getFullYear()} Munchz. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
