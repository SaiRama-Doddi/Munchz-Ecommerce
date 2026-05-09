import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";
import { ArrowLeft } from "lucide-react";
import ProductReviewStats from "./ProductReviewStats";
import Footer from "../components/Footer";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import { FiShoppingCart } from "react-icons/fi";
import { getProductUrl } from "../utils/slugify";
import { useCategories } from "../hooks/useQueryHelpers";
import { useSubcategories } from "../hooks/useSubcategories";

/* ================= TYPES ================= */

interface Variant {
  id?: number;
  weightLabel: string;
  weightInGrams: number;
  mrp: number;
  offerPrice: number;
}

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  variants: Variant[];
}

/* ================= COMPONENT ================= */

export default function SearchProducts() {
  const [params] = useSearchParams();
  const keyword = params.get("keyword") || "";
  const navigate = useNavigate();
  const { addToCart } = useCart();

  /* PRODUCT STATE */
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});
  const [price, setPrice] = useState(5000);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "ALL">("ALL");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | "ALL">("ALL");

  const { data: categories = [] } = useCategories();
  const { subcategories, fetchSubcats } = useSubcategories();

  useEffect(() => {
    if (selectedCategoryId !== "ALL") {
      fetchSubcats(selectedCategoryId);
    }
    setSelectedSubcategoryId("ALL");
  }, [selectedCategoryId]);

  const incQty = (id: number) =>
    setQtyMap((p) => ({ ...p, [id]: (p[id] || 1) + 1 }));

  const decQty = (id: number) =>
    setQtyMap((p) => ({ ...p, [id]: Math.max(1, (p[id] || 1) - 1) }));

  /* ================= FETCH SEARCH ================= */

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["search-products", keyword],
    enabled: !!keyword,
    queryFn: async () => {
      const res = await api.get(`/products/search?keyword=${keyword}`);
      return res.data as Product[];
    },
  });

  /* ================= FILTER LOGIC ================= */

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const sellVariants = p.variants.filter(
        (v: any) => v.weightInGrams !== 100
      );

      const priceMatch = sellVariants.some(
        (v: any) => v.offerPrice <= price
      );

      let categoryMatch = true;
      if (selectedCategoryId !== "ALL") {
        const pCatId = p.category?.id ?? p.categoryId ?? null;
        categoryMatch = pCatId === selectedCategoryId;
      }

      let subcategoryMatch = true;
      if (selectedSubcategoryId !== "ALL") {
        const pSubcatId = p.subcategory?.id ?? p.subcategoryId ?? null;
        subcategoryMatch = pSubcatId === selectedSubcategoryId;
      }

      return priceMatch && categoryMatch && subcategoryMatch;
    });
  }, [products, price, selectedCategoryId, selectedSubcategoryId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6fff4]">
        <div className="h-12 w-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (


    <>
      <TopHeader />
      <Header />
