import { useMemo, useState } from "react";
import { useProducts } from "../hooks/useQueryHelpers";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  Tag,
  ChevronRight,
  Filter,
  Layers
} from "lucide-react";

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

  const [searchTerm, setSearchTerm] = useState("");

  /* =====================
     DELETE PRODUCT
  ===================== */
  const deleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      refetch();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  /* =====================
     FILTER PRODUCTS
  ===================== */
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategoryId !== "ALL") {
      result = result.filter((p: any) => {
        const productCategoryId = p.category?.id ?? p.categoryId ?? null;
        return productCategoryId === selectedCategoryId;
      });
    }

    if (searchTerm.trim()) {
      result = result.filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm)
      );
    }

    return result;
  }, [products, selectedCategoryId, searchTerm]);

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Product Catalog</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Inventory Management</p>
        </div>

        <button
          onClick={() => navigate("/admin/add-product")}
          className="flex items-center gap-2 bg-black text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-black/5 hover:bg-emerald-600 transition-all duration-300"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* FILTER & SEARCH SECTION */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          <div className="w-full lg:w-1/3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Quick Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Product name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-black font-medium pl-12 h-12"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block flex items-center gap-2">
              <Filter size={12} />
              Filter by Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategoryId("ALL")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                  selectedCategoryId === "ALL"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10"
                    : "bg-white text-gray-400 border-gray-100 hover:border-emerald-500 hover:text-emerald-600"
                }`}
              >
                All Products
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                    selectedCategoryId === c.id
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10"
                      : "bg-white text-gray-400 border-gray-100 hover:border-emerald-500 hover:text-emerald-600"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProducts.map((p: any) => (
          <div
            key={p.id}
            className="group bg-white rounded-[2.5rem] flex flex-col hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5"
          >
            {/* IMAGE SECTION */}
            <div className="relative h-64 overflow-hidden bg-gray-50 p-6 flex items-center justify-center">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                  ID: #{p.id}
                </span>
              </div>

              <div className="absolute top-4 right-4 group-hover:translate-x-0 translate-x-12 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="w-10 h-10 bg-white border border-gray-100 text-gray-400 rounded-2xl flex items-center justify-center shadow-lg hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {(p.category?.name || p.categoryName) && (
                <div className="absolute bottom-4 left-4 bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-emerald-600/10 flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers size={10} />
                  {p.category?.name || p.categoryName}
                </div>
              )}
            </div>

            {/* CONTENT SECTION */}
            <div className="p-8 flex flex-col flex-1">
              <div className="mb-4">
                <h2 className="text-xl font-black text-black tracking-tight group-hover:text-emerald-600 transition-colors">
                  {p.name}
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-2 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              {/* VARIANTS */}
              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 mb-3 text-emerald-600">
                  <Tag size={12} className="font-bold" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Pricing & Variants</span>
                </div>

                <div className="space-y-2">
                  {p.variants?.slice(0, 3).map((v: any) => (
                    <div key={v.id} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="text-xs font-bold text-black">{v.weightLabel}</span>
                      <div className="flex items-center gap-2 font-black">
                        <span className="text-emerald-600 text-sm">₹{v.offerPrice}</span>
                        {Number(v.offerPrice) < Number(v.mrp) && (
                          <span className="text-gray-300 text-[10px] line-through">₹{v.mrp}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {p.variants?.length > 3 && (
                    <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest mt-2">
                      + {p.variants.length - 3} more variants
                    </p>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-8">
                <button
                  onClick={() => navigate(`/admin/edit-product/${p.id}`)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 text-black py-4 rounded-2xl font-bold hover:bg-black hover:text-white transition-all duration-300 group/btn"
                >
                  <Edit3 size={18} />
                  <span className="text-xs uppercase tracking-widest">Configure Entry</span>
                  <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
            <Package size={40} />
          </div>
          <p className="text-black font-bold text-lg">No inventory items found.</p>
          <button
            onClick={() => { setSelectedCategoryId("ALL"); setSearchTerm(""); }}
            className="mt-4 text-emerald-600 font-bold text-sm hover:underline uppercase tracking-widest text-[10px]"
          >
            Clear current filters
          </button>
        </div>
      )}
    </div>
  );
}