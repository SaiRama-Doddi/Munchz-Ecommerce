import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import inventoryApi from "../api/inventoryApi";
import { 
  Package, 
  Search, 
  Filter, 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Clock,
  Briefcase
} from "lucide-react";

/* ================= TYPES ================= */

interface StockEntry {
  id: number;
  productId: number;
  productName: string;
  categoryId: number;
  categoryName: string;
  supplierName: string;
  supplierGst: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  stockInDate: string;
  expiryDate: string;
}

/* ================= COMPONENT ================= */

export default function AdminStockDetails() {
  const [stocks, setStocks] = useState<StockEntry[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [productFilter, setProductFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();

  /* ===== LOAD FILTER DATA ===== */
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  /* ===== LOAD STOCK ===== */
  const loadStocks = async () => {
    try {
      const res = await inventoryApi.get("/inventory/entries");
      setStocks(res.data);
    } catch (err) {
      console.error("Load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const deleteStock = async (id: number) => {
    if (!window.confirm("Delete this entry permanently?")) return;
    try {
      await inventoryApi.delete(`/inventory/entries/${id}`);
      loadStocks();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ===== FILTER ===== */
  const filteredStocks = useMemo(() => {
    return stocks.filter((s) => {
      const matchesSearch = (s.productName?.toLowerCase() || "").includes(search.toLowerCase()) ||
                           (s.supplierName?.toLowerCase() || "").includes(search.toLowerCase());
      
      const matchesCategory = categoryFilter === "ALL" || s.categoryId === Number(categoryFilter);
      const matchesProduct = productFilter === "ALL" || s.productId === Number(productFilter);
      const matchesDate = !dateFilter || s.stockInDate.startsWith(dateFilter);

      return matchesSearch && matchesCategory && matchesProduct && matchesDate;
    });
  }, [stocks, search, categoryFilter, productFilter, dateFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Scanning Inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Stock Logistics</h1>
          <p className="text-slate-500 font-medium">Record and analyze batch-wise inventory flow</p>
        </div>
        <button
          onClick={() => navigate("/admin/stock-entry")}
          className="bg-accent-gradient text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      {/* FILTER BAR SECTION */}
      <div className="glass-card p-6 rounded-[2rem] gap-4 grid grid-cols-1 md:grid-cols-4 items-center">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            placeholder="Product / Supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12 h-12 text-sm"
          />
        </div>
        <div className="relative group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input h-12 text-sm appearance-none pr-10"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
        </div>
        <div className="relative group">
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="input h-12 text-sm appearance-none pr-10"
          >
            <option value="ALL">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <Package className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
        </div>
        <div className="relative group">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input h-12 text-sm"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
        </div>
      </div>

      {/* INVENTORY TABLE CARD */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Product</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Batch Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Supplier Ledger</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Pricing Strategy</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStocks.map((s) => {
                const isExpiring = s.expiryDate && new Date(s.expiryDate).getTime() < (new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
                const isOutOfStock = s.quantity <= 0;
                
                return (
                  <tr key={s.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{s.productName}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.categoryName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                         <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          isOutOfStock ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {s.quantity} Units
                        </span>
                        {isExpiring && (
                          <div className="flex items-center gap-1 text-[8px] font-black text-amber-500 uppercase tracking-widest animate-pulse">
                            <AlertCircle size={10} /> Soon Expiring
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase size={14} className="text-slate-300" />
                        <span className="text-sm font-bold text-slate-700">{s.supplierName}</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">GST: {s.supplierGst || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-bold uppercase tracking-widest">In:</span>
                          <span className="font-black text-slate-800">₹{s.purchasePrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-bold uppercase tracking-widest">Out:</span>
                          <span className="font-black text-emerald-600">₹{s.sellingPrice}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-1">
                        <TrendingUp size={12} className="text-blue-500" />
                        <span>{s.stockInDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <Clock size={12} className="text-rose-400" />
                        <span>{s.expiryDate || 'NO EXPIRY'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate("/admin/stock-entry", { state: { stock: s } })}
                          className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Edit Batch"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => deleteStock(s.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Discard Batch"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStocks.length === 0 && !loading && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-300">
            <Package size={64} className="mb-6 opacity-10" />
            <p className="font-black uppercase tracking-widest text-xs">No logistics records found</p>
          </div>
        )}
      </div>
    </div>
  );
}