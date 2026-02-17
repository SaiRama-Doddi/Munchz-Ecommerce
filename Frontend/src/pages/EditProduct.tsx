import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { useCategories } from "../hooks/useQueryHelpers";
import { useSubcategories } from "../hooks/useSubcategories";
import { ArrowLeft } from "lucide-react";

export default function EditProduct() {

const removeImage = (index: number) => {
  const arr = [...form.imageUrls];
  arr.splice(index, 1);
  setForm({ ...form, imageUrls: arr.length ? arr : [""] });
};


const clearMainImage = () => {
  setForm({ ...form, imageUrl: "" });
};


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
      const res = await api.get(`/products/${id}`);
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
      await api.put(`/products/${id}`, payload);
      alert("Product Updated");
      navigate("/products");
    } catch (err) {
      console.error("UPDATE FAILED:", err);
      alert("Update failed.");
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading product...</div>;

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <div className="max-w-6xl mx-auto px-8 py-12">

      {/* HEADER WITH BACK */}
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
            Edit Product
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Update product details, images and variants
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
          <select
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-5 py-3"
          >
            <option value="">Select Category</option>
            {categories?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={form.subcategoryId}
            onChange={(e) => updateField("subcategoryId", e.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-5 py-3"
          >
            <option value="">No Subcategory</option>
            {subcategories?.map((s: any) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* BASIC INFO */}
        <input
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Product Name"
          className="w-full rounded-2xl border border-gray-300 px-5 py-3"
        />

        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={3}
          placeholder="Description"
          className="w-full rounded-2xl border border-gray-300 px-5 py-3 resize-none"
        />

     <div className="relative">
  <input
    value={form.imageUrl}
    onChange={(e) => updateField("imageUrl", e.target.value)}
    placeholder="Main Image URL"
    className="w-full rounded-2xl border border-gray-300 px-5 py-3 pr-10"
  />

  {/* CLEAR BUTTON */}
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


        {/* MULTI IMAGES */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">Additional Images</h3>
        {form.imageUrls.map((img, idx) => (
  <div key={idx} className="relative">
    <input
      value={img}
      onChange={(e) => updateImage(idx, e.target.value)}
      placeholder={`Image URL ${idx + 1}`}
      className="w-full rounded-xl border border-gray-300 px-4 py-2 pr-10"
    />

    {/* REMOVE BUTTON */}
    <button
      type="button"
      onClick={() => removeImage(idx)}
      className="absolute right-2 top-1/2 -translate-y-1/2
                 text-red-500 hover:text-red-700 text-lg font-bold"
    >
      ✕
    </button>
  </div>
))}


          <button
            type="button"
            onClick={addImage}
            className="bg-gray-700 text-white px-5 py-2 rounded-xl"
          >
            + Add Image
          </button>
        </div>

        {/* VARIANTS */}
        {/* VARIANTS */}
<div className="space-y-6">
  <h3 className="text-2xl font-semibold text-gray-800">Variants Pricing</h3>

  {/* COLUMN HEADERS */}
  <div className="grid grid-cols-4 gap-4 px-6 text-sm font-semibold text-gray-600">
    <div>Variant Label</div>
    <div>Weight (grams)</div>
    <div>MRP (₹)</div>
    <div>Offer Price (₹)</div>
  </div>

  {form.variants.map((v, idx) => (
    <div
      key={idx}
      className="grid grid-cols-4 gap-4 bg-white border border-gray-200
                 p-6 rounded-2xl shadow-sm"
    >
      {/* LABEL */}
      <input
        value={v.weightLabel}
        onChange={(e) =>
          updateVariant(idx, "weightLabel", e.target.value)
        }
        placeholder="Ex: 250g / 1kg"
        className="rounded-xl border border-gray-300 px-4 py-2.5"
      />

      {/* WEIGHT */}
      <input
        value={v.weightInGrams}
        onChange={(e) =>
          updateVariant(
            idx,
            "weightInGrams",
            e.target.value.replace(/\D/g, "")
          )
        }
        placeholder="350"
        className="rounded-xl border border-gray-300 px-4 py-2.5"
      />

      {/* MRP */}
      <input
        value={v.mrp}
        onChange={(e) =>
          updateVariant(
            idx,
            "mrp",
            e.target.value.replace(/\D/g, "")
          )
        }
        placeholder="500"
        className="rounded-xl border border-gray-300 px-4 py-2.5"
      />

      {/* OFFER */}
      <input
        value={v.offerPrice}
        onChange={(e) =>
          updateVariant(
            idx,
            "offerPrice",
            e.target.value.replace(/\D/g, "")
          )
        }
        placeholder="450"
        className="rounded-xl border border-gray-300 px-4 py-2.5"
      />
    </div>
  ))}

  <button
    type="button"
    onClick={addVariant}
    className="bg-green-600 text-white px-6 py-2.5 rounded-xl shadow"
  >
    + Add Variant
  </button>
</div>


        {/* SUBMIT */}
       <div className="flex gap-4 pt-4">
  {/* CANCEL */}
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="w-1/2 rounded-2xl border border-gray-300
               px-10 py-3 font-semibold text-lg
               hover:bg-gray-100 transition"
  >
    Cancel
  </button>

  {/* UPDATE */}
  <button
    type="submit"
    className="w-1/2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700
               px-10 py-3 text-white font-semibold text-lg
               shadow hover:shadow-lg transition"
  >
    Update Product
  </button>
</div>

      </form>
    </div>
  </div>
);

}