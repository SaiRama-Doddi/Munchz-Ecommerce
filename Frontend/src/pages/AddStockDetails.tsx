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

  /* ================= LOAD MASTER DATA ================= */

  useEffect(() => {
    api.get("/product/api/categories").then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!form.categoryId) return;
    api.get(`/product/api/subcategories/by-category/${form.categoryId}`)
      .then(res => setSubcategories(res.data));
  }, [form.categoryId]);

  useEffect(() => {
    if (!form.categoryId) return;
    let url = `/product/api/products/category/${form.categoryId}`;
    if (form.subCategoryId) url += `/product/api/subcategory/${form.subCategoryId}`;
    api.get(url).then(res => setProducts(res.data));
  }, [form.categoryId, form.subCategoryId]);

  /* ================= PREFILL EDIT DATA ================= */

  useEffect(() => {
    if (!editData) return;

    setForm({
      categoryId: editData.categoryId,
      subCategoryId: editData.subCategoryId,
      productId: editData.productId,

      supplierName: editData.supplierName,
      supplierGst: editData.supplierGst,

      quantity: editData.quantity,
      purchasePrice: editData.purchasePrice,
      sellingPrice: editData.sellingPrice,

      stockInDate: editData.stockInDate,
      expiryDate: editData.expiryDate,
      remarks: editData.remarks
    });

    setSelectedCategory({
      id: editData.categoryId,
      name: editData.categoryName
    });

    setSelectedSubCategory({
      id: editData.subCategoryId,
      name: editData.subCategoryName
    });

    setSelectedProduct({
      id: editData.productId,
      name: editData.productName
    });
  }, [editData]);

  /* ================= SUBMIT ================= */

  const submit = async (e: any) => {
    e.preventDefault();

    const payload = {
      categoryId: selectedCategory?.id,
      categoryName: selectedCategory?.name,

      subCategoryId: selectedSubCategory?.id,
      subCategoryName: selectedSubCategory?.name,

      productId: selectedProduct?.id,
      productName: selectedProduct?.name,

      supplierName: form.supplierName,
      supplierGst: form.supplierGst,

      quantity: Number(form.quantity),
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),

      stockInDate: form.stockInDate,
      expiryDate: form.expiryDate,

      remarks: form.remarks
    };

    try {
      if (isEdit) {
        await inventoryApi.put(`/stock/api/inventory/entries/${editData.id}`, payload);
        alert("Stock updated successfully");
      } else {
        await inventoryApi.post("/stock/api/inventory/entries", payload);
        alert("Stock added successfully");
      }

      navigate("/adminStockDetails");
    } catch (err) {
      alert("Failed to save stock");
    }
  };

 return (
  <div className="max-w-6xl mx-auto mt-10 bg-white rounded-2xl shadow-md px-10 py-8">

    <h2 className="text-2xl font-semibold mb-8 border-b pb-4">
      {isEdit ? "Update Stock Entry" : "Add Stock Entry"}
    </h2>

    <form onSubmit={submit} className="space-y-10">

      {/* ROW 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <select
          className="border-b border-gray-300 pb-2 focus:outline-none focus:border-green-600"
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

        <select
          className="border-b border-gray-300 pb-2 focus:outline-none focus:border-green-600"
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

        <select
          className="border-b border-gray-300 pb-2 focus:outline-none focus:border-green-600"
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
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <input
          className="border-b border-gray-300 pb-2 focus:outline-none focus:border-green-600 placeholder-gray-400"
          placeholder="Supplier Name"
          value={form.supplierName}
          onChange={e => setForm({ ...form, supplierName: e.target.value })}
        />

        <input
          className="border-b border-gray-300 pb-2 focus:outline-none focus:border-green-600 placeholder-gray-400"
          placeholder="Supplier GST"
          value={form.supplierGst}
          onChange={e => setForm({ ...form, supplierGst: e.target.value })}
        />
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <input
          type="number"
          className="border-b border-gray-300 pb-2 focus:outline-none focus:border-green-600 placeholder-gray-400"
          placeholder="Quantity"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
        />

        <input
          type="number"
          className="border-b border-gray-300 pb-2 focus:outline-none focus:border-green-600 placeholder-gray-400"
          placeholder="Purchase Price"
          value={form.purchasePrice}
          onChange={e => setForm({ ...form, purchasePrice: e.target.value })}
        />

        <input
          type="number"
          className="border-b border-gray-300 pb-2 focus:outline-none focus:border-green-600 placeholder-gray-400"
          placeholder="Selling Price"
          value={form.sellingPrice}
          onChange={e => setForm({ ...form, sellingPrice: e.target.value })}
        />
      </div>

      {/* ROW 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <input
          type="date"
          className="border-b border-gray-300 pb-2 focus:outline-none focus:border-green-600"
          value={form.stockInDate}
          onChange={e => setForm({ ...form, stockInDate: e.target.value })}
        />

        <input
          type="date"
          className="border-b border-gray-300 pb-2 focus:outline-none focus:border-green-600"
          value={form.expiryDate}
          onChange={e => setForm({ ...form, expiryDate: e.target.value })}
        />
      </div>

      {/* REMARKS */}
      <textarea
        className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-green-600 placeholder-gray-400 resize-none"
        placeholder="Remarks"
        value={form.remarks}
        onChange={e => setForm({ ...form, remarks: e.target.value })}
      />

      {/* BUTTON */}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold transition"
      >
        {isEdit ? "Update Stock" : "Save Stock"}
      </button>

    </form>
  </div>
);

}
