import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";

// =====================
// CATEGORY DTO TYPE
// =====================
interface Category {
    id: number;
    name: string;
    description: string;
    customId: string;
    thumbnailImage: string;
}

// =====================
// FETCH ALL CATEGORIES
// =====================
function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await api.get("/categories");
            return res.data as Category[];
        }
    });
}

export default function Categories() {
    const qc = useQueryClient();
    const { data: categories, refetch } = useCategories();

    const [form, setForm] = useState({
        name: "",
        description: "",
        thumbnailImage: ""
    });

    const [editId, setEditId] = useState<number | null>(null);

    // Form handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // CREATE or UPDATE
    const saveCategory = async () => {
        if (!form.name.trim()) {
            alert("Category name is required");
            return;
        }

        if (editId) {
            // UPDATE
            await api.put(`/categories/${editId}`, form);
        } else {
            // CREATE
            await api.post("/categories", form);
        }

        setForm({ name: "", description: "", thumbnailImage: "" });
        setEditId(null);
        refetch();
    };

    // DELETE
    const deleteCategory = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        await api.delete(`/categories/${id}`);
        refetch();
    };

    // LOAD INTO EDIT FORM
    const startEdit = (c: Category) => {
        setEditId(c.id);
        setForm({
            name: c.name,
            description: c.description,
            thumbnailImage: c.thumbnailImage || ""
        });
    };

return (
  <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
    {/* ================= HEADER ================= */}
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
        Category Management
      </h1>
    </div>

    {/* ================= FORM ================= */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
      <h2 className="text-xl font-medium text-gray-800">
        {editId ? "Edit Category" : "Create New Category"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Category Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       transition outline-none"
            placeholder="Fresh Fish"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Thumbnail Image URL
          </label>
          <input
            name="thumbnailImage"
            value={form.thumbnailImage}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       transition outline-none"
            placeholder="https://image.url"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       transition outline-none resize-none"
            placeholder="Short description about this category"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={saveCategory}
          className="inline-flex items-center justify-center
                     rounded-xl bg-blue-600 px-6 py-2.5
                     text-white font-medium
                     hover:bg-blue-700 active:scale-95
                     transition"
        >
          {editId ? "Update Category" : "Create Category"}
        </button>

        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ name: "", description: "", thumbnailImage: "" });
            }}
            className="inline-flex items-center justify-center
                       rounded-xl bg-gray-200 px-6 py-2.5
                       text-gray-700 font-medium
                       hover:bg-gray-300 active:scale-95
                       transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>

    {/* ================= LIST ================= */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-xl font-medium text-gray-800 mb-6">
        All Categories
      </h2>

      <div className="space-y-4">
        {categories?.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between
                       rounded-xl border border-gray-100
                       p-5 hover:bg-gray-50 transition"
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              {c.thumbnailImage ? (
                <img
                  src={c.thumbnailImage}
                  alt="thumb"
                  className="w-16 h-16 rounded-xl object-cover border"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100
                                flex items-center justify-center
                                text-xs text-gray-400">
                  No Image
                </div>
              )}

              <div>
                <p className="font-medium text-gray-900">{c.name}</p>
                <p className="text-sm text-gray-600">
                  {c.description || "No description"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ID: {c.customId}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(c)}
                className="rounded-lg px-4 py-1.5
                           bg-yellow-500 text-white text-sm
                           hover:bg-yellow-600 active:scale-95
                           transition"
              >
                Edit
              </button>

              <button
                onClick={() => deleteCategory(c.id)}
                className="rounded-lg px-4 py-1.5
                           bg-red-600 text-white text-sm
                           hover:bg-red-700 active:scale-95
                           transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


}