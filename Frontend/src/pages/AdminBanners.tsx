import React, { useState, useEffect } from "react";
import { 
  FolderPlus, 
  Trash2, 
  Plus, 
  ImageIcon, 
  Info, 
  ShieldAlert, 
  ArrowLeft, 
  ArrowRight,
  Eye
} from "lucide-react";
import { usePermissions } from "../hooks/usePermissions";
import { bannerService, Banner } from "../services/bannerService";
import { toast } from "react-hot-toast";

export default function AdminBanners() {
  const { hasPermission, isAdmin } = usePermissions();

  const canCreate = hasPermission("COUPONS", "CREATE");
  const canUpdate = hasPermission("COUPONS", "UPDATE");
  const canDelete = hasPermission("COUPONS", "DELETE");

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  // Load banners on mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getBanners();
        setBanners(data);
      } catch (err) {
        console.error("Failed to load banners:", err);
        toast.error("Failed to load banners");
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleAddBanner = async () => {
    if (!newUrl.trim()) {
      toast.error("Please enter a banner image URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(newUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    const updatedBanners = [...banners, { image: newUrl.trim() }];
    
    try {
      setLoading(true);
      await bannerService.saveBanners(updatedBanners);
      setBanners(updatedBanners);
      setNewUrl("");
      setPreviewUrl("");
      toast.success("Banner added successfully!");
    } catch (err) {
      console.error("Failed to save banner:", err);
      toast.error("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (index: number) => {
    if (!window.confirm("Are you sure you want to remove this banner?")) return;

    const updatedBanners = banners.filter((_, idx) => idx !== index);
    
    try {
      setLoading(true);
      await bannerService.saveBanners(updatedBanners);
      setBanners(updatedBanners);
      toast.success("Banner removed successfully!");
    } catch (err) {
      console.error("Failed to remove banner:", err);
      toast.error("Failed to remove banner");
    } finally {
      setLoading(false);
    }
  };

  const handleMoveBanner = async (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const updatedBanners = [...banners];
    const temp = updatedBanners[index];
    updatedBanners[index] = updatedBanners[targetIndex];
    updatedBanners[targetIndex] = temp;

    try {
      setLoading(true);
      await bannerService.saveBanners(updatedBanners);
      setBanners(updatedBanners);
      toast.success("Banner order updated!");
    } catch (err) {
      console.error("Failed to update banner order:", err);
      toast.error("Failed to update banner order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">Homepage Banners</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
            Manage the carousel banners shown on the main page hero section
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-gray-400 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
          <Info size={16} />
          <span>{banners.length} BANNERS ACTIVE</span>
        </div>
      </div>

      {/* FORM CARD */}
      {canCreate || canUpdate ? (
        <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

          <div className="flex items-center gap-3 mb-8 relative">
            <div className="p-2.5 bg-black text-white rounded-xl shadow-lg">
              <ImageIcon size={20} />
            </div>
            <h2 className="text-xl font-bold text-black">Upload Banner URL</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Input fields */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Banner Image URL
                </label>
                <div className="relative">
                  <input
                    value={newUrl}
                    onChange={(e) => {
                      setNewUrl(e.target.value);
                      setPreviewUrl(e.target.value);
                    }}
                    className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-5 py-4 text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                    placeholder="https://res.cloudinary.com/.../image.jpg"
                  />
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
                <p className="text-[10px] text-gray-400 ml-1 mt-1 leading-normal">
                  Provide a direct URL to a banner image. For optimal premium rendering, use banners with a <strong>1920x900</strong> aspect ratio (approx. 2.13:1).
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddBanner}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                  <span>Add Banner</span>
                </button>
              </div>
            </div>

            {/* Live Preview Pane */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
              {previewUrl ? (
                <div className="w-full h-full flex flex-col items-center gap-3">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 self-start">
                    <Eye size={12} /> Live Preview
                  </div>
                  <div 
                    className="w-full border border-gray-200 bg-white rounded-xl overflow-hidden shadow-md"
                    style={{ aspectRatio: "1920/900" }}
                  >
                    <img 
                      src={previewUrl} 
                      alt="Banner preview" 
                      className="w-full h-full object-cover"
                      onError={() => {
                        toast.error("Failed to load preview image. Please verify the URL.");
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-300">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">A preview will display here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : !isAdmin && (
        <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-8 flex items-center gap-4 text-orange-700">
          <ShieldAlert size={24} />
          <p className="text-xs font-bold uppercase tracking-widest">
            You do not have permission to create or edit homepage banners.
          </p>
        </div>
      )}

      {/* ACTIVE BANNERS LIST */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-base font-bold text-black tracking-tight">Active Carousel Banners</h3>
          <div className="h-px flex-1 mx-6 bg-gray-100 hidden md:block"></div>
        </div>

        {loading && banners.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Loading banners...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {banners.map((banner, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-xl shadow-sm overflow-hidden relative"
              >
                {/* Index Label */}
                <div className="absolute top-8 left-8 bg-black/70 backdrop-blur-md text-white text-[10px] font-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10 border border-white/20">
                  #{index + 1}
                </div>

                {/* Banner Image Preview Card */}
                <div 
                  className="w-full border border-gray-100 bg-gray-50 rounded-2xl overflow-hidden shadow-sm group-hover:scale-[1.01] transition-transform duration-500 mb-6"
                  style={{ aspectRatio: "1920/900" }}
                >
                  <img
                    src={banner.image}
                    alt={`Homepage banner ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Management Toolbar */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50 mt-auto">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveBanner(index, "left")}
                      disabled={index === 0 || loading}
                      className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-xl text-gray-400 transition-colors disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-400"
                      title="Move Left/Up"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveBanner(index, "right")}
                      disabled={index === banners.length - 1 || loading}
                      className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-xl text-gray-400 transition-colors disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-400"
                      title="Move Right/Down"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {/* URL Text field - Read Only */}
                  <div className="flex-1 min-w-0 mx-2">
                    <p className="text-[10px] text-gray-400 font-bold truncate select-all bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                      {banner.image}
                    </p>
                  </div>

                  {/* Remove Button */}
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteBanner(index)}
                      disabled={loading}
                      className="p-3 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-colors disabled:opacity-50"
                      title="Remove Banner"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {banners.length === 0 && !loading && (
          <div className="text-center py-24 bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <ImageIcon size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              No banners uploaded. Start by creating one above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
