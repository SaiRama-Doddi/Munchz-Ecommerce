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
    await api.delete(`/product/api/products/${id}`);
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
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Product Management
          </h1>
          <p className="text-sm text-gray-500">
            View and manage products category-wise
          </p>
        </div>

        <button
          onClick={() => navigate("/add-product")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:opacity-90"
        >
          + Add Product
        </button>
      </div>

      {/* ================= CATEGORY FILTER ================= */}
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm font-semibold mb-3 text-gray-700">
          Filter by Category
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategoryId("ALL")}
            className={`px-4 py-1.5 rounded-full border text-sm transition
              ${
                selectedCategoryId === "ALL"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white hover:bg-gray-100"
              }`}
          >
            All Categories
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategoryId(c.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm transition
                ${
                  selectedCategoryId === c.id
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white hover:bg-gray-100"
                }`}
            >
              {c.thumbnailImage && (
                <img
                  src={c.thumbnailImage}
                  alt={c.name}
                  className="w-5 h-5 rounded object-cover"
                />
              )}
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p: any) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-48 object-cover"
              />

              <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                ID: {p.id}
              </span>

              {(p.category?.name || p.categoryName) && (
                <span className="absolute bottom-3 left-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                  {p.category?.name || p.categoryName}
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {p.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {p.description}
              </p>

              {/* VARIANTS */}
              <div className="mt-4">
                <p className="text-sm font-semibold mb-1">Variants</p>
                <div className="space-y-1 text-sm">
                  {p.variants?.map((v: any) => (
                    <div
                      key={v.id}
                      className="flex justify-between bg-gray-50 px-2 py-1 rounded"
                    >
                      <span>{v.weightLabel}</span>
                      <span className="text-green-600 font-medium">
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
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => navigate(`/edit-product/${p.id}`)}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm hover:bg-emerald-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(p.id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700"
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
        <div className="text-center text-gray-500 pt-20">
          No products found for the selected category.
        </div>
      )}
    </div>
  );
}