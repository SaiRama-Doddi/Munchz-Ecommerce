import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import offlineInventoryApi from "../api/offlineInventoryApi";

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

  /* =====================================================
     ⭐⭐⭐ THIS BLOCK WAS MISSING — PREFILL EDIT DATA ⭐⭐⭐
     ===================================================== */
  useEffect(() => {
    if (!editStock) return;

    setForm({
      categoryId: String(editStock.categoryId),
      subCategoryId: editStock.subCategoryId
        ? String(editStock.subCategoryId)
        : "",
      productId: String(editStock.productId),
      variantLabel: editStock.variantLabel || "",
      quantity: String(editStock.quantity),
    });

    setSelectedCategory({
      id: editStock.categoryId,
      name: editStock.categoryName,
    });

    setSelectedSubCategory(
      editStock.subCategoryId
        ? {
            id: editStock.subCategoryId,
            name: editStock.subCategoryName,
          }
        : null
    );

    setSelectedProduct({
      id: editStock.productId,
      name: editStock.productName,
    });
  }, [editStock]);
  /* ===================================================== */

  /* ================= SUBMIT ================= */
  const submit = async (e: any) => {
    e.preventDefault();

    const payload = {
      categoryId: selectedCategory?.id,
      categoryName: selectedCategory?.name,
      subCategoryId: selectedSubCategory?.id || null,
      subCategoryName: selectedSubCategory?.name || null,
      productId: selectedProduct?.id,
      productName: selectedProduct?.name,
      variantLabel: form.variantLabel,
      quantity: Number(form.quantity)
    };

    try {
      if (isEdit) {
        await offlineInventoryApi.put(`/offline-inventory/${editStock.id}`, payload);
      } else {
        await offlineInventoryApi.post("/offline-inventory", payload);
      }
      navigate("/offline-inventory");
    } catch {
      alert("Failed to save offline stock");
    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
    <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          {isEdit ? "Update Offline Stock" : "Add Offline Stock"}
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Manage offline inventory with category, product and variant selection
        </p>
      </div>

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-8">

        {/* CATEGORY */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Category
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCategory(categories.find(c => c.id === Number(val)));
              setForm({ ...form, categoryId: val, subCategoryId: "", productId: "" });
            }}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-4 focus:ring-blue-600/10"
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* SUBCATEGORY */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Subcategory
          </label>
          <select
            value={form.subCategoryId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSubCategory(subcategories.find(s => s.id === Number(val)));
              setForm({ ...form, subCategoryId: val, productId: "" });
            }}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* PRODUCT */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Product
          </label>
          <select
            value={form.productId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedProduct(products.find(p => p.id === Number(val)));
              setForm({ ...form, productId: val });
            }}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* VARIANT */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Variant
          </label>
          <select
            value={form.variantLabel}
            onChange={(e) =>
              setForm({ ...form, variantLabel: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          >
            <option value="">Select Variant</option>
            {variants.map((v: any) => (
              <option key={v.id} value={v.weightLabel}>
                {v.weightLabel}
              </option>
            ))}
          </select>
        </div>

        {/* QUANTITY */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Quantity
          </label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        {/* BUTTON */}
        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600
                       text-white font-semibold py-3 text-lg shadow-lg hover:scale-[1.02] transition"
          >
            {isEdit ? "Update Offline Stock" : "Add Offline Stock"}
          </button>
        </div>

      </form>
    </div>
  </div>
);

}