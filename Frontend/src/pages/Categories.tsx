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
        <div className="space-y-10 pb-12">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Category Management</h1>
                    <p className="text-slate-500 font-medium">Create and organize your product catalog</p>
                </div>
                {!editId && (
                  <div className="hidden md:flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100">
                    <Info size={16} />
                    <span>{categories?.length || 0} Categories Active</span>
                  </div>
                )}
            </div>

            {/* FORM CARD */}
            <div className="glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                <div className="flex items-center gap-3 mb-8 relative">
                    <div className="p-2.5 bg-accent-gradient rounded-xl text-white shadow-lg shadow-emerald-500/20">
                        {editId ? <Edit3 size={20} /> : <FolderPlus size={20} />}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {editId ? "Edit Category Details" : "Setup New Category"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g. Seafood & Meats"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Thumbnail URL</label>
                        <div className="relative">
                            <input
                                name="thumbnailImage"
                                value={form.thumbnailImage}
                                onChange={handleChange}
                                className="input pl-10"
                                placeholder="https://images.unsplash.com/..."
                            />
                            <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="input min-h-[100px] resize-none"
                            placeholder="Write a short briefing about this category..."
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-10 relative">
                    <button
                        onClick={saveCategory}
                        className="flex items-center gap-2 bg-accent-gradient text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-300"
                    >
                        {editId ? <Edit3 size={18} /> : <Plus size={18} />}
                        <span>{editId ? "Save Changes" : "Create Category"}</span>
                    </button>

                    {editId && (
                        <button
                            onClick={() => {
                                setEditId(null);
                                setForm({ name: "", description: "", thumbnailImage: "" });
                            }}
                            className="px-8 py-3.5 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>

            {/* LIST SECTION */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Active Categories</h3>
                    <div className="h-px flex-1 mx-6 bg-slate-200 hidden md:block"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categories?.map((c) => (
                        <div
                            key={c.id}
                            className="group glass-card rounded-[2rem] p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 border border-slate-100"
                        >
                            <div className="flex gap-5 mb-6">
                                <div className="relative shrink-0">
                                    {c.thumbnailImage ? (
                                        <img
                                            src={c.thumbnailImage}
                                            alt={c.name}
                                            className="w-24 h-24 rounded-3xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-white shadow-sm italic text-xs">
                                          no image
                                        </div>
                                    )}
                                    <div className="absolute -top-2 -right-2 bg-white text-[10px] font-black text-slate-400 px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                                      #{c.customId}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 pt-1">
                                    <h4 className="text-lg font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                                        {c.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium line-clamp-3 mt-1.5 leading-relaxed">
                                        {c.description || "No description provided for this category."}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto flex gap-3 pt-4 border-t border-slate-50">
                                <button
                                    onClick={() => startEdit(c)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-600 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300 border border-transparent hover:border-emerald-100"
                                >
                                    <Edit3 size={14} />
                                    <span>Edit</span>
                                </button>

                                <button
                                    onClick={() => deleteCategory(c.id)}
                                    className="flex items-center justify-center w-11 h-11 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all duration-300 border border-transparent hover:border-red-100"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <button className="flex items-center justify-center w-11 h-11 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all duration-300">
                                  <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {!categories?.length && (
                    <div className="text-center py-20 glass-card rounded-[2rem] border-dashed border-2">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <FolderPlus size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">No categories found. Start by creating one above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}