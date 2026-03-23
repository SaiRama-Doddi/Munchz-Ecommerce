import React, { useState, useEffect } from "react";
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
  Save,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";


interface VariantForm {
  weightLabel: string;
  weightInGrams: string;
  mrp: string;
  offerPrice: string;
}

interface ProductFormState {
  categoryId: string;
  subcategoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
  variants: VariantForm[];
}

export default function ProductForm() {


  const navigate = useNavigate();

  const { data: categories = [] } = useCategories();
  const { subcategories, fetchSubcats, isLoading } = useSubcategories();

  const [form, setForm] = useState<ProductFormState>({
    categoryId: "",
    subcategoryId: "",
    name: "",
    description: "",
    imageUrl: "",
    imageUrls: [""],
    variants: [
      { weightLabel: "", weightInGrams: "", mrp: "", offerPrice: "" },
    ],
  });

  /* LOAD SUBCATEGORIES ON CATEGORY CHANGE */
  useEffect(() => {
    if (form.categoryId) {
      fetchSubcats(Number(form.categoryId));
      setForm((prev) => ({ ...prev, subcategoryId: "" }));
    }
  }, [form.categoryId]);

  const updateField = (field: keyof ProductFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addImageField = () => {
    updateField("imageUrls", [...form.imageUrls, ""]);
  };

  const updateImageUrl = (i: number, val: string) => {
    const arr = [...form.imageUrls];
    arr[i] = val;
    updateField("imageUrls", arr);
  };

  const removeImage = (index: number) => {
    const arr = [...form.imageUrls];
    arr.splice(index, 1);
    updateField("imageUrls", arr.length ? arr : [""]);
  };

  const clearMainImage = () => {
    updateField("imageUrl", "");
  };

  const addVariant = () => {
    updateField("variants", [
      ...form.variants,
      { weightLabel: "", weightInGrams: "", mrp: "", offerPrice: "" },
    ]);
  };

  const updateVariant = (i: number, field: keyof VariantForm, value: string) => {
    const arr = [...form.variants];
    arr[i] = { ...arr[i], [field]: value };
    updateField("variants", arr);
  };

  const removeVariant = (index: number) => {
    if (form.variants.length <= 1) return;
    const arr = [...form.variants];
    arr.splice(index, 1);
    updateField("variants", arr);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      categoryId: Number(form.categoryId),
      subcategoryId: form.subcategoryId ? Number(form.subcategoryId) : null,
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      imageUrls: form.imageUrls.filter(Boolean),
      variants: form.variants.map((v) => ({
        weightLabel: v.weightLabel,
        weightInGrams: Number(v.weightInGrams),
        mrp: Number(v.mrp),
        offerPrice: Number(v.offerPrice),
      })),
    };

    try {
      await api.post("/products", payload);
      alert("Product Created Successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("CREATE FAILED:", err);
      alert("Failed to create product.");
    }
  };

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
          <h1 className="text-2xl text-black uppercase">Create Listing</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">New Inventory Nucleus</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: BASIC INFO & ORGANIZATION */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* GENERAL INFO */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="p-2.5 bg-black text-white rounded-xl">
                <Package size={20} />
              </div>
              <h2 className="text-xl text-black uppercase">Product DNA</h2>
            </div>

            <div className="space-y-6 relative">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Market Identity</label>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14"
                  placeholder="e.g. Premium Atlantic Salmon"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Comprehensive Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all min-h-[160px] resize-none leading-relaxed"
                  placeholder="Detail the attributes and origins of this item..."
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
                <h2 className="text-xl text-black uppercase">Scaling Matrix</h2>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 text-black text-[10px] uppercase bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
              >
                <Plus size={16} />
                <span>New Variant</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-5 gap-4 px-6 text-[9px] text-gray-300 uppercase">
                <div className="col-span-1">Label (e.g. 500g)</div>
                <div>Net Weight (g)</div>
                <div>List Price</div>
                <div>Sale Price</div>
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
                    onChange={(e) => updateVariant(i, "weightInGrams", e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-black transition-all h-11"
                    placeholder="250"
                  />
                  <input
                    value={v.mrp}
                    onChange={(e) => updateVariant(i, "mrp", e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm text-gray-400 outline-none focus:border-black transition-all h-11"
                    placeholder="500"
                  />
                  <input
                    value={v.offerPrice}
                    onChange={(e) => updateVariant(i, "offerPrice", e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm text-emerald-600 outline-none focus:border-emerald-500 transition-all h-11"
                    placeholder="450"
                  />
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      disabled={form.variants.length <= 1}
                      className="w-11 h-11 bg-white border border-gray-100 text-gray-400 rounded-xl flex items-center justify-center hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TAXONOMY & ASSETS */}
        <div className="space-y-8">
          
          {/* ORGANIZATION */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-black text-white rounded-xl">
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
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Subcategory Node</label>
                <select
                  value={form.subcategoryId}
                  onChange={(e) => updateField("subcategoryId", e.target.value)}
                  disabled={!form.categoryId || isLoading}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3 text-sm appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14 disabled:opacity-40"
                >
                  <option value="">No Secondary Node</option>
                  {subcategories.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {!form.categoryId && (
                  <p className="text-[9px] text-gray-400 ml-1 uppercase italic pt-1">
                    Select master category first
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* MEDIA SECTION */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ImageIcon size={18} />
                </div>
                <h2 className="text-lg text-black uppercase">Visual Assets</h2>
              </div>
              <button
                type="button"
                onClick={addImageField}
                className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:text-black hover:bg-white border border-transparent hover:border-gray-100 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-emerald-600 uppercase ml-1 flex items-center gap-1">
                  Dominant Asset <CheckCircle size={10} />
                </label>
                <div className="relative group">
                  <input
                    value={form.imageUrl}
                    onChange={(e) => updateField("imageUrl", e.target.value)}
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3 text-[11px] outline-none focus:bg-white focus:border-emerald-500 transition-all h-14 pr-10"
                    placeholder="URL for primary display..."
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
                <label className="text-[10px] text-gray-400 uppercase ml-1">Gallery Collection</label>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                  {form.imageUrls.map((url, i) => (
                    <div key={i} className="relative group/field">
                      <input
                        value={url}
                        onChange={(e) => updateImageUrl(i, e.target.value)}
                        className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-[10px] outline-none focus:bg-white focus:border-black transition-all h-11 pr-10"
                        placeholder={`Asset #${i + 1} URL`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-red-400 opacity-0 group-hover/field:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ACTION PERSISTENCE */}
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-black text-white py-5 rounded-3xl text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-black/5 hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
            >
              <Save size={18} />
              Authorize Publication
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-gray-50 text-gray-300 py-5 rounded-3xl text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
            >
              Discard Draft
            </button>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex gap-4">
            <Globe size={20} className="text-emerald-500 shrink-0 mt-1" />
            <p className="text-[10px] text-gray-400 uppercase leading-relaxed">
              New listings are synchronized immediately with primary sales channels. Ensure data is verified before submission.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}