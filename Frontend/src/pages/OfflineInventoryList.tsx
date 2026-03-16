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
    <div className="space-y-8 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Store size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Offline Inventory</h1>
            <p className="text-slate-500 font-medium italic">Physical Store & Warehouse Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button
             onClick={loadStocks}
             className="glass-card p-3 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 transition-all"
           >
             <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
           </button>
           <button
             onClick={() => navigate("/admin/offline-add")}
             className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-[1.25rem] font-bold text-sm shadow-xl hover:bg-black transition-all group active:scale-95"
           >
             <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
             Create Manual Entry
           </button>
        </div>
      </div>

      {/* FILTER BAR SECTION */}
      <div className="glass-card p-6 rounded-[2rem] gap-4 grid grid-cols-1 md:grid-cols-4 items-center">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            placeholder="Search Physical SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12 h-12 text-sm"
          />
        </div>
        
        <div className="relative group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input h-12 text-sm appearance-none pr-10"
          >
            <option value="">Categories</option>
            {categories.map((c: any) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
        </div>

        <div className="relative group">
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="input h-12 text-sm appearance-none pr-10"
          >
            <option value="">Variants/Weights</option>
            {uniqueVariants.map((v, i) => (
              <option key={i}>{v}</option>
            ))}
          </select>
          <LayoutGrid className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
        </div>

        <button
          onClick={() => {
            setSearch("");
            setSelectedCategory("");
            setSelectedVariant("");
          }}
          className="h-12 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* DATA TABLE CARD */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
             <RefreshCcw size={48} className="text-emerald-200 animate-spin mb-4" />
             <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Syncing physical records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-300">
            <Package size={64} className="mb-6 opacity-10 font-thin" />
            <p className="font-black uppercase tracking-widest text-xs italic">Vault is empty</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 uppercase">
                  <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-400">Classification</th>
                  <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-400">Product Entity</th>
                  <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-400">Variant Profile</th>
                  <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-400 text-center">Available Units</th>
                  <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-400 text-center">Reorder Point</th>
                  <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-400 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {filtered.map((s) => (
                  <tr key={s.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2">
                         <Layers size={14} className="text-slate-300" />
                         <span className="text-xs text-slate-500 font-bold">{s.categoryName}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-sm">
                      {s.productName}
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-lg uppercase tracking-widest">
                        {s.variantLabel}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <div className={`inline-flex items-center justify-center gap-1.5 font-black text-lg ${
                         s.quantity <= s.minThreshold ? 'text-rose-500' : 'text-emerald-600'
                       }`}>
                         {s.quantity <= s.minThreshold && <AlertTriangle size={14} className="animate-pulse" />}
                         {s.quantity}
                       </div>
                    </td>
                    <td className="px-6 py-5 text-center text-xs text-slate-400 font-bold uppercase">
                      {s.minThreshold}
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                       <button
                         onClick={() => editStock(s)}
                         className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
                       >
                         <Pencil size={16} />
                       </button>
                       <button
                         onClick={() => deleteStock(s.id)}
                         className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all shadow-sm active:scale-95"
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