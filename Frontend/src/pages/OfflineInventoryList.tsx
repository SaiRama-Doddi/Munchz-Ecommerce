import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import offlineInventoryApi from "../api/offlineInventoryApi";
import api from "../api/client";
import { Pencil, Trash2 } from "lucide-react";

export default function OfflineInventoryList() {
  const navigate = useNavigate();

  const [stocks, setStocks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");

  /* ================= LOAD DATA ================= */
  const loadStocks = async () => {
    setLoading(true);
    try {
      const res = await offlineInventoryApi.get("/offline-inventory");
      setStocks(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
    api.get("/categories").then(res => setCategories(res.data));
  }, []);

  /* ================= DELETE ================= */
  const deleteStock = async (id: number) => {
    if (!window.confirm("Delete this stock?")) return;
    await offlineInventoryApi.delete(`/offline-inventory/${id}`);
    loadStocks();
  };

  /* ================= EDIT ================= */
  const editStock = (stock: any) => {
    navigate("/admin/offline-add", {
      state: { stock }
    });
  };

  /* ================= FILTER ================= */
  const filtered = stocks.filter((s) => {
    return (
      (selectedCategory ? s.categoryName === selectedCategory : true) &&
      (selectedVariant ? s.variantLabel === selectedVariant : true) &&
      (search
        ? s.productName.toLowerCase().includes(search.toLowerCase())
        : true)
    );
  });

  const uniqueVariants = [...new Set(stocks.map(s => s.variantLabel))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Offline Inventory</h1>
            <p className="text-gray-500 text-sm mt-2">
              Manage offline product stocks
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/offline-add")}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-[1.03]"
          >
            + Add Offline Stock
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3"
          >
            <option value="">All Categories</option>
            {categories.map((c: any) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3"
          >
            <option value="">All Variants</option>
            {uniqueVariants.map((v, i) => (
              <option key={i}>{v}</option>
            ))}
          </select>

          <input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No offline stock available
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Variant</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4 text-center">Min</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{s.categoryName}</td>
                    <td className="px-6 py-4 font-medium">{s.productName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {s.variantLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600">
                      {s.quantity}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {s.minThreshold}
                    </td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        onClick={() => editStock(s)}
                        className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => deleteStock(s.id)}
                        className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}