import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { useCategories } from "../hooks/useQueryHelpers";
import { useSubcategories } from "../hooks/useSubcategories";
import { 
  ArrowLeft, 
  Package, 
  Layers, 
  Image as ImageIcon, 
  Tag, 
  Plus, 
  Trash2, 
  CheckCircle,
  X,
  Info,
  Loader2
} from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: categories } = useCategories();
  const { subcategories, fetchSubcats, isLoading: catsLoading } = useSubcategories();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    categoryId: "",
    subcategoryId: "",
    name: "",
    description: "",
    imageUrl: "",
    imageUrls: [] as string[],
    variants: [] as any[],
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (form.categoryId) {
      fetchSubcats(Number(form.categoryId));
    }
  }, [form.categoryId]);

  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const p = res.data || {};

      const images =
        Array.isArray(p.imageUrls)
          ? p.imageUrls
          : Array.isArray(p.images)
          ? p.images.map((i: any) => i.imageUrl)
          : [];

      const variants = Array.isArray(p.variants) ? p.variants : [];

      const mappedVariants = variants.map((v: any) => ({
        id: v.id || null,
        weightLabel: v.weightLabel || v.label || "",
        weightInGrams: v.weightInGrams || v.weight || 0,
        mrp: v.mrp || v.price || 0,
        offerPrice: v.offerPrice || v.discountPrice || 0,
      }));
 
      setForm({
        categoryId: p.categoryId ? String(p.categoryId) : "",
        subcategoryId: p.subcategoryId ? String(p.subcategoryId) : "",
        name: p.name || "",
        description: p.description || "",
        imageUrl: p.imageUrl || "",
        imageUrls: images.length ? images : [""],
        variants: mappedVariants,
      });

      setLoading(false);
    } catch (err) {
      console.error("FAILED TO LOAD PRODUCT:", err);
      alert("Unable to fetch product content.");
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const arr = [...form.variants];
    arr[index] = { ...arr[index], [field]: value };
    setForm({ ...form, variants: arr });
  };

  const removeVariant = (index: number) => {
    if (form.variants.length <= 1) return;
    const arr = [...form.variants];
    arr.splice(index, 1);
    setForm({ ...form, variants: arr });
  };

  const updateImage = (index: number, value: string) => {
    const arr = [...form.imageUrls];
    arr[index] = value;
    setForm({ ...form, imageUrls: arr });
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [
        ...form.variants,
        { weightLabel: "", weightInGrams: 0, mrp: 0, offerPrice: 0 },
      ],
    });
  };

  const addImage = () => {
    setForm({ ...form, imageUrls: [...form.imageUrls, ""] });
  };

  const removeImage = (index: number) => {
    const arr = [...form.imageUrls];
    arr.splice(index, 1);
    setForm({ ...form, imageUrls: arr.length ? arr : [""] });
  };

  const clearMainImage = () => {
    setForm({ ...form, imageUrl: "" });
  };

  const submit = async (e: any) => {
    e.preventDefault();
    const payload = {
      categoryId: Number(form.categoryId),
      subcategoryId: form.subcategoryId ? Number(form.subcategoryId) : null,
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      imageUrls: form.imageUrls.filter((x) => x.trim() !== ""),
      variants: form.variants,
    };

    try {
      await api.put(`/products/${id}`, payload);
      alert("Product Updated");
      navigate("/admin/products");
    } catch (err) {
      console.error("UPDATE FAILED:", err);
      alert("Update failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Product Details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-emerald-500 hover:border-emerald-100 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Product</h1>
            <p className="text-slate-500 font-medium font-inter">Update and refine your inventory items</p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: BASIC INFO & ORGANIZATION */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* GENERAL INFO */}
          <div className="glass-card rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Package size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">General Information</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="input"
                  placeholder="e.g. Premium Atlantic Salmon"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Product Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="input min-h-[150px] resize-none"
                  placeholder="Describe the product details..."
                  required
                />
              </div>
            </div>
          </div>

          {/* PRICING & VARIANTS */}
          <div className="glass-card rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Tag size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Pricing & Variants</h2>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <Plus size={16} />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-5 gap-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="col-span-1">Label (e.g. 500g)</div>
                <div>Weight (Grams)</div>
                <div>MRP (₹)</div>
                <div>Offer Price (₹)</div>
                <div className="text-center">Action</div>
              </div>

              {form.variants.map((v, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                  <input
                    value={v.weightLabel}
                    onChange={(e) => updateVariant(i, "weightLabel", e.target.value)}
                    className="input h-11 text-sm col-span-1"
                    placeholder="250g"
                  />
                  <input
                    value={v.weightInGrams}
                    onChange={(e) => updateVariant(i, "weightInGrams", e.target.value.replace(/\D/g, ""))}
                    className="input h-11 text-sm"
                    placeholder="250"
                  />
                  <input
                    value={v.mrp}
                    onChange={(e) => updateVariant(i, "mrp", e.target.value.replace(/\D/g, ""))}
                    className="input h-11 text-sm"
                    placeholder="500"
                  />
                  <input
                    value={v.offerPrice}
                    onChange={(e) => updateVariant(i, "offerPrice", e.target.value.replace(/\D/g, ""))}
                    className="input h-11 text-sm"
                    placeholder="450"
                  />
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      disabled={form.variants.length <= 1}
                      className="w-11 h-11 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORGANIZATION & MEDIA */}
        <div className="space-y-8">
          
          {/* ORGANIZATION */}
          <div className="glass-card rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Layers size={18} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Organization</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Main Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => updateField("categoryId", e.target.value)}
                  className="input h-12"
                  required
                >
                  <option value="">Select Category</option>
                  {categories?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Subcategory</label>
                <select
                  value={form.subcategoryId}
                  onChange={(e) => updateField("subcategoryId", e.target.value)}
                  disabled={!form.categoryId || catsLoading}
                  className="input h-12"
                >
                  <option value="">No Subcategory</option>
                  {subcategories?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {!form.categoryId && (
                  <p className="text-[10px] text-slate-400 font-bold ml-1 flex items-center gap-1">
                    <Info size={10} /> Select a category first
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* MEDIA SECTION */}
          <div className="glass-card rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ImageIcon size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Media</h2>
              </div>
              <button
                type="button"
                onClick={addImage}
                className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-emerald-600 flex items-center gap-1">
                  Main Thumbnail
                  <CheckCircle size={10} />
                </label>
                <div className="relative group">
                  <input
                    value={form.imageUrl}
                    onChange={(e) => updateField("imageUrl", e.target.value)}
                    className="input h-12 pr-10"
                    placeholder="URL for main image..."
                    required
                  />
                  {form.imageUrl && (
                    <button
                      type="button"
                      onClick={clearMainImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Gallery Images</label>
                <div className="space-y-3">
                  {form.imageUrls.map((url, i) => (
                    <div key={i} className="relative group">
                      <input
                        value={url}
                        onChange={(e) => updateImage(i, e.target.value)}
                        className="input h-10 text-xs pr-10 bg-slate-50/50"
                        placeholder={`Gallery Image #${i + 1} URL`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-4 flex flex-col gap-4">
            <button
              type="submit"
              className="w-full bg-accent-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              Update Product Details
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all duration-300"
            >
              Cancel & Discard
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}