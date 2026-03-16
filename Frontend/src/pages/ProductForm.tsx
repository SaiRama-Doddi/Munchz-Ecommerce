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
  Info
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
      alert("Product created successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("CREATE FAILED:", err);
      alert("Failed to create product.");
    }
  };

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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Product</h1>
            <p className="text-slate-500 font-medium">Add a new item to your store inventory</p>
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
                  placeholder="Describe the product details, benefits and origin..."
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
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Subcategory</label>
                <select
                  value={form.subcategoryId}
                  onChange={(e) => updateField("subcategoryId", e.target.value)}
                  disabled={!form.categoryId || isLoading}
                  className="input h-12"
                >
                  <option value="">No Subcategory</option>
                  {subcategories.map((s: any) => (
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
                onClick={addImageField}
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
                        onChange={(e) => updateImageUrl(i, e.target.value)}
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
              Confirm & Publish Product
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all duration-300"
            >
              Discard Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}