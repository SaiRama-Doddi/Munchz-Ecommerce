import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import {
  FolderPlus,
  Edit3,
  Trash2,
  Plus,
  Image as ImageIcon,
  ChevronRight,
  Info
} from "lucide-react";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const saveCategory = async () => {
        if (!form.name.trim()) {
            alert("Category name is required");
            return;
        }

        try {
            if (editId) {
                await api.put(`/categories/${editId}`, form);
            } else {
                await api.post("/categories", form);
            }
            setForm({ name: "", description: "", thumbnailImage: "" });
            setEditId(null);
            refetch();
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Failed to save category");
        }
    };

    const deleteCategory = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`/categories/${id}`);
            refetch();
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete category");
        }
    };

    const startEdit = (c: Category) => {
        setEditId(c.id);
        setForm({
            name: c.name,
            description: c.description,
            thumbnailImage: c.thumbnailImage || ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-10 pb-12 bg-white min-h-screen">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">Category Setup</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Create and organize your product catalog</p>
                </div>
                {!editId && (
                  <div className="hidden md:flex items-center gap-2 text-gray-400 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
                    <Info size={16} />
                    <span>{categories?.length || 0} CATEGORIES ACTIVE</span>
                  </div>
                )}
            </div>

            {/* FORM CARD */}
            <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                <div className="flex items-center gap-3 mb-8 relative">
                    <div className="p-2.5 bg-black text-white rounded-xl shadow-lg">
                        {editId ? <Edit3 size={20} /> : <FolderPlus size={20} />}
                    </div>
                    <h2 className="text-xl font-bold text-black">
                        {editId ? "Edit Category Details" : "Setup New Category"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Category Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                            placeholder="e.g. Seafood & Meats"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Thumbnail URL</label>
                        <div className="relative">
                            <input
                                name="thumbnailImage"
                                value={form.thumbnailImage}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-5 py-4 text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                placeholder="https://images.unsplash.com/..."
                            />
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all min-h-[100px] resize-none"
                            placeholder="Write a short briefing about this category..."
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10 relative">
                    <button
                        onClick={saveCategory}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-black/5"
                    >
                        {editId ? <Edit3 size={16} /> : <Plus size={16} />}
                        <span>{editId ? "Save Changes" : "Create Category"}</span>
                    </button>

                    {editId && (
                        <button
                            onClick={() => {
                                setEditId(null);
                                setForm({ name: "", description: "", thumbnailImage: "" });
                            }}
                            className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>

            {/* LIST SECTION */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold text-black tracking-tight">Active Categories</h3>
                    <div className="h-px flex-1 mx-6 bg-gray-100 hidden md:block"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categories?.map((c) => (
                        <div
                            key={c.id}
                            className="group bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-xl shadow-sm"
                        >
                            <div className="flex gap-4 md:gap-5 mb-6">
                                <div className="relative shrink-0">
                                    {c.thumbnailImage ? (
                                        <img
                                            src={c.thumbnailImage}
                                            alt={c.name}
                                            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300 border-2 border-white shadow-sm italic text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                          no image
                                        </div>
                                    )}
                                    <div className="absolute -top-2 -right-2 bg-white text-[9px] font-black text-emerald-600 px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                                      #{c.customId}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 pt-1">
                                    <h4 className="text-base md:text-lg font-bold text-black truncate group-hover:text-emerald-600 transition-colors">
                                        {c.name}
                                    </h4>
                                    <p className="text-[11px] md:text-xs text-gray-400 font-bold line-clamp-3 mt-1.5 leading-relaxed">
                                        {c.description || "No description provided."}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto flex gap-3 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => startEdit(c)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
                                >
                                    <Edit3 size={14} />
                                    <span>Edit</span>
                                </button>

                                <button
                                    onClick={() => deleteCategory(c.id)}
                                    className="flex items-center justify-center w-12 h-12 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-black transition-all duration-300"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <button className="flex items-center justify-center w-12 h-12 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-emerald-600 transition-all duration-300">
                                  <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {!categories?.length && (
                    <div className="text-center py-24 bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <FolderPlus size={32} />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No categories found. Start by creating one above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}