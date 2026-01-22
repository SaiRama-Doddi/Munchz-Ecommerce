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
    api.get(`/subcategories/by-category/${form.categoryId}`)
      .then(res => setSubcategories(res.data));
  }, [form.categoryId]);

  useEffect(() => {
    if (!form.categoryId) return;
    let url = `/products/category/${form.categoryId}`;
    if (form.subCategoryId) url += `/subcategory/${form.subCategoryId}`;
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
        await inventoryApi.put(`/inventory/entries/${editData.id}`, payload);
        alert("Stock updated successfully");
      } else {
        await inventoryApi.post("/inventory/entries", payload);
        alert("Stock added successfully");
      }

      navigate("/adminStockDetails");
    } catch (err) {
      alert("Failed to save stock");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow mt-8">

      <h2 className="text-2xl font-semibold mb-6 border-b pb-3">
        {isEdit ? "Update Stock Entry" : "Add Stock Entry"}
      </h2>

      <form onSubmit={submit} className="space-y-6">

        {/* Category */}
        <select className="input" value={form.categoryId}
          onChange={(e) => {
            const sel = categories.find(c => c.id === Number(e.target.value));
            setSelectedCategory(sel);
            setForm({ ...form, categoryId: e.target.value, subCategoryId: "", productId: "" });
          }}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* Subcategory */}
        <select className="input" value={form.subCategoryId}
          onChange={(e) => {
            const sel = subcategories.find(s => s.id === Number(e.target.value));
            setSelectedSubCategory(sel);
            setForm({ ...form, subCategoryId: e.target.value, productId: "" });
          }}>
          <option value="">Select Subcategory</option>
          {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        {/* Product */}
        <select className="input" value={form.productId}
          onChange={(e) => {
            const sel = products.find(p => p.id === Number(e.target.value));
            setSelectedProduct(sel);
            setForm({ ...form, productId: e.target.value });
          }}>
          <option value="">Select Product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <input className="input" placeholder="Supplier Name"
          value={form.supplierName}
          onChange={e => setForm({ ...form, supplierName: e.target.value })} />

        <input className="input" placeholder="Supplier GST"
          value={form.supplierGst}
          onChange={e => setForm({ ...form, supplierGst: e.target.value })} />

        <input className="input" type="number" placeholder="Quantity"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })} />

        <input className="input" type="number" placeholder="Purchase Price"
          value={form.purchasePrice}
          onChange={e => setForm({ ...form, purchasePrice: e.target.value })} />

        <input className="input" type="number" placeholder="Selling Price"
          value={form.sellingPrice}
          onChange={e => setForm({ ...form, sellingPrice: e.target.value })} />

        <input className="input" type="date"
          value={form.stockInDate}
          onChange={e => setForm({ ...form, stockInDate: e.target.value })} />

        <input className="input" type="date"
          value={form.expiryDate}
          onChange={e => setForm({ ...form, expiryDate: e.target.value })} />

        <textarea
          className="input"
          placeholder="Remarks"
          value={form.remarks}
          onChange={e => setForm({ ...form, remarks: e.target.value })}
        />

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded">
          {isEdit ? "Update Stock" : "Save Stock"}
        </button>
      </form>
    </div>
  );
}
