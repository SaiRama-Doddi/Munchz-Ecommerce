import { useEffect, useState } from "react";
import { bannerService, Banner } from "../services/bannerService";

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getBanners();
        setBanners(data);
      } catch (err) {
        console.error("Failed to load hero banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.type === "BANNER_UPDATE") {
        console.log("Hero: Reloading banners due to live update...");
        fetchBanners();
      }
    };

    window.addEventListener("munchz-update", handleUpdate);
    return () => window.removeEventListener("munchz-update", handleUpdate);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) {
    return (
      <div 
        className="w-full bg-gray-100 animate-pulse" 
        style={{ aspectRatio: "1920/900" }} 
      />
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full mb-8 sm:mb-12 lg:mb-16">

      {/* HERO CONTAINER */}
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ aspectRatio: "1920/900" }}
      >

        {/* Images */}
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-[1500ms]
            ${index === active ? "opacity-100 visible" : "opacity-0 invisible"}`}
          >
            {/* Background Image */}
            <img
              src={banner.image}
              alt="Premium snacks"
              className="absolute inset-0 w-full h-full object-fill"
            />

            {/* Very Subtle Overlay for depth */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        ))}

        {/* DOT INDICATOR */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`transition-all duration-500 h-1.5 md:h-2 rounded-full
              ${active === index
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


