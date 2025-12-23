import React, { useState, useEffect } from "react";
import api from "../api/client";
import { useCategories } from "../hooks/useQueryHelpers";
import { useSubcategories } from "../hooks/useSubcategories";



interface VariantForm {
  weightLabel: string;
  weightInGrams: string;
  mrp: string;
  offerPrice: string;
}

interface ProductFormState {
  categoryId: string;
  subcategoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
  variants: VariantForm[];
}

export default function ProductForm() {
  const { data: categories = [] } = useCategories();
  const { subcategories, fetchSubcats, isLoading } = useSubcategories();

  const [form, setForm] = useState<ProductFormState>({
    categoryId: "",
    subcategoryId: "",
    name: "",
    description: "",
    imageUrl: "",
    imageUrls: [""],
    variants: [
      { weightLabel: "", weightInGrams: "", mrp: "", offerPrice: "" },
    ],
  });

  /* LOAD SUBCATEGORIES ON CATEGORY CHANGE */
  useEffect(() => {
    if (form.categoryId) {
      fetchSubcats(Number(form.categoryId));
      setForm((prev) => ({ ...prev, subcategoryId: "" }));
    }
  }, [form.categoryId]);

  const updateField = (field: keyof ProductFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addImageField = () => {
    updateField("imageUrls", [...form.imageUrls, ""]);
  };

  const updateImageUrl = (i: number, val: string) => {
    const arr = [...form.imageUrls];
    arr[i] = val;
    updateField("imageUrls", arr);
  };

  const addVariant = () => {
    updateField("variants", [
      ...form.variants,
      { weightLabel: "", weightInGrams: "", mrp: "", offerPrice: "" },
    ]);
  };

  const updateVariant = (i: number, field: keyof VariantForm, value: string) => {
    const arr = [...form.variants];
    arr[i] = { ...arr[i], [field]: value };
    updateField("variants", arr);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      categoryId: Number(form.categoryId),
      subcategoryId: form.subcategoryId
        ? Number(form.subcategoryId)
        : null,
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      imageUrls: form.imageUrls.filter(Boolean),
      variants: form.variants.map((v) => ({
        weightLabel: v.weightLabel,
        weightInGrams: Number(v.weightInGrams),
        mrp: Number(v.mrp),
        offerPrice: Number(v.offerPrice),
      })),
    };

    console.log("FINAL PAYLOAD:", payload); // DEBUG

    await api.post("/products", payload);
    alert("Product created successfully");
  };

  return (
    <div className="max-w-4xl bg-white p-6 rounded shadow mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>

      <form onSubmit={submit} className="space-y-5">
        {/* CATEGORY */}
        <select
          value={form.categoryId}
          onChange={(e) => updateField("categoryId", e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SUBCATEGORY */}
        <select
          value={form.subcategoryId}
          onChange={(e) => updateField("subcategoryId", e.target.value)}
          className="border p-2 rounded w-full"
          disabled={!form.categoryId || isLoading}
        >
          <option value="">No Subcategory</option>
          {subcategories.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* PRODUCT INFO */}
        <input
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Product Name"
          className="border p-2 rounded w-full"
          required
        />

        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Description"
          className="border p-2 rounded w-full"
        />

        <input
          value={form.imageUrl}
          onChange={(e) => updateField("imageUrl", e.target.value)}
          placeholder="Main Image URL"
          className="border p-2 rounded w-full"
        />

        {form.imageUrls.map((url, i) => (
          <input
            key={i}
            value={url}
            onChange={(e) => updateImageUrl(i, e.target.value)}
            placeholder={`Image URL ${i + 1}`}
            className="border p-2 rounded w-full"
          />
        ))}

        <button
          type="button"
          onClick={addImageField}
          className="bg-gray-700 text-white px-4 py-1 rounded"
        >
          + Add Image
        </button>

        <h3 className="text-xl font-semibold mt-4">Variants</h3>

        {form.variants.map((v, i) => (
          <div key={i} className="grid grid-cols-4 gap-3">
            <input
              value={v.weightLabel}
              onChange={(e) =>
                updateVariant(i, "weightLabel", e.target.value)
              }
              placeholder="250g / 1kg"
              className="border p-2 rounded"
            />
            <input
              value={v.weightInGrams}
              onChange={(e) =>
                updateVariant(i, "weightInGrams", e.target.value)
              }
              placeholder="Weight (grams)"
              className="border p-2 rounded"
            />
            <input
              value={v.mrp}
              onChange={(e) => updateVariant(i, "mrp", e.target.value)}
              placeholder="MRP"
              className="border p-2 rounded"
            />
            <input
              value={v.offerPrice}
              onChange={(e) =>
                updateVariant(i, "offerPrice", e.target.value)
              }
              placeholder="Offer Price"
              className="border p-2 rounded"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          + Add Variant
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded text-lg"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}