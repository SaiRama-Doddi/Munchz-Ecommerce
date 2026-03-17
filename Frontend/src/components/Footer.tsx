import {
  Instagram,
  MessageCircle,
  Phone,
  Youtube,
  Mail,
  MapPin,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-black text-white pt-32 pb-16 relative overflow-hidden">
      {/* AMBIENT GLOW */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        
        {/* TOP SECTION: BRAND & STATEMENTS */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24">
           <div className="max-w-md">
              <img
                src="/munchz.png"
                alt="Munchz Premium"
                className="h-16 mb-10 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate("/")}
              />
              <p className="text-[15px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                Curating the world's most elite natural assets. We define the future of high-density nutritional experiences.
              </p>
           </div>
           
           <div className="flex flex-col items-end text-right">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck size={18} className="text-emerald-500" />
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Security & Quality Grid</p>
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-white/40">Authorized Digital Archive • v1.0.4</p>
           </div>
        </div>

        {/* NAVIGATION GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 border-t border-white/5 pt-20">
          
          {/* CONTACT ARCHIVE */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-8">Contact Archive</h4>
            <div className="space-y-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="flex items-start gap-4 group">
                <MapPin size={16} className="text-emerald-500 group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-white transition-colors">Hyderabad Central, TS, India</span>
              </div>
              <div className="flex items-center gap-4 group">
                <Mail size={16} className="text-emerald-500 group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-white transition-colors">support@gomunchz.com</span>
              </div>
              <div className="flex items-center gap-4 group">
                <Phone size={16} className="text-emerald-500 group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-white transition-colors">+91 9XXXXXXXXX</span>
              </div>
            </div>
          </div>

          {/* EXPLORATION */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-8">Exploration</h4>
            <ul className="space-y-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <li className="flex items-center gap-2 group cursor-pointer hover:text-white transition-all" onClick={() => navigate("/AboutMain")}>
                About the Portfolio <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
              <li className="flex items-center gap-2 group cursor-pointer hover:text-white transition-all">
                Intelligence Center <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
              <li className="flex items-center gap-2 group cursor-pointer hover:text-white transition-all">
                Logistics Policy <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
            </ul>
          </div>

          {/* LEGAL PROTOCOL */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-8">Legal Protocol</h4>
            <ul className="space-y-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <li className="cursor-pointer hover:text-white transition-all">Privacy Safeguards</li>
              <li className="cursor-pointer hover:text-white transition-all">Terms of Access</li>
              <li className="cursor-pointer hover:text-white transition-all">Reversal Protocol</li>
            </ul>
          </div>

          {/* SOCIAL GRID */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-8">Connect Grid</h4>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Instagram size={18}/>, label: "INSTA" },
                { icon: <Youtube size={18}/>, label: "TUBE" },
                { icon: <MessageCircle size={18}/>, label: "CHAT" }
              ].map((social, i) => (
                <button key={i} className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all duration-500 group">
                   {social.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div className="border-t border-white/5 mt-32 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Munchz Premium © {new Date().getFullYear()}</p>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Global Standards</p>
           </div>
           <div className="flex gap-10">
              <p className="text-[9px] font-black text-white/10 uppercase tracking-widest hover:text-white/40 cursor-help transition-colors">Data Encryption: Active</p>
              <p className="text-[9px] font-black text-white/10 uppercase tracking-widest hover:text-white/40 cursor-help transition-colors">Server Node: S-WEST-01</p>
           </div>
        </div>

      </div>
    </footer>
  );
}
