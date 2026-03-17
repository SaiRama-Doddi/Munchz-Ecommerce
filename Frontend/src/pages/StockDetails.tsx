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
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 bg-white">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Scanning Inventory Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Stock Logistics</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Record and analyze batch-wise inventory flow</p>
        </div>
        <button
          onClick={() => navigate("/admin/stock-entry")}
          className="bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/5 hover:bg-emerald-600 transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Logistics Entry</span>
        </button>
      </div>

      {/* FILTER BAR SECTION */}
      <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-[2.5rem] gap-4 grid grid-cols-1 md:grid-cols-4 items-center">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            placeholder="Product / Supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-5 py-3 text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="relative group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3 text-sm font-bold appearance-none pr-10 outline-none focus:bg-white focus:border-emerald-500 transition-all"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
        <div className="relative group">
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3 text-sm font-bold appearance-none pr-10 outline-none focus:bg-white focus:border-emerald-500 transition-all"
          >
            <option value="ALL">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <Package className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
        <div className="relative group">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all h-full"
          />
          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* INVENTORY TABLE CARD */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Product</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Batch Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Supplier Ledger</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Pricing Strategy</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Timeline</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStocks.map((s) => {
                const isExpiring = s.expiryDate && new Date(s.expiryDate).getTime() < (new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
                const isOutOfStock = s.quantity <= 0;
                
                return (
                  <tr key={s.id} className="group hover:bg-gray-50 transition-all duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-black border border-gray-100 shadow-sm">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-black text-sm group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{s.productName}</p>
                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{s.categoryName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                         <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                          isOutOfStock ? 'bg-black text-white border-black' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {s.quantity} Units
                        </span>
                        {isExpiring && (
                          <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse mt-1">
                            <AlertCircle size={10} /> Soon Expiring
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase size={14} className="text-gray-300" />
                        <span className="text-sm font-bold text-black">{s.supplierName}</span>
                      </div>
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">GST: {s.supplierGst || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-gray-400 font-black uppercase tracking-widest">IN:</span>
                          <span className="font-black text-black">₹{s.purchasePrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-gray-400 font-black uppercase tracking-widest">OUT:</span>
                          <span className="font-black text-emerald-600">₹{s.sellingPrice}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[9px] font-black text-black mb-1 uppercase tracking-widest">
                        <TrendingUp size={12} className="text-emerald-500" />
                        <span>{s.stockInDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                        <Clock size={12} className="text-black/20" />
                        <span>{s.expiryDate || 'NO EXPIRY'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate("/admin/stock-entry", { state: { stock: s } })}
                          className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-black hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all"
                          title="Edit Batch"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => deleteStock(s.id)}
                          className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
          <div className="py-32 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-50 m-8 rounded-[2rem]">
            <Package size={64} className="mb-6 opacity-10" />
            <p className="font-black uppercase tracking-widest text-[10px]">No logistics records found</p>
          </div>
        )}
      </div>
    </div>
  );
}