import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import inventoryApi from "../api/inventoryApi";

export default function AddStock() {
  const navigate = useNavigate();

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
    quantity: "",
  });

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  /* ================= LOAD SUBCATEGORIES ================= */
  useEffect(() => {
    if (!form.categoryId) return;

    api.get(`/subcategories/by-category/${form.categoryId}`)
      .then(res => setSubcategories(res.data))
      .catch(() => setSubcategories([]));
  }, [form.categoryId]);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    if (!form.categoryId) return;

    let url = `/products/category/${form.categoryId}`;
    if (form.subCategoryId) {
      url += `/subcategory/${form.subCategoryId}`;
    }

    api.get(url)
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, [form.categoryId, form.subCategoryId]);

  /* ================= LOAD VARIANTS ================= */
  useEffect(() => {
    if (!form.productId) return;

    api.get(`/products/${form.productId}`)
      .then(res => setVariants(res.data?.variants || []))
      .catch(() => setVariants([]));
  }, [form.productId]);

  /* ================= SUBMIT ================= */
  const submit = async (e: any) => {
    e.preventDefault();

    if (!selectedCategory || !selectedProduct || !form.variant || !form.quantity) {
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
      quantity: Number(form.quantity),
    };

    try {
      await inventoryApi.post("/inventory/add", payload);
      alert("Stock added successfully");
      navigate("/inventory");
    } catch (err) {
      console.error(err);
      alert("Failed to add stock");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h1 className="text-2xl font-semibold mb-6">Add Stock</h1>

      <form onSubmit={submit} className="space-y-4">

        {/* CATEGORY */}
        <select
          className="border p-2 rounded w-full"
          value={form.categoryId}
          onChange={(e) => {
            const selected = categories.find(c => c.id === Number(e.target.value));
            setSelectedCategory(selected);
            setSelectedSubCategory(null);
            setSelectedProduct(null);

            setForm({
              categoryId: e.target.value,
              subCategoryId: "",
              productId: "",
              variant: "",
              quantity: ""
            });
          }}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* SUBCATEGORY */}
        <select
          className="border p-2 rounded w-full"
          value={form.subCategoryId}
          onChange={(e) => {
            const selected = subcategories.find(s => s.id === Number(e.target.value));
            setSelectedSubCategory(selected);

            setForm(prev => ({
              ...prev,
              subCategoryId: e.target.value,
              productId: "",
              variant: ""
            }));
          }}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* PRODUCT */}
        <select
          className="border p-2 rounded w-full"
          value={form.productId}
          onChange={(e) => {
            const selected = products.find(p => p.id === Number(e.target.value));
            setSelectedProduct(selected);

            setForm(prev => ({
              ...prev,
              productId: e.target.value,
              variant: ""
            }));
          }}
        >
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* VARIANT */}
        <select
          className="border p-2 rounded w-full"
          value={form.variant}
          onChange={(e) => setForm(prev => ({ ...prev, variant: e.target.value }))}
        >
          <option value="">Select Variant</option>
          {variants.map((v: any) => (
            <option key={v.id} value={v.weightLabel}>
              {v.weightLabel}
            </option>
          ))}
        </select>

        {/* QUANTITY */}
        <input
          type="number"
          min="1"
          className="border p-2 rounded w-full"
          value={form.quantity}
          onChange={(e) => setForm(prev => ({ ...prev, quantity: e.target.value }))}
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded w-full"
        >
          Add Stock
        </button>
      </form>
    </div>
  );
}
