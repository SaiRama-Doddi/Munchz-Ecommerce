
import { Instagram, MessageCircle, Phone, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#022405] text-white pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Separator line */}
        <div className="w-full border-t border-gray-400 mb-10"></div>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-10">

          {/* LEFT SECTION - LOGO */}
          <div className="flex items-start space-x-4">
            <img
              src="/munchz.png"
              alt="logo"
              className="w-30 h-20  "
            />

            <div>
            
        
            </div>
          </div>

          {/* CENTER LINKS */}
          <div className="flex flex-col space-y-2">
            <h4 className="font-semibold">Contact</h4>
            <p className="text-gray-300 text-sm">Address</p>
            <p className="text-gray-300 text-sm">mail id</p>
            <p className="text-gray-300 text-sm">Phone number</p>
          </div>

          {/* RIGHT LINKS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">About</h4>
              <p className="text-gray-300 text-sm">Help</p>
              <p className="text-gray-300 text-sm">Shipping</p>
            </div>

            <div>
              <h4 className="font-semibold">Info</h4>
              <p className="text-gray-300 text-sm">Contact us</p>
              <p className="text-gray-300 text-sm">Privacy Policies</p>
              <p className="text-gray-300 text-sm">Terms & Conditions</p>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="mt-10 flex space-x-6">
          <Instagram className="cursor-pointer hover:opacity-75" />
          <MessageCircle className="cursor-pointer hover:opacity-75" />
          <Phone className="cursor-pointer hover:opacity-75" />
          <Youtube className="cursor-pointer hover:opacity-75" />
        </div>

        {/* Bottom text */}
        <p className="text-gray-400 text-xs mt-10">
          ©Company name All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
