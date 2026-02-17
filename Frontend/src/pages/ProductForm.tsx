import React, { useState, useEffect } from "react";
import api from "../api/client";
import { useCategories } from "../hooks/useQueryHelpers";
import { useSubcategories } from "../hooks/useSubcategories";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


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


const removeImage = (index: number) => {
  const arr = [...form.imageUrls];
  arr.splice(index, 1);
  updateField("imageUrls", arr.length ? arr : [""]);
};

const clearMainImage = () => {
  updateField("imageUrl", "");
};


  const navigate = useNavigate();

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
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <div className="max-w-6xl mx-auto px-8 py-12">

      <div className="mb-10 flex items-start gap-4">
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="mt-1 p-3 rounded-xl border border-gray-300
               hover:bg-gray-100 transition shadow-sm"
  >
    <ArrowLeft size={22} />
  </button>

  <div>
    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
      Add Product
    </h1>
    <p className="text-gray-500 mt-2 text-sm">
      Create product, assign category, images and variants
    </p>
  </div>
</div>


      <form
        onSubmit={submit}
        className="bg-white/80 backdrop-blur-xl border border-gray-200
                   shadow-2xl rounded-3xl p-10 space-y-8"
      >
        {/* CATEGORY + SUBCATEGORY */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Category
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-5 py-3
                         focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                         transition outline-none shadow-sm"
              required
            >
              <option value="">Select Category</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Subcategory
            </label>
            <select
              value={form.subcategoryId}
              onChange={(e) => updateField("subcategoryId", e.target.value)}
              disabled={!form.categoryId || isLoading}
              className="w-full rounded-2xl border border-gray-300 px-5 py-3
                         focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                         transition outline-none shadow-sm"
            >
              <option value="">No Subcategory</option>
              {subcategories.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="grid gap-6">
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Product Name"
            className="w-full rounded-2xl border border-gray-300 px-5 py-3
                       focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                       transition outline-none shadow-sm"
            required
          />

          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full rounded-2xl border border-gray-300 px-5 py-3
                       focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                       transition outline-none shadow-sm resize-none"
          />

          <div className="relative">
  <input
    value={form.imageUrl}
    onChange={(e) => updateField("imageUrl", e.target.value)}
    placeholder="Main Image URL"
    className="w-full rounded-2xl border border-gray-300 px-5 py-3 pr-10"
  />

  {form.imageUrl && (
    <button
      type="button"
      onClick={clearMainImage}
      className="absolute right-3 top-1/2 -translate-y-1/2
                 text-red-500 hover:text-red-700 text-lg font-bold"
    >
      ✕
    </button>
  )}
</div>

        </div>

        {/* MULTIPLE IMAGES */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Additional Images
          </h3>

   {form.imageUrls.map((url, i) => (
  <div key={i} className="relative">
    <input
      value={url}
      onChange={(e) => updateImageUrl(i, e.target.value)}
      placeholder={`Image URL ${i + 1}`}
      className="w-full rounded-2xl border border-gray-300 px-5 py-3 pr-10"
    />

    <button
      type="button"
      onClick={() => removeImage(i)}
      className="absolute right-3 top-1/2 -translate-y-1/2
                 text-red-500 hover:text-red-700 text-lg font-bold"
    >
      ✕
    </button>
  </div>
))}


          <button
            type="button"
            onClick={addImageField}
            className="rounded-xl bg-gray-800 text-white px-5 py-2
                       hover:bg-black active:scale-95 transition shadow"
          >
            + Add Image
          </button>
        </div>

        {/* VARIANTS */}
        <div className="space-y-6">
  <h3 className="text-2xl font-semibold text-gray-800">Variants Pricing</h3>

  <div className="grid grid-cols-4 gap-5 px-6 text-sm font-semibold text-gray-600">
    <div>Variant Label</div>
    <div>Weight (grams)</div>
    <div>MRP (₹)</div>
    <div>Offer Price (₹)</div>
  </div>

  {form.variants.map((v, i) => (
    <div
      key={i}
      className="grid md:grid-cols-4 gap-5 bg-gray-50 p-6 rounded-2xl border border-gray-200"
    >
      <input
        value={v.weightLabel}
        onChange={(e) => updateVariant(i, "weightLabel", e.target.value)}
        placeholder="250g / 1kg"
        className="rounded-xl border border-gray-300 px-4 py-2.5"
      />

      <input
        value={v.weightInGrams}
        onChange={(e) =>
          updateVariant(i, "weightInGrams", e.target.value.replace(/\D/g, ""))
        }
        placeholder="350"
        className="rounded-xl border border-gray-300 px-4 py-2.5"
      />

      <input
        value={v.mrp}
        onChange={(e) =>
          updateVariant(i, "mrp", e.target.value.replace(/\D/g, ""))
        }
        placeholder="500"
        className="rounded-xl border border-gray-300 px-4 py-2.5"
      />

      <input
        value={v.offerPrice}
        onChange={(e) =>
          updateVariant(i, "offerPrice", e.target.value.replace(/\D/g, ""))
        }
        placeholder="450"
        className="rounded-xl border border-gray-300 px-4 py-2.5"
      />
    </div>
  ))}

  <button
    type="button"
    onClick={addVariant}
    className="rounded-xl bg-green-600 text-white px-5 py-2 shadow"
  >
    + Add Variant
  </button>
</div>


        {/* SUBMIT */}
        <div className="pt-4">
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700
                       px-10 py-3 text-white font-semibold text-lg
                       shadow-lg hover:shadow-xl hover:scale-[1.02]
                       active:scale-95 transition"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  </div>
);

}