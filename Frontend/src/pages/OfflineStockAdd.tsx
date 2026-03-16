import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import offlineInventoryApi from "../api/offlineInventoryApi";
import { 
  ArrowLeft, 
  Store, 
  Layers, 
  Package, 
  LayoutGrid, 
  Hash, 
  ChevronRight,
  Database,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export default function AddOfflineStock() {
  const navigate = useNavigate();
  const location = useLocation();

  const editStock = location.state?.stock || null;
  const isEdit = !!editStock;

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [form, setForm] = useState({
    categoryId: "",
    subCategoryId: "",
    productId: "",
    variantLabel: "",
    quantity: ""
  });

  const [loading, setLoading] = useState(false);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
  }, []);

  /* ================= LOAD SUBCATEGORIES ================= */
  useEffect(() => {
    if (!form.categoryId) return;
    api.get(`/subcategories/by-category/${form.categoryId}`)
      .then(res => setSubcategories(res.data));
  }, [form.categoryId]);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    if (!form.categoryId) return;
    let url = `/products/category/${form.categoryId}`;
    if (form.subCategoryId) url += `/subcategory/${form.subCategoryId}`;
    api.get(url).then(res => setProducts(res.data));
  }, [form.categoryId, form.subCategoryId]);

  /* ================= LOAD VARIANTS ================= */
  useEffect(() => {
    if (!form.productId) return;
    api.get(`/products/${form.productId}`)
      .then(res => setVariants(res.data?.variants || []));
  }, [form.productId]);

  /* ================= PREFILL EDIT DATA ================= */
  useEffect(() => {
    if (!editStock) return;

    setForm({
      categoryId: String(editStock.categoryId),
      subCategoryId: editStock.subCategoryId ? String(editStock.subCategoryId) : "",
      productId: String(editStock.productId),
      variantLabel: editStock.variantLabel || "",
      quantity: String(editStock.quantity),
    });

    setSelectedCategory({ id: editStock.categoryId, name: editStock.categoryName });
    setSelectedSubCategory(editStock.subCategoryId ? { id: editStock.subCategoryId, name: editStock.subCategoryName } : null);
    setSelectedProduct({ id: editStock.productId, name: editStock.productName });
  }, [editStock]);

  /* ================= AUTO-SELECT VARIANT ON EDIT ================= */
  useEffect(() => {
    if (isEdit && form.variantLabel && variants.length > 0) {
      const match = variants.find(v => 
        v.weightLabel === form.variantLabel || 
        form.variantLabel.includes(v.weightLabel) ||
        v.weightLabel.includes(form.variantLabel)
      );
      if (match && form.variantLabel !== match.weightLabel) {
        setForm(prev => ({ ...prev, variantLabel: match.weightLabel }));
      }
    }
  }, [isEdit, form.variantLabel, variants]);

  /* ================= SUBMIT ================= */
  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      categoryId: selectedCategory?.id,
      categoryName: selectedCategory?.name,
      subCategoryId: selectedSubCategory?.id || null,
      subCategoryName: selectedSubCategory?.name || null,
      productId: selectedProduct?.id || form.productId,
      productName: selectedProduct?.name || products.find(p => p.id === Number(form.productId))?.name || "",
      variantLabel: form.variantLabel,
      quantity: Number(form.quantity)
    };

    try {
      if (isEdit) {
        await offlineInventoryApi.put(`/${editStock.id}`, payload);
      } else {
        await offlineInventoryApi.post("/", payload);
      }
      navigate("/admin/offline-inventory");
    } catch (err) {
      console.error("OFFLINE SAVE ERROR:", err);
      alert("Failed to save offline stock record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/admin/offline-inventory")}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 group"
      >
        <div className="p-2 rounded-xl group-hover:bg-slate-100 transition-colors">
          <ArrowLeft size={20} />
        </div>
        <span className="font-bold text-sm tracking-tight">Return to Registry</span>
      </button>

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[1.5rem] shadow-sm">
            <Store size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isEdit ? "Update Inventory Record" : "Physical Stock Entry"}
            </h1>
            <p className="text-slate-500 font-medium italic mt-1">Manual stock adjustment for physical outlets</p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-8">
        {/* STEP 1: CATALOG MAPPING */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
             <Database size={80} />
           </div>
           
           <div className="flex items-center gap-3 mb-8">
             <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">01</div>
             <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Catalog Mapping</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                 <Layers size={12} /> Master Category
               </label>
               <select
                 value={form.categoryId}
                 disabled={isEdit}
                 onChange={(e) => {
                   const val = e.target.value;
                   setSelectedCategory(categories.find(c => c.id === Number(val)));
                   setForm({ ...form, categoryId: val, subCategoryId: "", productId: "" });
                 }}
                 className="input h-14 font-bold text-slate-800 disabled:opacity-50"
                 required
               >
                 <option value="">Select Root Classification</option>
                 {categories.map(c => (
                   <option key={c.id} value={c.id}>{c.name}</option>
                 ))}
               </select>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                 <LayoutGrid size={12} /> Sub-Classification
               </label>
               <select
                 value={form.subCategoryId}
                 disabled={isEdit || !form.categoryId}
                 onChange={(e) => {
                   const val = e.target.value;
                   setSelectedSubCategory(subcategories.find(s => s.id === Number(val)));
                   setForm({ ...form, subCategoryId: val, productId: "" });
                 }}
                 className="input h-14 font-bold text-slate-800 disabled:opacity-50"
               >
                 <option value="">Select Sub-Type</option>
                 {subcategories.map(s => (
                   <option key={s.id} value={s.id}>{s.name}</option>
                 ))}
               </select>
             </div>
           </div>
        </div>

        {/* STEP 2: PRODUCT & VARIANT DETAILS */}
        <div className={`glass-card p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group transition-all ${!form.categoryId ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
           <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
             <Package size={80} />
           </div>
           
           <div className="flex items-center gap-3 mb-8">
             <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">02</div>
             <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Product Entity</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                 <Package size={12} /> Base SKU
               </label>
               <select
                 value={form.productId}
                 disabled={isEdit || !form.categoryId}
                 onChange={(e) => {
                   const val = e.target.value;
                   setSelectedProduct(products.find(p => p.id === Number(val)));
                   setForm({ ...form, productId: val });
                 }}
                 className="input h-14 font-bold text-slate-800 disabled:opacity-50"
                 required
               >
                 <option value="">Select Target Product</option>
                 {products.map(p => (
                   <option key={p.id} value={p.id}>{p.name}</option>
                 ))}
               </select>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                 <LayoutGrid size={12} /> Variant Profile
               </label>
               <select
                 value={form.variantLabel}
                 disabled={isEdit || !form.productId}
                 onChange={(e) => setForm({ ...form, variantLabel: e.target.value })}
                 className="input h-14 font-bold text-slate-800 disabled:opacity-50"
                 required
               >
                 <option value="">Select Active Variant</option>
                 {variants.map((v: any) => (
                   <option key={v.id} value={v.weightLabel}>{v.weightLabel}</option>
                 ))}
               </select>
             </div>
           </div>
        </div>

        {/* STEP 3: STOCK LOGISTICS */}
        <div className={`glass-card p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group transition-all ${!form.productId ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
           <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
             <Hash size={80} />
           </div>
           
           <div className="flex items-center gap-3 mb-8">
             <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">03</div>
             <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Stock Logistics</h2>
           </div>

           <div className="space-y-6">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                 <Hash size={12} /> Physical Unit Count
               </label>
               <div className="relative">
                 <input
                   type="number"
                   placeholder="Enter total units available"
                   value={form.quantity}
                   onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                   className="input h-16 text-xl font-black text-emerald-600 pl-6"
                   required
                 />
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-300">
                    <span className="text-[10px] font-black uppercase tracking-widest">Units</span>
                 </div>
               </div>
             </div>

             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                <AlertCircle className="text-slate-400 mt-0.5" size={18} />
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                  Entering offline stock manually will bypass online reservation rules. Ensure physical counts are verified.
                </p>
             </div>
           </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white rounded-[2.5rem] py-6 font-black text-lg shadow-2xl hover:bg-black transition-all group flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <ShieldCheck className="group-hover:scale-110 transition-transform" size={24} />
          {isEdit ? "COMMIT UPDATE" : "AUTHORIZE STOCK ENTRY"}
          <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
        </button>
      </form>
    </div>
  );
}