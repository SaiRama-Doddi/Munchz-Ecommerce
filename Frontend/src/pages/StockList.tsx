import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../api/inventoryApi";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Box, 
  AlertTriangle, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  PackageCheck
} from "lucide-react";

export default function StockList() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStock = async () => {
    try {
      const res = await inventoryApi.get("/inventory");
      setStocks(res.data);
    } catch (err) {
      console.error("Fetch stock failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const deleteStock = async (id: number) => {
    if (!window.confirm("Delete this stock record?")) return;
    try {
      await inventoryApi.delete(`/inventory/${id}`);
      fetchStock();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 font-medium">Monitor and update your physical stock levels across all variants</p>
        </div>
        <button
          onClick={() => navigate("/admin/addstock")}
          className="flex items-center justify-center gap-2 bg-accent-gradient text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-300"
        >
          <Plus size={18} />
          <span>Restock Inventory</span>
        </button>
      </div>

      {/* STATS OVERVIEW (Optional but adds premium feel) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-[2rem] flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Box size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total SKUs</p>
            <p className="text-2xl font-black text-slate-800">{stocks.length}</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-[2rem] flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Low Stock Alert</p>
            <p className="text-2xl font-black text-slate-800">
              {stocks.filter(s => s.quantity < 10).length}
            </p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-[2rem] flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <PackageCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Healthy Stock</p>
            <p className="text-2xl font-black text-slate-800">
              {stocks.filter(s => s.quantity >= 10).length}
            </p>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product & Variant</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Quantity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stocks.map((s) => (
                <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors duration-300">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                        {s.productName}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        {s.variantLabel}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      {s.quantity < 10 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <TrendingDown size={12} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <TrendingUp size={12} /> In Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-lg font-black ${s.quantity < 10 ? 'text-orange-500' : 'text-slate-700'}`}>
                      {s.quantity}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      {s.categoryName}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                       <button
                        onClick={() => navigate("/admin/addstock", { state: { stock: s } })}
                        className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteStock(s.id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {stocks.length === 0 && !loading && (
            <div className="py-24 flex flex-col items-center justify-center text-slate-300">
              <Box size={48} className="mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">No inventory records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Tag = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="m7 7-.01.01"/>
  </svg>
);