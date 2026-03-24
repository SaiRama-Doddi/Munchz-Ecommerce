import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HERO_IMAGES = [
  "/hero.png",
  "https://www.shutterstock.com/image-photo/healthy-snack-mixed-nuts-dried-600nw-2309692033.jpg",
  "https://farmfreshbangalore.com/cdn/shop/articles/When_dry_fruits_should_be_eaten.jpg?v=1677932089",
  "https://nutribinge.in/cdn/shop/articles/Unveiling_the_Essence_of_Dry_Fruits_in_Indian_Festivities.jpg?v=1713257842",
];

export default function Hero() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  /* AUTO IMAGE CHANGE */
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-black">

      {/* BACKGROUND IMAGES */}
      {HERO_IMAGES.map((img, index) => (
        <img
          key={img}
          src={img}
          alt="Premium snacks"
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-[1200ms] ease-in-out
            ${index === active ? "opacity-100 scale-105" : "opacity-0 scale-110"}
            animate-[heroZoom_18s_ease-in-out_infinite]
          `}
        />
      ))}

      {/* DARK OVERLAY (NO BLUR) */}
      <div className="absolute inset-0 bg-black/65" />

      {/* CONTENT */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
        <div className="max-w-3xl">

          {/* ACCENT */}
          <div className="w-16 h-[3px] bg-green-500 mb-6" />

          {/* HEADING */}
          <h1
            className="
              text-white
              font-semibold
              text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
              leading-tight
              tracking-tight
            "
          >
            Snack Smarter.
            <br />
            <span className="text-green-400">Live Better.</span>
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              mt-6
              max-w-xl
              text-base sm:text-lg
              text-white/85
              leading-relaxed
            "
          >
            Real ingredients. Clean nutrition. Crafted for energy,
            focus, and everyday performance — without compromise.
          </p>

          {/* CTA */}
          <div className="mt-10">
            <button
              onClick={() => navigate("/productpage")}
              className="
                inline-flex items-center gap-3
                px-8 py-4
                bg-green-600
                text-white
                font-semibold
                rounded-lg
                shadow-lg shadow-green-600/30
                hover:bg-green-700
                hover:shadow-green-700/40
                active:scale-95
                transition-all duration-300
                cursor-pointer
              "
            >
              Shop Now
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM FADE */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />

      {/* DOT INDICATOR (MINIMAL) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {HERO_IMAGES.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-all
              ${i === active ? "bg-green-500 w-6" : "bg-white/50"}
            `}
          />
        ))}
      </div>

      {/* KEYFRAMES */}
      <style>
        {`
          @keyframes heroZoom {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </section>
  );
}
