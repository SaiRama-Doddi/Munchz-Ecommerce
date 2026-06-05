import api from "../api/client";

export interface Banner {
  id?: string | number;
  image: string;
}

const DEFAULT_BANNERS: Banner[] = [
  { image: "https://res.cloudinary.com/dxfdcmxze/image/upload/v1780388897/gifts_coming_soon_banner_zo4uvh.png" },
  { image: "https://res.cloudinary.com/dxfdcmxze/image/upload/v1778332622/desktop_banners_2.jpg_1_c1fukp.jpg" },
  { image: "https://res.cloudinary.com/dxfdcmxze/image/upload/v1778564998/desktop_banners_3.jpg_mtdats.jpg" }
];

const LOCAL_STORAGE_KEY = "gomunchz_banners";

export const bannerService = {
  getBanners: async (): Promise<Banner[]> => {
    try {
      const res = await api.get("/banners");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // Sync to local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.data));
        return res.data;
      }
    } catch (err) {
      console.warn("Backend banners endpoint failed, falling back to local storage:", err);
    }

    // Fallback to local storage or defaults
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return DEFAULT_BANNERS;
      }
    }
    return DEFAULT_BANNERS;
  },

  saveBanners: async (banners: Banner[]): Promise<void> => {
    // Save to local storage first (ensures offline persistence)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(banners));

    try {
      // Sync to backend if available
      await api.post("/banners", banners);
    } catch (err) {
      console.warn("Could not sync banners with backend (backend may be offline):", err);
    }
  }
};
