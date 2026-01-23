import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { useCategories } from "../hooks/useQueryHelpers";
import { useSubcategories } from "../hooks/useSubcategories";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: categories } = useCategories();
  const { subcategories, fetchSubcats } = useSubcategories();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    categoryId: "",
    subcategoryId: "",
    name: "",
    description: "",
    imageUrl: "",
    imageUrls: [] as string[],
    variants: [] as any[],
  });

  /* LOAD PRODUCT */
  useEffect(() => {
    loadProduct();
  }, [id]);

  /* FETCH SUBCATEGORIES */
  useEffect(() => {
    if (form.categoryId) {
      fetchSubcats(Number(form.categoryId));
    }
  }, [form.categoryId]);

  const loadProduct = async () => {
    try {
      const res = await api.get(`/product/api/products/${id}`);
      const p = res.data || {};

      const images =
        Array.isArray(p.imageUrls)
          ? p.imageUrls
          : Array.isArray(p.images)
          ? p.images.map((i: any) => i.imageUrl)
          : [];

      const variants = Array.isArray(p.variants) ? p.variants : [];

      setForm({
        categoryId: p.categoryId ? String(p.categoryId) : "",
        subcategoryId: p.subcategoryId ? String(p.subcategoryId) : "",
        name: p.name || "",
        description: p.description || "",
        imageUrl: p.imageUrl || "",
        imageUrls: images.length ? images : [""],
        variants: variants.map((v: any) => ({
          id: v.id || null,
          weightLabel: v.weightLabel || "",
          weightInGrams: v.weightInGrams || 0,
          mrp: v.mrp || 0,
          offerPrice: v.offerPrice || 0,
        })),
      });

      setLoading(false);
    } catch (err) {
      console.error("FAILED TO LOAD PRODUCT:", err);
      alert("Unable to fetch product.");
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const arr = [...form.variants];
    arr[index] = { ...arr[index], [field]: value };
    setForm({ ...form, variants: arr });
  };

  const updateImage = (index: number, value: string) => {
    const arr = [...form.imageUrls];
    arr[index] = value;
    setForm({ ...form, imageUrls: arr });
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [
        ...form.variants,
        { weightLabel: "", weightInGrams: 0, mrp: 0, offerPrice: 0 },
      ],
    });
  };

  const addImage = () => {
    setForm({ ...form, imageUrls: [...form.imageUrls, ""] });
  };

  const submit = async (e: any) => {
    e.preventDefault();

    const payload = {
      categoryId: Number(form.categoryId),
      subcategoryId: form.subcategoryId ? Number(form.subcategoryId) : null,
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      imageUrls: form.imageUrls.filter((x) => x.trim() !== ""),
      variants: form.variants,
    };

    try {
      await api.put(`/product/api/products/${id}`, payload);
      alert("Product Updated");
      navigate("/products");
    } catch (err) {
      console.error("UPDATE FAILED:", err);
      alert("Update failed.");
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading product...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>

      <form onSubmit={submit} className="space-y-4">

        {/* CATEGORY */}
        <select
          value={form.categoryId}
          onChange={(e) => updateField("categoryId", e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Category</option>
          {categories?.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* SUBCATEGORY */}
        <select
          value={form.subcategoryId}
          onChange={(e) => updateField("subcategoryId", e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">No Subcategory</option>
          {subcategories?.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="border p-2 rounded w-full"
        />

        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          value={form.imageUrl}
          onChange={(e) => updateField("imageUrl", e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* MULTI IMAGES */}
        {form.imageUrls.map((img, idx) => (
          <input
            key={idx}
            value={img}
            onChange={(e) => updateImage(idx, e.target.value)}
            className="border p-2 rounded w-full"
          />
        ))}

        <button
          type="button"
          onClick={addImage}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          + Add Image
        </button>

        {/* VARIANTS */}
        {form.variants.map((v, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2">
            <input
              value={v.weightLabel}
              onChange={(e) =>
                updateVariant(idx, "weightLabel", e.target.value)
              }
              className="border p-2 rounded"
            />

            {/* WEIGHT (TEXT INPUT – NUMBERS ONLY) */}
            <input
              type="text"
              value={v.weightInGrams}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                updateVariant(idx, "weightInGrams", Number(val));
              }}
              className="border p-2 rounded"
            />

            {/* MRP */}
            <input
              type="text"
              value={v.mrp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                updateVariant(idx, "mrp", Number(val));
              }}
              className="border p-2 rounded"
            />

            {/* OFFER PRICE */}
            <input
              type="text"
              value={v.offerPrice}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                updateVariant(idx, "offerPrice", Number(val));
              }}
              className="border p-2 rounded"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          + Add Variant
        </button>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
