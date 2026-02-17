import React, { useMemo, useState } from "react";
import { useProducts } from "../hooks/useQueryHelpers";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

/* =====================
   CATEGORY TYPE
===================== */
interface Category {
  id: number;
  name: string;
  description: string;
  thumbnailImage: string;
}

export default function Products() {
  const navigate = useNavigate();
  const { data: products = [], refetch } = useProducts();

  /* =====================
     FETCH CATEGORIES
  ===================== */
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data as Category[];
    }
  });

  /* =====================
     STATE
  ===================== */
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | "ALL">("ALL");

  /* =====================
     DELETE PRODUCT
  ===================== */
  const deleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await api.delete(`/products/${id}`);
    refetch();
  };

  /* =====================
     FILTER PRODUCTS (FIXED)
     Handles:
     - p.category.id
     - p.categoryId
  ===================== */
  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === "ALL") return products;

    return products.filter((p: any) => {
      const productCategoryId =
        p.category?.id ?? p.categoryId ?? null;

      return productCategoryId === selectedCategoryId;
    });
  }, [products, selectedCategoryId]);

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            View and manage products category-wise
          </p>
        </div>

        <button
          onClick={() => navigate("/add-product")}
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700
                     px-8 py-3 text-white font-semibold shadow-lg
                     hover:shadow-xl hover:scale-[1.03] active:scale-95 transition"
        >
          + Add Product
        </button>
      </div>

      {/* ================= CATEGORY FILTER ================= */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200
                      shadow-2xl rounded-3xl p-8">
        <p className="text-sm font-semibold mb-4 text-gray-700">
          Filter by Category
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategoryId("ALL")}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition
              ${
                selectedCategoryId === "ALL"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow"
                  : "bg-white hover:bg-gray-100"
              }`}
          >
            All Categories
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategoryId(c.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition
                ${
                  selectedCategoryId === c.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : "bg-white hover:bg-gray-100"
                }`}
            >
              {c.thumbnailImage && (
                <img
                  src={c.thumbnailImage}
                  alt={c.name}
                  className="w-6 h-6 rounded object-cover border"
                />
              )}
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProducts.map((p: any) => (
          <div
            key={p.id}
            className="group bg-white rounded-3xl shadow-md hover:shadow-2xl
                       border border-gray-200 transition-all duration-300 overflow-hidden
                       flex flex-col"
          >
            {/* IMAGE */}
            <div className="relative overflow-hidden">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
              />

              <span className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                ID: {p.id}
              </span>

              {(p.category?.name || p.categoryName) && (
                <span className="absolute bottom-4 left-4 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow">
                  {p.category?.name || p.categoryName}
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {p.name}
              </h2>

              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {p.description}
              </p>

              {/* VARIANTS */}
              <div className="mt-5">
                <p className="text-sm font-semibold mb-2 text-gray-700">
                  Variants
                </p>

                <div className="space-y-2 text-sm">
                  {p.variants?.map((v: any) => (
                    <div
                      key={v.id}
                      className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
                    >
                      <span>{v.weightLabel}</span>
                      <span className="text-green-600 font-semibold">
                        ₹{v.offerPrice}
                        <span className="text-xs text-gray-400 line-through ml-1">
                          ₹{v.mrp}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => navigate(`/edit-product/${p.id}`)}
                  className="flex-1 rounded-xl bg-emerald-600 text-white py-2.5 text-sm font-medium
                             hover:bg-emerald-700 shadow active:scale-95 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(p.id)}
                  className="flex-1 rounded-xl bg-red-600 text-white py-2.5 text-sm font-medium
                             hover:bg-red-700 shadow active:scale-95 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 pt-20 text-lg">
          No products found for the selected category.
        </div>
      )}
    </div>
  </div>
);

}