import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/client";
import inventoryApi from "../api/inventoryApi";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CircleDollarSign, 
  Calendar, 
  FileText,
  ChevronRight,
  Info,
  Layers,
  Hash,
  Save,
  Tag
} from "lucide-react";

export default function AddStockEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.stock || null;
  const isEdit = Boolean(editData);

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [form, setForm] = useState({
    categoryId: "",
    subCategoryId: "",
    productId: "",
    supplierName: "",
    supplierGst: "",
    quantity: "",
    purchasePrice: "",
    sellingPrice: "",
    stockInDate: "",
    expiryDate: "",
    remarks: "",
    variantId: ""
  });

  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
  }, []);

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

  /* ================= LOAD VARIANTS ================= */
  useEffect(() => {
    if (!form.productId) {
      setVariants([]);
      return;
    }
    const prod = products.find(p => p.id === Number(form.productId));
    if (prod && prod.variants) {
      setVariants(prod.variants);
    } else {
      // Fallback: fetch single product if variants not in list
      api.get(`/products/${form.productId}`).then(res => {
        setVariants(res.data?.variants || []);
      });
    }
  }, [form.productId, products]);

  /* ================= PREFILL EDIT ================= */
  useEffect(() => {
    if (!editData) return;

    setForm({
      categoryId: String(editData.categoryId || ""),
      subCategoryId: editData.subCategoryId ? String(editData.subCategoryId) : "",
      productId: String(editData.productId || ""),
      supplierName: editData.supplierName || "",
      supplierGst: editData.supplierGst || "",
      quantity: String(editData.quantity || 0),
      purchasePrice: String(editData.purchasePrice || 0),
      sellingPrice: String(editData.sellingPrice || 0),
      stockInDate: editData.stockInDate || "",
      expiryDate: editData.expiryDate || "",
      remarks: editData.remarks || "",
      variantId: String(editData.variantId || "")
    });

    setSelectedCategory({ id: editData.categoryId, name: editData.categoryName });
    setSelectedSubCategory({ id: editData.subCategoryId, name: editData.subCategoryName });
    setSelectedProduct({ id: editData.productId, name: editData.productName });
  }, [editData]);

  /* ================= AUTO-SELECT VARIANT ON EDIT ================= */
  useEffect(() => {
    if (isEdit && form.variantId && variants.length > 0) {
      const v = variants.find(v => v.id === Number(form.variantId));
      if (v) setSelectedVariant(v);
    }
  }, [isEdit, form.variantId, variants]);

  /* ================= SUBMIT ================= */
  const submit = async (e: any) => {
    e.preventDefault();
    const payload = {
      ...form,
      categoryId: selectedCategory?.id,
      categoryName: selectedCategory?.name,
      subCategoryId: selectedSubCategory?.id,
      subCategoryName: selectedSubCategory?.name,
      productId: selectedProduct?.id,
      productName: selectedProduct?.name,
      variantId: selectedVariant?.id || form.variantId,
      variantLabel: selectedVariant?.weightLabel || variants.find(v => v.id === Number(form.variantId))?.weightLabel || "",
      quantity: Number(form.quantity),
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),
    };

    try {
      if (isEdit) {
        await inventoryApi.put(`/inventory/entries/${editData.id}`, payload);
      } else {
        await inventoryApi.post("/inventory/entries", payload);
      }
      alert("Stock Saved Successfully");
      navigate("/admin/stock-details");
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Failed to save stock");
    }
  };

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-black hover:border-gray-200 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-right">
          <h1 className="text-2xl text-black uppercase">
            {isEdit ? "Update Logistics" : "Logistics Entry"}
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Batch Record Management</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PRODUCT INFO */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* SECTION 1: CORE PRODUCT MAPPING */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="p-2.5 bg-gray-50 text-black rounded-xl">
                <Package size={20} />
              </div>
              <h2 className="text-xl text-black uppercase">Product Selection</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Parent Category</label>
                <select
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14"
                  value={form.categoryId}
                  onChange={(e) => {
                    const sel = categories.find(c => c.id === Number(e.target.value));
                    setSelectedCategory(sel);
                    setForm({ ...form, categoryId: e.target.value, subCategoryId: "", productId: "" });
                  }}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Sub Classification</label>
                <select
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14"
                  value={form.subCategoryId}
                  onChange={(e) => {
                    const sel = subcategories.find(s => s.id === Number(e.target.value));
                    setSelectedSubCategory(sel);
                    setForm({ ...form, subCategoryId: e.target.value, productId: "" });
                  }}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Item Reference</label>
                <select
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14"
                  value={form.productId}
                  onChange={(e) => {
                    const sel = products.find(p => p.id === Number(e.target.value));
                    setSelectedProduct(sel);
                    setForm({ ...form, productId: e.target.value });
                  }}
                  required
                >
                  <option value="">Select Item</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Active Variant</label>
                <select
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14 disabled:opacity-50"
                  value={form.variantId}
                  onChange={(e) => {
                    const sel = variants.find(v => v.id === Number(e.target.value));
                    setSelectedVariant(sel);
                    setForm({ ...form, variantId: e.target.value });
                  }}
                  disabled={!form.productId}
                  required
                >
                  <option value="">Select Weight/Type</option>
                  {variants.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.weightLabel} (₹{v.offerPrice})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: SUPPLIER LEDGER */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Truck size={20} />
              </div>
              <h2 className="text-xl text-black uppercase">Supply Chain Info</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Vendor/Supplier Name</label>
                <input
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14"
                  placeholder="e.g. Premium Wholesalers"
                  value={form.supplierName}
                  onChange={e => setForm({ ...form, supplierName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Business Registration (GST)</label>
                <input
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14 uppercase"
                  placeholder="GSTIN Number"
                  value={form.supplierGst}
                  onChange={e => setForm({ ...form, supplierGst: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: FINANCIALS & QUANTITY */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-black text-white rounded-xl">
                <CircleDollarSign size={20} />
              </div>
              <h2 className="text-xl text-black uppercase">Inventory Metrics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Receiving Qty</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-5 py-4 text-xl text-black placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14"
                    placeholder="0"
                    value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: e.target.value })}
                    required
                  />
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Purchase Cost</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-5 py-4 text-sm placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14"
                    placeholder="0.00"
                    value={form.purchasePrice}
                    onChange={e => setForm({ ...form, purchasePrice: e.target.value })}
                    required
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg">₹</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Market Listing Price</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-5 py-4 text-sm text-emerald-600 placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14"
                    placeholder="0.00"
                    value={form.sellingPrice}
                    onChange={e => setForm({ ...form, sellingPrice: e.target.value })}
                    required
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200 text-lg">₹</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TIMELINE & ACTIONS */}
        <div className="space-y-8">
          
          {/* LOGISTICS TIMELINE */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-gray-50 text-black rounded-xl border border-gray-100">
                <Calendar size={20} />
              </div>
              <h2 className="text-xl text-black uppercase">Timeline</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Stock Inbound Date</label>
                <input
                  type="date"
                  value={form.stockInDate}
                  onChange={e => setForm({ ...form, stockInDate: e.target.value })}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-emerald-500 transition-all h-14"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase ml-1">Shelf Life Expiry</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-black transition-all h-14"
                />
              </div>
            </div>
          </div>

          {/* INTERNAL REMARKS */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-50 text-gray-400 rounded-lg">
                <FileText size={18} />
              </div>
              <h3 className="text-[10px] text-gray-400 uppercase">Internal Notes</h3>
            </div>
            <textarea
              className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all min-h-[120px] resize-none"
              placeholder="e.g. Batch inspected for quality..."
              value={form.remarks}
              onChange={e => setForm({ ...form, remarks: e.target.value })}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-black text-white py-6 rounded-3xl text-[10px] uppercase shadow-2xl shadow-black/5 hover:bg-emerald-600 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
          >
            <Save size={20} />
            <span>{isEdit ? "Update Logistics Record" : "Finalize Stock Record"}</span>
          </button>
          
          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex gap-4">
            <Info size={20} className="text-emerald-500 shrink-0 mt-1" />
            <p className="text-[10px] text-gray-400 uppercase leading-relaxed">
              Updating these records will affect your global inventory levels and profit calculations. Ensure data accuracy.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}