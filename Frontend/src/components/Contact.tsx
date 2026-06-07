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
    <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-112px)] bg-[#f9fdf7] flex items-center justify-center px-4 py-8 md:py-12 lg:py-16">
      <div className="max-w-6xl w-full bg-white shadow-2xl overflow-hidden border border-green-100 flex flex-col md:flex-row min-h-0 md:min-h-[600px] rounded-[2.5rem]">

        {/* LEFT IMAGE / INFO SECTION */}
        <div className="md:w-1/2 w-full relative min-h-[250px] md:min-h-0 overflow-hidden bg-gray-50 border-b md:border-b-0 md:border-r border-green-100 group">
          <img
            src="https://res.cloudinary.com/dxfdcmxze/image/upload/v1780728563/contact_us_banner_bppqqp.png"
            alt="Premium Healthy Snacks"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-green-900/20 group-hover:bg-green-900/10 transition-colors" />
          
          <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 hidden sm:block">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Quality You Can Trust</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Have a bulk requirement or a special occasion? Our team is here to help you curate the perfect snack boxes.
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="md:w-1/2 w-full p-6 sm:p-12 md:p-16 flex flex-col justify-center bg-green-50/70">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                 Get in <span className="text-green-600">Touch</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium">Send us a message on WhatsApp!</p>
            </div>

            {/* ORDER TYPE SELECTOR */}
            <div className="flex bg-white/50 p-1 rounded-2xl gap-2 mb-4 w-fit border border-white">
              <button
                type="button"
                onClick={() => setOrderType("individual")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  orderType === "individual" 
                  ? "bg-green-600 text-white shadow-md shadow-green-200" 
                  : "text-gray-500 hover:text-green-600"
                }`}
              >
                Individual Orders
              </button>
              <button
                type="button"
                onClick={() => setOrderType("bulk")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  orderType === "bulk" 
                  ? "bg-green-600 text-white shadow-md shadow-green-200" 
                  : "text-gray-500 hover:text-green-600"
                }`}
              >
                Bulk Orders
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* NAME GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600/50" size={16} />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-white bg-white/80 focus:bg-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all font-semibold text-black placeholder:text-gray-500 text-xs"
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600/50" size={16} />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-white bg-white/80 focus:bg-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all font-semibold text-black placeholder:text-gray-500 text-xs"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600/50" size={16} />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-white bg-white/80 focus:bg-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all font-semibold text-black placeholder:text-gray-500 text-xs"
                  required
                />
              </div>

              {/* PHONE */}
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600/50" size={16} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile number (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-white bg-white/80 focus:bg-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all font-semibold text-black placeholder:text-gray-500 text-xs"
                />
              </div>

              {/* MESSAGE */}
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-green-600/50" size={16} />
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-white bg-white/80 focus:bg-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all font-semibold text-black placeholder:text-gray-500 resize-none text-xs"
                  required
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-3.5 rounded-2xl shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 decoration-0 text-xs"
              >
                <FaWhatsapp size={20} />
                <span>SEND TO WHATSAPP</span>
                <Send size={14} className="ml-1 opacity-50" />
              </button>
              
              <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest pt-1">
                 Response time: <span className="text-green-600">Within 30 minutes</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
