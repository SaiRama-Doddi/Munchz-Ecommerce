import { useEffect, useState } from "react";
import { bannerService, Banner } from "../services/bannerService";
import { optimizeCloudinaryUrl } from "../utils/imageUtils";

const DEFAULT_BANNERS: Banner[] = [
  { image: "https://res.cloudinary.com/dxfdcmxze/image/upload/f_auto,q_auto/v1780388897/gifts_coming_soon_banner_zo4uvh.png" },
  { image: "https://res.cloudinary.com/dxfdcmxze/image/upload/f_auto,q_auto/v1778332622/desktop_banners_2.jpg_1_c1fukp.jpg" },
  { image: "https://res.cloudinary.com/dxfdcmxze/image/upload/f_auto,q_auto/v1778564998/desktop_banners_3.jpg_mtdats.jpg" }
];

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>(() => {
    const local = localStorage.getItem("gomunchz_banners");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_BANNERS;
  });
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getBanners();
        setBanners((prev) => {
          const match = data.length === prev.length && data.every((b, i) => b.image === prev[i].image);
          return match ? prev : data;
        });
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
    <section className="w-full mb-0">

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
              src={optimizeCloudinaryUrl(banner.image, 1400)}
              srcSet={`${optimizeCloudinaryUrl(banner.image, 640)} 640w, ${optimizeCloudinaryUrl(banner.image, 1024)} 1024w, ${optimizeCloudinaryUrl(banner.image, 1400)} 1400w`}
              sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1400px"
              alt="Premium snacks"
              className="absolute inset-0 w-full h-full object-fill"
              fetchPriority={index === 0 ? "high" : "auto"}
              loading="eager"
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


