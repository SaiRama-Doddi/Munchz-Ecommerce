import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HERO_IMAGES = [
  "/hero.png",
  "https://www.shutterstock.com/image-photo/healthy-snack-mixed-nuts-dried-600nw-2309692033.jpg",
  "https://img.pikbest.com/origin/10/01/82/867pIkbEsTAIq.png!w700wp",
  "https://nutribinge.in/cdn/shop/articles/Unveiling_the_Essence_of_Dry_Fruits_in_Indian_Festivities.jpg?v=1713257842",
];

export default function Hero() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mt-4 sm:mt-6 lg:mt-8 px-4 sm:px-6 lg:px-8">
      
      {/* HERO CONTAINER */}
      <div
        className="
        relative w-full overflow-hidden bg-black
        h-[220px] sm:h-[320px] md:h-[420px] lg:h-[75vh]
        rounded-xl
        "
      >

        {/* Images */}
        {HERO_IMAGES.map((img, index) => (
          <div key={img} className="absolute inset-0">
            <img
              src={img}
              alt="Healthy snacks"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out
              ${index === active ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
            />
            {index === active && (
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-black/30">
                <div className="max-w-xl animate-fade-in-up">
                  <span className="inline-block text-emerald-400 font-black text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 bg-emerald-950/50 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/20">
                    Artisanal Nut Selection
                  </span>
                  <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-tight tracking-[-0.04em] mb-8">
                    Elevate Your <span className="text-emerald-400">Gourmet</span> Munching
                  </h1>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => navigate("/productpage")}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-emerald-900/40 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Shop Collection
                    </button>
                    <button 
                      onClick={() => navigate("/Aboutmain")}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Our Story
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* DOT INDICATOR */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {HERO_IMAGES.map((_, index) => (
            <div
              key={index}
              onClick={() => setActive(index)}
              className={`transition-all duration-500 cursor-pointer h-1.5 rounded-full
              ${
                active === index
                  ? "w-10 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
