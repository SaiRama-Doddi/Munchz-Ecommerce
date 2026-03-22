import { ArrowUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingActions() {
  const whatsappNumber = "8688547851";
  const whatsappLink = `https://wa.me/91${whatsappNumber}`;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-4">
      {/* SCROLL TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className="w-12 h-12 bg-white text-gray-800 rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all hover:-translate-y-1 active:scale-95 group"
        title="Scroll to Top"
      >
        <ArrowUp size={24} className="group-hover:text-green-600 transition-colors" />
      </button>

      {/* WHATSAPP BUTTON */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#20ba59] transition-all hover:-translate-y-1 active:scale-95 animate-bounce-subtle"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp size={34} className="text-white" />
      </a>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}} />
    </div>
  );
}
