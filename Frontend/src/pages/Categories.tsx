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
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <div className="max-w-7xl mx-auto px-8 py-12 space-y-14">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Category Management
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Create, edit and manage product categories with thumbnails
          </p>
        </div>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="relative bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-10">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-50/40 to-transparent pointer-events-none" />

        <h2 className="text-2xl font-semibold text-gray-800 mb-8 relative">
          {editId ? "Edit Category" : "Create New Category"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Category Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 px-5 py-3
                         focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                         transition outline-none shadow-sm"
              placeholder="Fresh Fish"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Thumbnail Image URL
            </label>
            <input
              name="thumbnailImage"
              value={form.thumbnailImage}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 px-5 py-3
                         focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                         transition outline-none shadow-sm"
              placeholder="https://image.url"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-2xl border border-gray-300 px-5 py-3
                         focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                         transition outline-none resize-none shadow-sm"
              placeholder="Short description about this category"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8 relative">
          <button
            onClick={saveCategory}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700
                       px-8 py-3 text-white font-semibold shadow-lg
                       hover:shadow-xl hover:scale-[1.02]
                       active:scale-95 transition"
          >
            {editId ? "Update Category" : "Create Category"}
          </button>

          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setForm({ name: "", description: "", thumbnailImage: "" });
              }}
              className="rounded-2xl bg-gray-200 px-8 py-3
                         text-gray-700 font-semibold shadow
                         hover:bg-gray-300 active:scale-95 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ================= LIST CARD ================= */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          All Categories
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {categories?.map((c) => (
            <div
              key={c.id}
              className="group flex items-center justify-between
                         rounded-2xl border border-gray-200 bg-white
                         p-6 shadow-sm hover:shadow-xl
                         transition-all duration-300"
            >
              {/* Left */}
              <div className="flex items-center gap-5">
                {c.thumbnailImage ? (
                  <img
                    src={c.thumbnailImage}
                    alt="thumb"
                    className="w-20 h-20 rounded-2xl object-cover border shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gray-100
                                  flex items-center justify-center
                                  text-xs text-gray-400 border">
                    No Image
                  </div>
                )}

                <div>
                  <p className="font-semibold text-lg text-gray-900">
                    {c.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 max-w-xs">
                    {c.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    ID: {c.customId}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 opacity-80 group-hover:opacity-100 transition">
                <button
                  onClick={() => startEdit(c)}
                  className="rounded-xl px-5 py-2
                             bg-yellow-500 text-white text-sm font-medium
                             hover:bg-yellow-600 shadow active:scale-95 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCategory(c.id)}
                  className="rounded-xl px-5 py-2
                             bg-red-600 text-white text-sm font-medium
                             hover:bg-red-700 shadow active:scale-95 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);



}