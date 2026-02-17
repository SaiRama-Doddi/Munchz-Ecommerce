import { useEffect, useMemo, useState } from "react";
import inventoryApi from "../api/inventoryApi";
import offlineInventoryApi from "../api/offlineInventoryApi";
import api from "../api/client";

interface StockRow {
  productName: string;
  variantLabel: string;
  categoryName?: string;
  offlineQty: number;
  onlineQty: number;
  totalQty: number;
}

export default function AdminCompleteStock() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [search, setSearch] = useState("");

  /* ================= LOAD ALL STOCK ================= */
  const loadAllStock = async () => {
    setLoading(true);
    try {
      const [onlineRes, offlineRes] = await Promise.all([
        inventoryApi.get("/inventory"),
        offlineInventoryApi.get("/offline-inventory"),
      ]);

      const online = onlineRes.data;
      const offline = offlineRes.data;

      const map = new Map<string, StockRow>();

      online.forEach((o: any) => {
        const key = `${o.productName}__${o.variantLabel}`;
        map.set(key, {
          productName: o.productName,
          variantLabel: o.variantLabel,
          categoryName: o.categoryName,
          onlineQty: Number(o.quantity) || 0,
          offlineQty: 0,
          totalQty: 0,
        });
      });

      offline.forEach((o: any) => {
        const key = `${o.productName}__${o.variantLabel}`;
        if (map.has(key)) {
          map.get(key)!.offlineQty = Number(o.quantity) || 0;
        } else {
          map.set(key, {
            productName: o.productName,
            variantLabel: o.variantLabel,
            categoryName: o.categoryName,
            onlineQty: 0,
            offlineQty: Number(o.quantity) || 0,
            totalQty: 0,
          });
        }
      });

      map.forEach((r) => {
        r.totalQty = r.onlineQty + r.offlineQty;
      });

      setRows(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllStock();
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  /* ================= PRODUCTS FROM CATEGORY ================= */
  useEffect(() => {
    if (!selectedCategoryId) {
      setProducts([]);
      return;
    }
    api
      .get(`/products/category/${selectedCategoryId}`)
      .then((res) => setProducts(res.data));
  }, [selectedCategoryId]);

  /* ================= VARIANTS FROM DB ROWS ================= */
  const variants = useMemo(() => {
    const set = new Set<string>();

    rows.forEach((r) => {
      const categoryMatch = selectedCategoryId
        ? r.categoryName ===
          categories.find((c) => c.id === Number(selectedCategoryId))?.name
        : true;

      const productMatch = selectedProductId
        ? r.productName ===
          products.find((p) => p.id === Number(selectedProductId))?.name
        : true;

      if (categoryMatch && productMatch) {
        set.add(r.variantLabel);
      }
    });

    return Array.from(set);
  }, [rows, selectedCategoryId, selectedProductId, categories, products]);

  /* ================= FILTERED ROWS ================= */
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch = r.productName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory = selectedCategoryId
        ? r.categoryName ===
          categories.find((c) => c.id === Number(selectedCategoryId))?.name
        : true;

      const matchesProduct = selectedProductId
        ? r.productName ===
          products.find((p) => p.id === Number(selectedProductId))?.name
        : true;

      const matchesVariant = selectedVariant
        ? r.variantLabel === selectedVariant
        : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesProduct &&
        matchesVariant
      );
    });
  }, [
    rows,
    search,
    selectedCategoryId,
    selectedProductId,
    selectedVariant,
    categories,
    products,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10">

        <h2 className="text-4xl font-bold mb-8">Complete Stock Overview</h2>

        {/* FILTER BAR */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">

          <input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-2"
          />

          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setSelectedProductId("");
              setSelectedVariant("");
            }}
            className="border rounded-xl px-4 py-2"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setSelectedVariant("");
            }}
            className="border rounded-xl px-4 py-2"
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="border rounded-xl px-4 py-2"
          >
            <option value="">All Variants</option>
            {variants.map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearch("");
              setSelectedCategoryId("");
              setSelectedProductId("");
              setSelectedVariant("");
            }}
            className="bg-gray-200 rounded-xl px-4 py-2"
          >
            Clear
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Variant</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Offline</th>
                <th className="p-4 text-center">Online</th>
                <th className="p-4 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r, i) => (
                <tr key={i} className="border-t text-center">
                  <td className="p-4">{r.productName}</td>
                  <td className="p-4">{r.variantLabel}</td>
                  <td className="p-4">{r.categoryName}</td>
                  <td className="p-4 text-red-600">{r.offlineQty}</td>
                  <td className="p-4 text-indigo-600">{r.onlineQty}</td>
                  <td className="p-4 font-bold text-green-700">{r.totalQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}