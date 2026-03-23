import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import offlineInventoryApi from "../api/offlineInventoryApi";
import api from "../api/client";
import { 
  Pencil, 
  Trash2, 
  Store, 
  PlusCircle, 
  Search, 
  Filter, 
  LayoutGrid, 
  Package, 
  AlertTriangle,
  RefreshCcw,
  Layers
} from "lucide-react";

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
    if (!window.confirm("Secure Delete: Permanently remove this stock record?")) return;
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
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-black text-white rounded-2xl shadow-lg shadow-black/5">
            <Store size={28} />
          </div>
          <div>
            <h1 className="text-3xl text-black">Offline Inventory</h1>
            <p className="text-gray-400 uppercase text-[10px]">Physical Store & Warehouse Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button
             onClick={loadStocks}
             className="bg-white border border-gray-100 shadow-sm p-3.5 rounded-2xl text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"
           >
             <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
           </button>
           <button
             onClick={() => navigate("/admin/offline-add")}
             className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl text-[10px] uppercase shadow-xl shadow-black/5 hover:bg-emerald-600 transition-all group active:scale-95"
           >
             <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
             Create Manual Entry
           </button>
        </div>
      </div>

      {/* FILTER BAR SECTION */}
      <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-[2.5rem] gap-4 grid grid-cols-1 md:grid-cols-4 items-center">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            placeholder="Search Physical SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-xl pl-12 pr-5 py-3 text-sm placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        
        <div className="relative group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-xl px-5 py-3 text-sm appearance-none pr-10 outline-none focus:bg-white focus:border-emerald-500 transition-all"
          >
            <option value="">Categories</option>
            {categories.map((c: any) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        <div className="relative group">
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-xl px-5 py-3 text-sm appearance-none pr-10 outline-none focus:bg-white focus:border-emerald-500 transition-all"
          >
            <option value="">Variants/Weights</option>
            {uniqueVariants.map((v, i) => (
              <option key={i}>{v}</option>
            ))}
          </select>
          <LayoutGrid className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        <button
          onClick={() => {
            setSearch("");
            setSelectedCategory("");
            setSelectedVariant("");
          }}
          className="h-12 border border-gray-100 rounded-xl text-[10px] uppercase text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm"
        >
          Reset Filters
        </button>
      </div>

      {/* DATA TABLE CARD */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center">
             <RefreshCcw size={48} className="text-emerald-200 animate-spin mb-4" />
             <p className=" uppercase text-[10px] text-gray-300">Syncing physical records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-50 m-8 rounded-[2rem]">
            <Package size={64} className="mb-6 opacity-10 font-thin" />
            <p className=" uppercase text-[10px] italic">Vault is empty</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 uppercase">
                  <th className="px-8 py-5 text-[10px] text-gray-400">Classification</th>
                  <th className="px-6 py-5 text-[10px] text-gray-400">Product Entity</th>
                  <th className="px-6 py-5 text-[10px] text-gray-400">Variant Profile</th>
                  <th className="px-6 py-5 text-[10px] text-gray-400 text-center">Available Units</th>
                  <th className="px-6 py-5 text-[10px] text-gray-400 text-center">Reorder Point</th>
                  <th className="px-8 py-5 text-[10px] text-gray-400 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s) => (
                  <tr key={s.id} className="group hover:bg-gray-50 transition-all duration-300">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2">
                         <Layers size={14} className="text-emerald-500/30" />
                         <span className="text-[10px] text-gray-400 uppercase">{s.categoryName}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-black group-hover:text-emerald-600 transition-colors text-sm uppercase">
                      {s.productName}
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-[9px] text-gray-400 rounded-lg uppercase group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all">
                        {s.variantLabel}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <div className={`inline-flex items-center justify-center gap-1.5 text-xl ${
                         s.quantity <= s.minThreshold ? 'text-black' : 'text-emerald-600'
                       }`}>
                         {s.quantity <= s.minThreshold && <AlertTriangle size={14} className="text-black animate-pulse" />}
                         {s.quantity}
                       </div>
                    </td>
                    <td className="px-6 py-5 text-center text-[10px] text-gray-300 uppercase">
                      {s.minThreshold}
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                       <button
                         onClick={() => editStock(s)}
                         className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-black hover:border-gray-200 transition-all shadow-sm active:scale-95"
                       >
                         <Pencil size={16} />
                       </button>
                       <button
                         onClick={() => deleteStock(s.id)}
                         className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm active:scale-95"
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