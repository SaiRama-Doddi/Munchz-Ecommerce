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
    <div className="space-y-10 pb-12 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-emerald-500 hover:border-emerald-100 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEdit ? "Update Stock" : "Inventory Restock"}
          </h1>
          <p className="text-slate-500 font-medium">Manage physical product availability</p>
        </div>
      </div>

      <form onSubmit={submit} className="glass-card rounded-[2.5rem] p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CATEGORY SELECTION */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 mb-1">
              <Layers size={14} className="text-emerald-500" />
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Main Category</label>
            </div>
            <select
              value={form.categoryId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(categories.find(c => c.id === Number(val)));
                setForm({ ...form, categoryId: val, subCategoryId: "", productId: "" });
              }}
              className="input h-14"
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Subcategory</label>
            </div>
            <select
              value={form.subCategoryId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedSubCategory(subcategories.find(s => s.id === Number(val)));
                setForm({ ...form, subCategoryId: val, productId: "" });
              }}
              disabled={!form.categoryId}
              className="input h-14"
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Product</label>
            </div>
            <select
              value={form.productId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedProduct(products.find(p => p.id === Number(val)));
                setForm({ ...form, productId: val });
              }}
              disabled={!form.categoryId}
              className="input h-14"
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Weight Variant</label>
            </div>
            <select
              value={form.variant}
              onChange={(e) => setForm({ ...form, variant: e.target.value })}
              disabled={!form.productId}
              className="input h-14"
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
        <div className="pt-8 border-t border-slate-50">
          <div className="flex items-center gap-2 mb-4">
            <Hash size={18} className="text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-800">Stock Adjustment</h3>
          </div>
          <div className="relative group">
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="e.g. 50"
              className="input h-16 text-2xl font-black text-emerald-600 pl-8"
              required
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">#</div>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-400 flex items-center gap-2">
            <Info size={14} /> This will {isEdit ? "overwrite" : "add to"} the current stock for this variant.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="pt-6 flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-3 bg-accent-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-300"
          >
            <Save size={18} />
            {isEdit ? "Confirm Update" : "Confirm Stock Entry"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all duration-300"
          >
            Discard & Go Back
          </button>
        </div>
      </form>
    </div>
  );
}
