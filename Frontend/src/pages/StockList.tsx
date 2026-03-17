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
  PackageCheck,
  Tag
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Scanning Inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight tracking-[-0.02em]">Inventory Hub</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Monitor and update your physical stock levels</p>
        </div>
        <button
          onClick={() => navigate("/admin/addstock")}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/5 hover:bg-emerald-600 transition-all duration-300"
        >
          <Plus size={18} />
          <span>Restock Inventory</span>
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-[2rem] flex items-center gap-4">
          <div className="p-4 bg-gray-50 text-black rounded-2xl">
            <Box size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">SKU Count</p>
            <p className="text-2xl font-black text-black">{stocks.length}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-[2rem] flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Low Alerts</p>
            <p className="text-2xl font-black text-black">
              {stocks.filter(s => s.quantity < 10).length}
            </p>
          </div>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-[2rem] flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="p-4 bg-black text-white rounded-2xl">
            <PackageCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Healthy Qty</p>
            <p className="text-2xl font-black text-black">
              {stocks.filter(s => s.quantity >= 10).length}
            </p>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Product & Variant</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center border-b border-gray-100">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center border-b border-gray-100">Quantity</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right border-b border-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stocks.map((s) => (
                <tr key={s.id} className="group hover:bg-gray-50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-black group-hover:text-emerald-600 transition-colors">
                        {s.productName}
                      </span>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        {s.variantLabel}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      {s.quantity < 10 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-black border border-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                          <TrendingDown size={12} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                          <TrendingUp size={12} /> In Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-lg font-black ${s.quantity < 10 ? 'text-emerald-600' : 'text-black'}`}>
                      {s.quantity}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                      {s.categoryName}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                       <button
                        onClick={() => navigate("/admin/addstock", { state: { stock: s } })}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white hover:border-gray-200 border border-transparent rounded-xl transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteStock(s.id)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
            <div className="py-24 flex flex-col items-center justify-center text-gray-300">
              <Box size={48} className="mb-4 opacity-10" />
              <p className="font-black uppercase tracking-widest text-[10px]">No inventory records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}