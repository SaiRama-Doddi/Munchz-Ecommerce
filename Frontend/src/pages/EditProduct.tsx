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
  Loader2,
  Save,
  Globe
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
      // alert("Unable to fetch product content.");
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
      alert("Product Updated Successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("UPDATE FAILED:", err);
      alert("Update failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-white">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-gray-400 uppercase text-[10px]">Materializing Product Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-black hover:border-black transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-right">
          <h1 className="text-2xl text-black uppercase">Edit Product</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Listing Refinement</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CORE PRODUCT DATA */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* GENERAL INFO */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="p-2.5 bg-black text-white rounded-xl">
                <Package size={20} />
              </div>
              <h2 className="text-xl text-black uppercase">Essential Identifiers</h2>
            </div>
            
            <div className="space-y-6 relative">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Trade Name</label>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14"
                  placeholder="e.g. Premium Atlantic Salmon"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Composition & Narrative</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all min-h-[160px] resize-none leading-relaxed"
                  placeholder="Detail the unique value propositions..."
                  required
                />
              </div>
            </div>
          </div>

          {/* PRICING & VARIANTS */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Tag size={20} />
                </div>
                <h2 className="text-xl text-black uppercase">Variant Matrix</h2>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 text-black text-[10px] uppercase bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
              >
                <Plus size={16} />
                <span>Add Scale</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-5 gap-4 px-6 text-[9px] text-gray-300 uppercase">
                <div className="col-span-1">Label (e.g. 1kg)</div>
                <div>Mass (Grams)</div>
                <div>Standard Price</div>
                <div>Offer Price</div>
                <div className="text-center">Control</div>
              </div>

              {form.variants.map((v, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100 group hover:border-emerald-100 transition-all">
                  <input
                    value={v.weightLabel}
                    onChange={(e) => updateVariant(i, "weightLabel", e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-black transition-all h-11"
                    placeholder="250g"
                  />
                  <input
                    value={v.weightInGrams}
                    onChange={(e) => updateVariant(i, "weightInGrams", String(e.target.value).replace(/\D/g, ""))}
                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-black transition-all h-11"
                    placeholder="250"
                  />
                  <input
                    value={v.mrp}
                    onChange={(e) => updateVariant(i, "mrp", String(e.target.value).replace(/\D/g, ""))}
                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm text-gray-400 outline-none focus:border-black transition-all h-11"
                    placeholder="500"
                  />
                  <input
                    value={v.offerPrice}
                    onChange={(e) => updateVariant(i, "offerPrice", String(e.target.value).replace(/\D/g, ""))}
                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm text-emerald-600 outline-none focus:border-emerald-500 transition-all h-11"
                    placeholder="450"
                  />
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      disabled={form.variants.length <= 1}
                      className="w-11 h-11 bg-white border border-gray-100 text-gray-300 rounded-xl flex items-center justify-center hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all disabled:opacity-20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TAXONOMY & MEDIA */}
        <div className="space-y-8">
          
          {/* TAXONOMY */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gray-50 text-black rounded-xl">
                <Layers size={18} />
              </div>
              <h2 className="text-lg text-black uppercase">Classification</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Parent Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => updateField("categoryId", e.target.value)}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3 text-sm appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14"
                  required
                >
                  <option value="">Select Category</option>
                  {categories?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Subcategory Type</label>
                <select
                  value={form.subcategoryId}
                  onChange={(e) => updateField("subcategoryId", e.target.value)}
                  disabled={!form.categoryId || catsLoading}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3 text-sm appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14 disabled:opacity-40"
                >
                  <option value="">No Secondary Type</option>
                  {subcategories?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* MEDIA ASSETS */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ImageIcon size={18} />
                </div>
                <h2 className="text-lg text-black uppercase">Media Grid</h2>
              </div>
              <button
                type="button"
                onClick={addImage}
                className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:text-black hover:bg-white border border-transparent hover:border-gray-100 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-emerald-600 uppercase ml-1 flex items-center gap-1">
                  Primary Thumbnail <CheckCircle size={10} />
                </label>
                <div className="relative group">
                  <input
                    value={form.imageUrl}
                    onChange={(e) => updateField("imageUrl", e.target.value)}
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3 text-[11px] outline-none focus:bg-white focus:border-emerald-500 transition-all h-14 pr-10"
                    placeholder="URL for primary asset..."
                    required
                  />
                  {form.imageUrl && (
                    <button
                      type="button"
                      onClick={clearMainImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-4">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Expanded Gallery</label>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 no-scrollbar">
                  {form.imageUrls.map((url, i) => (
                    <div key={i} className="relative group">
                      <input
                        value={url}
                        onChange={(e) => updateImage(i, e.target.value)}
                        className="w-full bg-gray-50/50 border border-transparent rounded-xl px-4 py-3 text-[10px] outline-none focus:bg-white focus:border-black transition-all h-11 pr-10"
                        placeholder={`Asset #${i + 1} URL`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PERSISTENCE ACTIONS */}
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-black text-white py-5 rounded-3xl text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-black/5 hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
            >
              <Save size={18} />
              Update Master Record
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-gray-50 text-gray-300 py-5 rounded-3xl text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
            >
              Discard Changes
            </button>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex gap-4">
            <Globe size={20} className="text-emerald-500 shrink-0 mt-1" />
            <p className="text-[10px] text-gray-400 uppercase leading-relaxed">
              Updates to this record will propagate immediately to all storefront catalogs and active search indices.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}