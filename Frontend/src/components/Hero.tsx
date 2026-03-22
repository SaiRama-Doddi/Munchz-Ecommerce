import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HERO_IMAGES = [
  "/banners/banner1.png",
  "/banners/banner2.png",
  "/banners/banner3.png",
  "/banners/banner4.png",
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
          <img
            key={img}
            src={img}
            alt="Healthy snacks"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms]
            ${index === active ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        {/* DOT INDICATOR */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">

          {HERO_IMAGES.map((_, index) => (
            <div
              key={index}
              onClick={() => setActive(index)}
              className={`transition-all duration-300 cursor-pointer
              
              ${
                active === index
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/50"
              }

              rounded-full`}
            />
          ))}

        </div>

      </div>
    </section>
  );
}
