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
    <div className="min-h-screen bg-[#f9fdf7] flex items-center justify-center px-4 py-12 md:py-20">
      <div className="max-w-6xl w-full bg-[#ecfdf5] rounded-[2.5rem] shadow-xl overflow-hidden grid md:grid-cols-2 border border-green-100/50">

        {/* LEFT IMAGE / INFO SECTION */}
        <div className="relative hidden md:block group">
          <img
            src="https://res.cloudinary.com/dd4oiwnep/image/upload/ingredients-healthy-dessert-chia-puddings-kitchen-wooden-table_1_fiakub.jpg"
            alt="Premium Healthy Snacks"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-green-900/20 group-hover:bg-green-900/10 transition-colors" />
          
          <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-white/50">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality You Can Trust</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Have a bulk requirement or a special occasion? Our team is here to help you curate the perfect snack boxes.
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="p-8 md:p-14 lg:p-16 bg-[#ecfdf5]">
          
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
               Get in <span className="text-green-600">Touch</span>
            </h2>
            <p className="text-gray-500 font-medium">We'd love to hear from you. Send us a message on WhatsApp!</p>
          </div>

          {/* ORDER TYPE SELECTOR */}
          <div className="flex bg-white/50 p-1.5 rounded-2xl gap-2 mb-10 w-fit border border-white">
            <button
              onClick={() => setOrderType("individual")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                orderType === "individual" 
                ? "bg-green-600 text-white shadow-md shadow-green-200" 
                : "text-gray-500 hover:text-green-600"
              }`}
            >
              Individual Orders
            </button>
            <button
              onClick={() => setOrderType("bulk")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                orderType === "bulk" 
                ? "bg-green-600 text-white shadow-md shadow-green-200" 
                : "text-gray-500 hover:text-green-600"
              }`}
            >
              Bulk Orders
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* NAME GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600/50" size={18} />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white bg-white/80 focus:bg-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all font-semibold text-black placeholder:text-gray-500"
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600/50" size={18} />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white bg-white/80 focus:bg-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all font-semibold text-black placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600/50" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white bg-white/80 focus:bg-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all font-semibold text-black placeholder:text-gray-500"
                required
              />
            </div>

            {/* PHONE */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600/50" size={18} />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile number (optional)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white bg-white/80 focus:bg-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all font-semibold text-black placeholder:text-gray-500"
              />
            </div>

            {/* MESSAGE */}
            <div className="relative">
              <MessageSquare className="absolute left-4 top-6 text-green-600/50" size={18} />
              <textarea
                name="message"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white bg-white/80 focus:bg-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all font-semibold text-black placeholder:text-gray-500 resize-none"
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-5 rounded-2xl shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 decoration-0"
            >
              <FaWhatsapp size={24} />
              <span>SEND TO WHATSAPP</span>
              <Send size={18} className="ml-1 opacity-50" />
            </button>
            
            <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest pt-4">
               Typical response time: <span className="text-green-600">Within 30 minutes</span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
