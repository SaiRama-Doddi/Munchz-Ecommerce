import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BANNERS = [
  {
    image: "/banners/premium-dry-fruits.png",
    title1: "Nature's Finest",
    title2: "Assortment",
    subtitle: "Handpicked perfection in every bite. Pure crunch.",
    link: "/all-products"
  },
  {
    image: "/banners/healthy-makhana.png",
    title1: "Guilt-Free",
    title2: "Indulgence",
    subtitle: "Roasted to perfection. Flavored with care.",
    link: "/all-products"
  },
  {
    image: "/banners/nut-mixes-energy.png",
    title1: "Fuel Your",
    title2: "Vitality",
    subtitle: "Energy-packed seed and nut blends for active lives.",
    link: "/all-products"
  },
  {
    image: "/banners/gift-boxes-premium.png",
    title1: "Elegant Gifting",
    title2: "Solutions",
    subtitle: "Share the goodness with our curated gift sets.",
    link: "/all-products"
  },
  {
    image: "/banners/modern-lifestyle-snack.png",
    title1: "Smart Snacking",
    title2: "Modern Lives",
    subtitle: "Wholesome snacks that fit your fast-paced schedule.",
    link: "/all-products"
  }
];

export default function Hero() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mt-4 sm:mt-6 lg:mt-8 max-w-7xl mx-auto px-4">
      
      {/* HERO CONTAINER */}
      <div
        className="
        relative w-full overflow-hidden bg-black
        h-[260px] sm:h-[380px] md:h-[480px] lg:h-[75vh]
        rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl
        "
      >

        {/* Images */}
        {BANNERS.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-[1500ms] flex items-center
            ${index === active ? "opacity-100 visible" : "opacity-0 invisible"}`}
          >
            {/* Background Image */}
            <img
              src={banner.image}
              alt={banner.title1}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-out
              ${index === active ? "scale-100" : "scale-110"}`}
            />
            
            {/* Dynamic Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* CONTENT */}
            <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-2xl">
               <div className={`transition-all duration-1000 delay-300 transform ${index === active ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-4 md:mb-6 tracking-tighter">
                    {banner.title1} <br />
                    <span className="text-green-500 italic">{banner.title2}</span>
                  </h1>
                  <p className="text-sm md:text-lg lg:text-xl text-gray-200 font-medium mb-8 md:mb-10 max-w-md leading-relaxed">
                    {banner.subtitle}
                  </p>
                  <button 
                    onClick={() => navigate(banner.link)}
                    className="group bg-green-600 hover:bg-green-700 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full font-bold transition-all shadow-xl shadow-green-900/40 flex items-center gap-3 active:scale-95"
                  >
                    SHOP NOW
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
               </div>
            </div>
          </div>
        ))}

        {/* DOT INDICATOR */}
        <div className="absolute bottom-6 md:bottom-10 right-8 md:right-16 z-20 flex gap-4">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`transition-all duration-500 h-1.5 md:h-2 rounded-full
              ${
                active === index
                  ? "w-10 md:w-16 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                  : "w-4 md:w-6 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

