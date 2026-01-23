import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import inventoryApi from "../api/inventoryApi";

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

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    api.get("/product/api/categories").then(res => setCategories(res.data));
  }, []);

  /* ================= PREFILL (EDIT MODE) ================= */
  useEffect(() => {
    if (!editStock) return;

    setForm({
      categoryId: String(editStock.categoryId),
      subCategoryId: editStock.subCategoryId ? String(editStock.subCategoryId) : "",
      productId: String(editStock.productId),
      variant: editStock.variantLabel || "",
      quantity: String(editStock.quantity)
    });

    setSelectedCategory({
      id: editStock.categoryId,
      name: editStock.categoryName
    });

    setSelectedSubCategory(editStock.subCategoryId
      ? { id: editStock.subCategoryId, name: editStock.subCategoryName }
      : null
    );

    setSelectedProduct({
      id: editStock.productId,
      name: editStock.productName
    });
  }, [editStock]);

  /* ================= LOAD SUBCATEGORIES ================= */
  useEffect(() => {
    if (!form.categoryId) return;

    api.get(`/product/api/subcategories/by-category/${form.categoryId}`)
      .then(res => setSubcategories(res.data));
  }, [form.categoryId]);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    if (!form.categoryId) return;

    let url = `/product/api/products/category/${form.categoryId}`;
    if (form.subCategoryId) url += `/product/api/subcategory/${form.subCategoryId}`;

    api.get(url).then(res => setProducts(res.data));
  }, [form.categoryId, form.subCategoryId]);

  /* ================= LOAD VARIANTS ================= */
  useEffect(() => {
    if (!form.productId) return;

    api.get(`/product/api/products/${form.productId}`)
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
        await inventoryApi.put(`/stock/api/inventory/${editStock.id}`, payload);
      } else {
        await inventoryApi.post("/stock/api/inventory", payload);
      }

      navigate("/inventory");
    } catch (err) {
      console.error(err);
      alert("Failed to save stock");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? "Update Stock" : "Add Stock"}
      </h1>

      <form onSubmit={submit} className="space-y-4">

        <select value={form.categoryId} className="border p-2 rounded w-full"
          onChange={(e) => {
            const val = e.target.value;
            setSelectedCategory(categories.find(c => c.id === Number(val)));
            setForm({ ...form, categoryId: val, subCategoryId: "", productId: "" });
          }}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select value={form.subCategoryId} className="border p-2 rounded w-full"
          onChange={(e) => {
            const val = e.target.value;
            setSelectedSubCategory(subcategories.find(s => s.id === Number(val)));
            setForm({ ...form, subCategoryId: val, productId: "" });
          }}>
          <option value="">Select Subcategory</option>
          {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <select value={form.productId} className="border p-2 rounded w-full"
          onChange={(e) => {
            const val = e.target.value;
            setSelectedProduct(products.find(p => p.id === Number(val)));
            setForm({ ...form, productId: val });
          }}>
          <option value="">Select Product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select value={form.variant} className="border p-2 rounded w-full"
          onChange={(e) => setForm({ ...form, variant: e.target.value })}>
          <option value="">Select Variant</option>
          {variants.map((v: any) => (
            <option key={v.id} value={v.weightLabel}>{v.weightLabel}</option>
          ))}
        </select>

        <input
          type="number"
          className="border p-2 rounded w-full"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <button className="bg-green-600 hover:bg-green-700 text-white py-2 rounded w-full">
          {isEdit ? "Update Stock" : "Add Stock"}
        </button>
      </form>
    </div>
  );
}
