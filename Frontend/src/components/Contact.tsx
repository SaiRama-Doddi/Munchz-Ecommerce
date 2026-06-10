import { useState } from "react";
import { Phone, Mail, User, MessageSquare, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactForm() {
  const [orderType, setOrderType] = useState<"individual" | "bulk">("individual");
  const whatsappNumber = "8688547851";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp message
    const text = `*New Contact Inquiry (${orderType.toUpperCase()} ORDER)*\n\n` +
                 `*Name:* ${formData.firstName} ${formData.lastName}\n` +
                 `*Email:* ${formData.email}\n` +
                 `*Phone:* ${formData.phone || "Not provided"}\n` +
                 `*Message:* ${formData.message}`;
    
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodedText}`;
    
    // Redirect to WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-[#f9fdf7] flex flex-col font-sans">
      <main className="flex-grow max-w-7xl mx-auto px-4 py-3 md:py-5 w-full flex flex-col items-center">
        {/* MAIN CONTACT CARD */}
        <div className="max-w-6xl w-full bg-white shadow-[0_30px_70px_rgba(22,101,52,0.06)] overflow-hidden border border-green-100/30 flex flex-col md:flex-row md:h-[530px] rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 hover:shadow-[0_40px_80px_rgba(22,101,52,0.09)]">

          {/* LEFT IMAGE / INFO SECTION */}
          <div className="md:w-1/2 w-full relative h-[200px] md:h-full overflow-hidden bg-[#e4edd4] border-b md:border-b-0 md:border-r border-green-100/20 group">
            <img
              src="https://res.cloudinary.com/dxfdcmxze/image/upload/f_auto,q_auto,w_800/v1780999859/track_borad_xeyjtp.jpg"
              alt="Premium Healthy Snacks"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="md:w-1/2 w-full p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-center bg-gradient-to-br from-green-50/10 via-white to-amber-50/10 md:h-full overflow-hidden">
            <div className="max-w-md mx-auto w-full space-y-4">
              <div className="text-center md:text-left">
                <span className="text-[9px] font-bold text-green-600 tracking-widest uppercase block">Let's Connect</span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
                   Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Touch</span>
                </h2>
                <p className="text-[11px] text-gray-500 font-medium">Send us a message on WhatsApp!</p>
              </div>

              {/* ORDER TYPE SELECTOR */}
              <div className="flex bg-green-50/40 p-1 rounded-2xl gap-1 w-full sm:w-fit border border-green-100/20 shadow-inner">
                <button
                  type="button"
                  onClick={() => setOrderType("individual")}
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    orderType === "individual" 
                    ? "bg-white text-green-700 shadow-sm border border-gray-100" 
                    : "text-green-700/60 hover:text-green-800 hover:bg-white/30"
                  }`}
                >
                  Individual Orders
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("bulk")}
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    orderType === "bulk" 
                    ? "bg-white text-green-700 shadow-sm border border-gray-100" 
                    : "text-green-700/60 hover:text-green-800 hover:bg-white/30"
                  }`}
                >
                  Bulk Orders
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* NAME GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" size={14} />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200/80 bg-gray-50/20 focus:bg-white outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/5 transition-all duration-200 font-semibold text-gray-800 placeholder:text-gray-400 text-xs shadow-sm"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" size={14} />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200/80 bg-gray-50/20 focus:bg-white outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/5 transition-all duration-200 font-semibold text-gray-800 placeholder:text-gray-400 text-xs shadow-sm"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" size={14} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200/80 bg-gray-50/20 focus:bg-white outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/5 transition-all duration-200 font-semibold text-gray-800 placeholder:text-gray-400 text-xs shadow-sm"
                    required
                  />
                </div>

                {/* PHONE */}
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" size={14} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Mobile number (optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200/80 bg-gray-50/20 focus:bg-white outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/5 transition-all duration-200 font-semibold text-gray-800 placeholder:text-gray-400 text-xs shadow-sm"
                  />
                </div>

                {/* MESSAGE */}
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-3 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" size={14} />
                  <textarea
                    name="message"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleChange}
                    rows={2}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200/80 bg-gray-50/20 focus:bg-white outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/5 transition-all duration-200 font-semibold text-gray-800 placeholder:text-gray-400 resize-none text-xs shadow-sm"
                    required
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="group w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-10 py-3 rounded-2xl shadow-lg shadow-green-600/10 hover:shadow-xl hover:shadow-green-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 text-xs uppercase tracking-wider cursor-pointer"
                >
                  <FaWhatsapp size={18} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>SEND TO WHATSAPP</span>
                  <Send size={14} className="ml-1 opacity-60 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-1">
                   Response time: <span className="text-green-600">Within 30 minutes</span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
