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
    <footer className="bg-[#ecfdf5] text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* ================= TOP SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* BRAND */}
          <div className="flex flex-col items-start">
            <div className="mb-4">
              <img
                src="https://res.cloudinary.com/dd4oiwnep/image/upload/v1774178657/gomunchz_logo_transparent_r8r0a8.png"
                alt="GoMunchz"
                className="h-14 cursor-pointer object-contain"
                onClick={() => navigate("/")}
              />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed max-w-xs mb-6">
              Premium healthy snacks made with real ingredients,
              crafted for energy, balance, and everyday performance.
            </p>
            {/* FSSAI SECTION */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-md border border-green-100 shadow-sm w-full max-w-[280px]">
              <img
                src="https://res.cloudinary.com/dd4oiwnep/image/upload/v1774172170/unnamed_r2g1px.png"
                alt="FSSAI"
                className="h-10 object-contain"
              />
              <div className="text-[10px] leading-tight">
                <p className="font-semibold text-gray-400 uppercase tracking-wider">License Number:</p>
                <p className="font-bold text-gray-900 text-sm">13626026000066</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-black">Contact</h4>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-black shrink-0" />
                <span className="font-medium">
                  SRI VENKATESHWARA SUPER FOODS LLP<br />
                  H NO-16-317/678, SYMPHONY PARK HOMES,<br />
                  PATANCHERU, Sangareddy, Telangana-502319
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-black shrink-0" />
                <a href="mailto:Gomunchz@gmail.com" className="hover:text-green-700 transition">Gomunchz@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-black shrink-0" />
                <a href="tel:8688547851" className="hover:text-green-700 transition">8688547851</a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-black">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-700 font-medium">
              <li className="cursor-pointer hover:text-green-700 transition" onClick={() => navigate("/Aboutmain")}>About Us</li>
              <li className="cursor-pointer hover:text-green-600 transition">Help & Support</li>
              <li className="cursor-pointer hover:text-green-600 transition">Shipping & Delivery</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-black">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-700 font-medium">
              <li className="cursor-pointer hover:text-green-600 transition">Terms & Conditions</li>
              <li className="cursor-pointer hover:text-green-600 transition">Privacy Policy</li>
              <li className="cursor-pointer hover:text-green-600 transition">Return & Refund</li>
              <li className="cursor-pointer hover:text-green-600 transition">Refer & Earn</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-green-200/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* SOCIAL ICONS */}
            <div className="flex gap-6">
              <Instagram className="text-black cursor-pointer hover:scale-110 transition duration-300" />
              <MessageCircle className="text-black cursor-pointer hover:scale-110 transition duration-300" />
              <Phone className="text-black cursor-pointer hover:scale-110 transition duration-300" />
              <Youtube className="text-black cursor-pointer hover:scale-110 transition duration-300" />
            </div>

            {/* COPYRIGHTS */}
            <div className="text-center md:text-right">
              <p className="text-sm text-black font-medium">
                © 2026 GoMunchz. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
