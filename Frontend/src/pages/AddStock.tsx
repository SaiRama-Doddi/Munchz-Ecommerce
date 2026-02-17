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

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
  }, []);

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
      navigate("/inventory");
    } catch (err) {
      alert("Failed to save stock");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
    <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-12">

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900">
          {isEdit ? "Update Inventory Stock" : "Add Inventory Stock"}
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Manage stock by selecting category, product and variant
        </p>
      </div>

      <form onSubmit={submit} className="space-y-10">

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-10">

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
              className="w-full rounded-xl border border-gray-300 px-4 py-3
                         focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600
                         outline-none transition shadow-sm"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3
                         focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600
                         outline-none transition shadow-sm"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3
                         focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600
                         outline-none transition shadow-sm"
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
              value={form.variant}
              onChange={(e) => setForm({ ...form, variant: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3
                         focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600
                         outline-none transition shadow-sm"
            >
              <option value="">Select Variant</option>
              {variants.map((v: any) => (
                <option key={v.id} value={v.weightLabel}>
                  {v.weightLabel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* QUANTITY */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            placeholder="Enter stock quantity"
            className="w-full rounded-xl border border-gray-300 px-4 py-3
                       focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600
                       outline-none transition shadow-sm"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600
                     text-white font-semibold py-4 text-lg shadow-lg
                     hover:scale-[1.02] transition"
        >
          {isEdit ? "Update Stock" : "Add Stock"}
        </button>

      </form>
    </div>
  </div>
);

}