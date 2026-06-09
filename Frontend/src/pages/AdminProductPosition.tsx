import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Info, 
  Layers, 
  ShoppingBag,
  ShieldAlert
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useProducts } from "../hooks/useQueryHelpers";
import { usePermissions } from "../hooks/usePermissions";
import { toast } from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  description: string;
  thumbnailImage: string;
}

export default function AdminProductPosition() {
  const { hasPermission, isAdmin } = usePermissions();
  const canUpdate = hasPermission("PRODUCTS", "UPDATE");

  const { data: products = [], refetch } = useProducts();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  /* FETCH CATEGORIES */
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      const data = res.data as Category[];
      // Set default category selection
      if (data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(data[0].id);
      }
      return data;
    }
  });

  // Automatically select first category once loaded if none is active
  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories]);

  /* FILTER AND SORT PRODUCTS */
  const categoryProducts = useMemo(() => {
    if (!selectedCategoryId) return [];
    
    // Filter by category
    const filtered = products.filter((p: any) => {
      const pCatId = p.category?.id ?? p.categoryId ?? null;
      return pCatId === selectedCategoryId;
    });

    // Sort by sortOrder first, then id
    return [...filtered].sort((a: any, b: any) => {
      const aOrder = a.sortOrder ?? 0;
      const bOrder = b.sortOrder ?? 0;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.id - b.id;
    });
  }, [products, selectedCategoryId]);

  const handleMoveProduct = async (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categoryProducts.length) return;

    // Standardize payload helper
    const getPayload = (product: any, newOrder: number) => ({
      categoryId: product.categoryId || product.category?.id,
      subcategoryId: product.subcategoryId || product.subcategory?.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      imageUrls: product.imageUrls || product.images?.map((im: any) => im.imageUrl) || [],
      variants: product.variants?.map((v: any) => ({
        weightLabel: v.weightLabel,
        weightInGrams: v.weightInGrams,
        mrp: v.mrp,
        offerPrice: v.offerPrice
      })) || [],
      sortOrder: newOrder
    });

    try {
      setLoading(true);
      
      const p1 = categoryProducts[index];
      const p2 = categoryProducts[targetIndex];

      // Swap their positions by saving both with the updated sortOrder values
      await api.put(`/products/${p1.id}`, getPayload(p1, targetIndex));
      await api.put(`/products/${p2.id}`, getPayload(p2, index));

      toast.success("Product alignment updated successfully!");
      refetch();
    } catch (err) {
      console.error("Failed to update product order:", err);
      toast.error("Failed to update product alignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">Product Alignment</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
            Arrange the order of products as they appear on the public shop page
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-gray-400 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
          <Info size={16} />
          <span>{categoryProducts.length} PRODUCTS IN CATEGORY</span>
        </div>
      </div>

      {/* CATEGORY SELECTOR */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 mb-2 block">
          Select Store Segment
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-1 px-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategoryId(c.id)}
              className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] uppercase border transition-all duration-300 whitespace-nowrap ${
                selectedCategoryId === c.id
                  ? "bg-black text-white border-black shadow-lg shadow-black/20"
                  : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* ACCESS WARNING */}
      {!canUpdate && !isAdmin && (
        <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-8 flex items-center gap-4 text-orange-700">
          <ShieldAlert size={24} />
          <p className="text-xs font-bold uppercase tracking-widest">
            You do not have permission to change product alignments.
          </p>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-base font-bold text-black tracking-tight">Active Product Layout</h3>
          <div className="h-px flex-1 mx-6 bg-gray-100 hidden md:block"></div>
        </div>

        {loading && categoryProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-xl shadow-sm overflow-hidden relative"
              >
                {/* Index Label */}
                <div className="absolute top-8 left-8 bg-black/70 backdrop-blur-md text-white text-[10px] font-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10 border border-white/20">
                  #{index + 1}
                </div>

                {/* Product Image Preview Card */}
                <div 
                  className="w-full border border-gray-100 bg-gray-50 rounded-2xl overflow-hidden shadow-sm group-hover:scale-[1.01] transition-transform duration-500 mb-6 aspect-square flex items-center justify-center p-4"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full object-contain"
                  />
                </div>

                {/* Management Toolbar */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50 mt-auto">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveProduct(index, "left")}
                      disabled={index === 0 || loading || !canUpdate}
                      className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-xl text-gray-400 transition-colors disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-400 cursor-pointer"
                      title="Move Left/Up"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveProduct(index, "right")}
                      disabled={index === categoryProducts.length - 1 || loading || !canUpdate}
                      className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-xl text-gray-400 transition-colors disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-400 cursor-pointer"
                      title="Move Right/Down"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {/* Product Name Display */}
                  <div className="flex-1 min-w-0 mx-2 text-right">
                    <p className="text-xs font-bold text-black truncate" title={product.name}>
                      {product.name}
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                      Pos: {product.sortOrder ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {categoryProducts.length === 0 && !loading && (
          <div className="text-center py-24 bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <ShoppingBag size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
