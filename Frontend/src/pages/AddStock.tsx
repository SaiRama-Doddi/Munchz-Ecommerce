import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import inventoryApi from "../api/inventoryApi";
import { 
  ArrowLeft, 
  Layers, 
  Package, 
  Tag, 
  Hash, 
  Save, 
  ChevronRight,
  Info
} from "lucide-react";

export default function AddStock() {
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
    variant: "",
    quantity: ""
  });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!editStock) return;

    setForm({
      categoryId: String(editStock.categoryId || ""),
      subCategoryId: editStock.subCategoryId ? String(editStock.subCategoryId) : "",
      productId: String(editStock.productId || ""),
      variant: editStock.variantLabel || editStock.variant || "",
      quantity: String(editStock.quantity || 0)
    });

    setSelectedCategory(categories.find(c => c.id === Number(editStock.categoryId)));
    setSelectedSubCategory(editStock.subCategoryId 
      ? { id: editStock.subCategoryId, name: editStock.subCategoryName }
      : null
    );
    setSelectedProduct({ id: editStock.productId, name: editStock.productName });
  }, [editStock, categories]);

  /* ================= AUTO-SELECT VARIANT ON EDIT ================= */
  useEffect(() => {
    if (isEdit && form.variant && variants.length > 0) {
      const match = variants.find(v => 
        v.weightLabel === form.variant || 
        form.variant.includes(v.weightLabel) ||
        v.weightLabel.includes(form.variant)
      );
      if (match && form.variant !== match.weightLabel) {
        setForm(prev => ({ ...prev, variant: match.weightLabel }));
      }
    }
  }, [isEdit, form.variant, variants]);

  /* ================= FALLBACK: AUTO-SELECT FIRST IF ONLY ONE ================= */
  useEffect(() => {
    if (!isEdit && variants.length === 1 && !form.variant) {
      setForm(prev => ({ ...prev, variant: variants[0].weightLabel }));
    }
  }, [variants, isEdit, form.variant]);

  useEffect(() => {
    if (!form.categoryId) return;
    api.get(`/subcategories/by-category/${form.categoryId}`)
      .then(res => setSubcategories(res.data));
  }, [form.categoryId]);

  useEffect(() => {
    if (!form.categoryId) return;
    let url = `/products/category/${form.categoryId}`;
    if (form.subCategoryId) url += `/subcategory/${form.subCategoryId}`;
    api.get(url).then(res => setProducts(res.data));
  }, [form.categoryId, form.subCategoryId]);

  useEffect(() => {
    if (!form.productId) return;
    api.get(`/products/${form.productId}`)
      .then(res => setVariants(res.data?.variants || []));
  }, [form.productId]);

  /* ================= SUBMIT ================= */

  const submit = async (e: any) => {
    e.preventDefault();

    if (!selectedCategory || !selectedProduct || !form.quantity) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      subCategoryId: selectedSubCategory?.id || null,
      subCategoryName: selectedSubCategory?.name || null,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variant: form.variant,
      quantity: Number(form.quantity)
    };

    try {
      if (isEdit) {
        await inventoryApi.put(`/inventory/${editStock.id}`, payload);
      } else {
        await inventoryApi.post("/inventory/add", payload);
      }
      alert("Stock Saved Successfully");
      navigate("/admin/inventory");
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Failed to save stock");
    }
  };

  return (
    <div className="space-y-10 pb-12 max-w-4xl mx-auto bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:text-black hover:border-gray-200 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            {isEdit ? "Update Stock" : "Inventory Restock"}
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage physical product availability</p>
        </div>
      </div>

      <form onSubmit={submit} className="bg-white border border-gray-100 rounded-[2.5rem] p-10 space-y-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          
          {/* CATEGORY SELECTION */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 mb-1">
              <Layers size={14} className="text-emerald-500" />
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Category</label>
            </div>
            <select
              value={form.categoryId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(categories.find(c => c.id === Number(val)));
                setForm({ ...form, categoryId: val, subCategoryId: "", productId: "" });
              }}
              className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14"
              required
            >
              <option value="">Choose Category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* SUBCATEGORY SELECTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <ChevronRight size={14} className="text-emerald-500" />
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subcategory</label>
            </div>
            <select
              value={form.subCategoryId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedSubCategory(subcategories.find(s => s.id === Number(val)));
                setForm({ ...form, subCategoryId: val, productId: "" });
              }}
              disabled={!form.categoryId}
              className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14 disabled:opacity-50"
            >
              <option value="">Choose Subcategory...</option>
              {subcategories.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* PRODUCT SELECTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Package size={14} className="text-emerald-500" />
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Product</label>
            </div>
            <select
              value={form.productId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedProduct(products.find(p => p.id === Number(val)));
                setForm({ ...form, productId: val });
              }}
              disabled={!form.categoryId}
              className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14 disabled:opacity-50"
              required
            >
              <option value="">Choose Product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* VARIANT SELECTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Tag size={14} className="text-emerald-500" />
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weight Variant</label>
            </div>
            <select
              value={form.variant}
              onChange={(e) => setForm({ ...form, variant: e.target.value })}
              disabled={!form.productId}
              className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14 disabled:opacity-50"
              required
            >
              <option value="">Choose Variant...</option>
              {variants.map((v: any) => (
                <option key={v.id} value={v.weightLabel}>
                  {v.weightLabel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* QUANTITY SECTION */}
        <div className="pt-8 border-t border-gray-100 relative">
          <div className="flex items-center gap-2 mb-6">
            <Hash size={18} className="text-emerald-600" />
            <h3 className="text-sm font-black text-black uppercase tracking-widest">Stock Adjustment</h3>
          </div>
          <div className="relative">
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="e.g. 50"
              className="w-full bg-gray-50 border border-transparent rounded-3xl pl-12 pr-6 py-6 text-3xl font-black text-emerald-600 outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-inner h-20"
              required
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xl">#</div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
            <Info size={16} className="text-emerald-500 shrink-0" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              This will {isEdit ? "overwrite" : "add to"} the current stock for this variant.
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-10 flex flex-col md:flex-row gap-4 relative">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-3 bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/5 hover:bg-emerald-600 transition-all duration-300"
          >
            <Save size={18} />
            {isEdit ? "Confirm Update" : "Confirm Stock Entry"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all duration-300"
          >
            Discard & Go Back
          </button>
        </div>
      </form>
    </div>
  );
}
