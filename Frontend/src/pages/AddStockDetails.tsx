import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/client";
import inventoryApi from "../api/inventoryApi";

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
    remarks: ""
  });

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

  /* ================= PREFILL EDIT ================= */
  useEffect(() => {
    if (!editData) return;

    setForm(editData);
    setSelectedCategory({ id: editData.categoryId, name: editData.categoryName });
    setSelectedSubCategory({ id: editData.subCategoryId, name: editData.subCategoryName });
    setSelectedProduct({ id: editData.productId, name: editData.productName });
  }, [editData]);

  /* ================= SUBMIT ================= */
  const submit = async (e: any) => {
    e.preventDefault();
const payload = {
  ...form,   // spread first

  categoryId: selectedCategory?.id,
  categoryName: selectedCategory?.name,

  subCategoryId: selectedSubCategory?.id,
  subCategoryName: selectedSubCategory?.name,

  productId: selectedProduct?.id,
  productName: selectedProduct?.name,

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
      navigate("/adminStockDetails");
    } catch {
      alert("Failed to save stock");
    }
  };

  const inputStyle =
    "w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10">

        <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
          {isEdit ? "Update Stock Entry" : "Add Stock Entry"}
        </h2>

        <form onSubmit={submit} className="grid md:grid-cols-2 gap-6">

          {/* CATEGORY */}
          <select
            className={inputStyle}
            value={form.categoryId}
            onChange={(e) => {
              const sel = categories.find(c => c.id === Number(e.target.value));
              setSelectedCategory(sel);
              setForm({ ...form, categoryId: e.target.value, subCategoryId: "", productId: "" });
            }}
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* SUBCATEGORY */}
          <select
            className={inputStyle}
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

          {/* PRODUCT */}
          <select
            className={inputStyle}
            value={form.productId}
            onChange={(e) => {
              const sel = products.find(p => p.id === Number(e.target.value));
              setSelectedProduct(sel);
              setForm({ ...form, productId: e.target.value });
            }}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <input
            className={inputStyle}
            placeholder="Supplier Name"
            value={form.supplierName}
            onChange={e => setForm({ ...form, supplierName: e.target.value })}
          />

          <input
            className={inputStyle}
            placeholder="Supplier GST"
            value={form.supplierGst}
            onChange={e => setForm({ ...form, supplierGst: e.target.value })}
          />

          <input
            type="number"
            className={inputStyle}
            placeholder="Quantity"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
          />

          <input
            type="number"
            className={inputStyle}
            placeholder="Purchase Price"
            value={form.purchasePrice}
            onChange={e => setForm({ ...form, purchasePrice: e.target.value })}
          />

          <input
            type="number"
            className={inputStyle}
            placeholder="Selling Price"
            value={form.sellingPrice}
            onChange={e => setForm({ ...form, sellingPrice: e.target.value })}
          />

        {/* DATE SECTION */}
<div className="grid md:grid-cols-2 gap-6">

  {/* STOCK IN DATE */}
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      Stock In Date (Purchase Date)
    </label>
    <input
      type="date"
      value={form.stockInDate}
      onChange={e => setForm({ ...form, stockInDate: e.target.value })}
      className="w-full rounded-xl border border-gray-300 px-4 py-3
                 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none"
    />
    <p className="text-xs text-gray-400">
      Date when stock entered into inventory
    </p>
  </div>

  {/* EXPIRY DATE */}
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      Expiry Date (Product Valid Until)
    </label>
    <input
      type="date"
      value={form.expiryDate}
      onChange={e => setForm({ ...form, expiryDate: e.target.value })}
      className="w-full rounded-xl border border-gray-300 px-4 py-3
                 focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none"
    />
    <p className="text-xs text-gray-400">
      Last usable date of the product
    </p>
  </div>

</div>


          <textarea
            className={`${inputStyle} md:col-span-2`}
            placeholder="Remarks"
            value={form.remarks}
            onChange={e => setForm({ ...form, remarks: e.target.value })}
          />

          <button className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:scale-[1.02] transition">
            {isEdit ? "Update Stock Entry" : "Save Stock Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}