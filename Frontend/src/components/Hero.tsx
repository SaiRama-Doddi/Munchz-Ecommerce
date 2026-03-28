import { useEffect, useState } from "react";

const BANNERS = [
  { image: "/banners/premium-dry-fruits.png" },
  { image: "/banners/healthy-makhana.png" },
  { image: "/banners/nut-mixes-energy.png" },
  { image: "/banners/gift-boxes-premium.png" },
  { image: "/banners/modern-lifestyle-snack.png" }
];

export default function Hero() {
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
            className={`absolute inset-0 w-full h-full transition-all duration-[1500ms]
            ${index === active ? "opacity-100 visible" : "opacity-0 invisible"}`}
          >
            {/* Background Image */}
            <img
              src={banner.image}
              alt="Premium snacks"
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-out
              ${index === active ? "scale-100" : "scale-110"}`}
            />
            
            {/* Very Subtle Overlay for depth */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        ))}

        {/* DOT INDICATOR */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`transition-all duration-500 h-1.5 md:h-2 rounded-full
              ${
                active === index
                  ? "w-10 md:w-16 bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                  : "w-4 md:w-6 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}