<div className="bg-[#f3fff1] min-h-screen pt-4 pb-10 md:pt-6 md:pb-16">
  <div className="max-w-7xl mx-auto px-4">

    {/* TITLE */}
    <h2 className="text-3xl font-semibold mb-8">
      Search Results for:
      <span className="text-green-700 ml-2">
        "{keyword}"
      </span>
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

      {/* FILTER PANEL */}
      <aside className="sticky top-24 h-fit bg-white rounded-xl p-5 shadow hidden lg:block">

        <h3 className="font-semibold mb-6">☰ Filters</h3>

        {/* PRICE */}
        <div className="mb-6">
          <p className="font-medium mb-2">Price</p>
          <p className="text-sm mb-2">₹0 to ₹{price}</p>

          <input
            type="range"
            min={0}
            max={5000}
            step={50}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-6">
          <p className="font-medium mb-3">Category</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-green-700 transition">
              <input
                type="radio"
                name="category"
                checked={selectedCategoryId === "ALL"}
                onChange={() => setSelectedCategoryId("ALL")}
                className="accent-green-600"
              />
              All Categories
            </label>
            {categories.map((c: any) => {
              // Only show category if it has products in the search results
              const hasProducts = products.some((p: any) => (p.category?.id ?? p.categoryId) === c.id);
              if (!hasProducts) return null;

              return (
                <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-green-700 transition">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategoryId === c.id}
                    onChange={() => setSelectedCategoryId(c.id)}
                    className="accent-green-600"
                  />
                  {c.name}
                </label>
              );
            })}
          </div>
        </div>

        {/* SUBCATEGORY */}
        {selectedCategoryId !== "ALL" && subcategories.length > 0 && (
          <div>
            <p className="font-medium mb-3">Subcategory</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-green-700 transition">
                <input
                  type="radio"
                  name="subcategory"
                  checked={selectedSubcategoryId === "ALL"}
                  onChange={() => setSelectedSubcategoryId("ALL")}
                  className="accent-green-600"
                />
                All Subcategories
              </label>
              {subcategories.map((s: any) => {
                const hasProducts = products.some((p: any) => (p.subcategory?.id ?? p.subcategoryId) === s.id);
                if (!hasProducts) return null;
                return (
                  <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-green-700 transition">
                    <input
                      type="radio"
                      name="subcategory"
                      checked={selectedSubcategoryId === s.id}
                      onChange={() => setSelectedSubcategoryId(s.id)}
                      className="accent-green-600"
                    />
                    {s.name}
                  </label>
                );
              })}
            </div>
          </div>
        )}

      </aside>

      {/* PRODUCTS */}
      <div>

        {filteredProducts.length === 0 ? (

          <div className="text-center text-gray-600 py-20">
            No products found.
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">

            {filteredProducts.map((p) => {

              const base100g = p.variants.find(
                (v) => v.weightInGrams === 100
              );

              const sellVariants = p.variants.filter(
                (v) => v.weightInGrams !== 100
              );

              const selectedVariantIndex = variantMap[p.id] ?? 0;
              const selectedVariant = sellVariants[selectedVariantIndex];
              const qty = qtyMap[p.id] || 1;

              if (!selectedVariant) return null;

              const discount =
                selectedVariant.mrp > selectedVariant.offerPrice
                  ? Math.round(
                      ((selectedVariant.mrp -
                        selectedVariant.offerPrice) /
                        selectedVariant.mrp) *
                        100
                    )
                  : 0;

              return (

                <div
                  key={p.id}
                  onClick={() => navigate(getProductUrl(p.id, p.name))}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden cursor-pointer transition flex flex-col"
                >

                  {/* IMAGE */}
                  <div className="relative bg-gray-50 aspect-square flex items-center justify-center">

                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition"
                    />

                    {discount > 0 && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white text-sm px-3 py-1 rounded-md font-semibold">
                        {discount}% OFF
                      </div>
                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="p-3 flex flex-col gap-2 flex-grow">

                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                      {p.name}
                    </h3>

                    <ProductReviewStats productId={p.id} />

                    {/* PRICE */}
                    <div className="flex items-center gap-2">

                      <span className="text-base font-bold text-gray-900">
                        ₹{selectedVariant.offerPrice * qty}
                      </span>

                      {selectedVariant.mrp > selectedVariant.offerPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{selectedVariant.mrp * qty}
                        </span>
                      )}

                      {base100g && (
                        <span className="text-xs text-gray-500">
                          (₹{base100g.offerPrice}/100g)
                        </span>
                      )}

                    </div>

                    {/* VARIANT + CART */}
                    <div
                      className="flex items-center gap-2 mt-auto"
                      onClick={(e) => e.stopPropagation()}
                    >

                      <select
                        value={selectedVariantIndex}
                        onChange={(e) =>
                          setVariantMap((prev) => ({
                            ...prev,
                            [p.id]: parseInt(e.target.value),
                          }))
                        }
                        className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-gray-50
                        focus:outline-none focus:ring-2 focus:ring-green-500"
                      >

                        {sellVariants.map((v, i) => (
                          <option key={i} value={i}>
                            {v.weightLabel}
                          </option>
                        ))}

                      </select>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          addToCart({
                            productId: p.id,
                            name: p.name,
                            imageUrl: p.imageUrl,
                            variants: sellVariants,
                            selectedVariantIndex,
                            base100gPrice: base100g?.offerPrice,
                            qty,
                          });
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        <FiShoppingCart size={18} />
                      </button>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>

  </div>
</div>
      <Footer />
    </>


  );
}
