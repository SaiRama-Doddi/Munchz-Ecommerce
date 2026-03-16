import { useEffect, useMemo, useState } from "react";
import inventoryApi from "../api/inventoryApi";
import offlineInventoryApi from "../api/offlineInventoryApi";
import api from "../api/client";
import { 
  BarChart3, 
  Smartphone, 
  Store, 
  Layers, 
  Search, 
  Filter, 
  Package, 
  ChevronDown,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
  LayoutGrid
} from "lucide-react";

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
      const matchesSearch = (r.productName || "").toLowerCase().includes(search.toLowerCase());
      const categoryName = categories.find((c) => c.id === Number(selectedCategoryId))?.name;
      const matchesCategory = selectedCategoryId ? r.categoryName === categoryName : true;
      const productName = products.find((p) => p.id === Number(selectedProductId))?.name;
      const matchesProduct = selectedProductId ? r.productName === productName : true;
      const matchesVariant = selectedVariant ? r.variantLabel === selectedVariant : true;

      return matchesSearch && matchesCategory && matchesProduct && matchesVariant;
    });
  }, [rows, search, selectedCategoryId, selectedProductId, selectedVariant, categories, products]);

  const stats = useMemo(() => {
    return filteredRows.reduce((acc, curr) => ({
      online: acc.online + curr.onlineQty,
      offline: acc.offline + curr.offlineQty,
      total: acc.total + curr.totalQty
    }), { online: 0, offline: 0, total: 0 });
  }, [filteredRows]);

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Consolidated Inventory</h1>
          <p className="text-slate-500 font-medium italic">Unified visibility across Omni-channels</p>
        </div>
        <button
          onClick={loadAllStock}
          className={`glass-card p-3 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 transition-all ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Layers size={100} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <BarChart3 size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Aggregate</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-800">{stats.total}</h3>
            <span className="text-xs font-bold text-slate-400">Total Units</span>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Smartphone size={100} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Smartphone size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-Commerce Reserve</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-800">{stats.online}</h3>
            <span className="text-xs font-bold text-slate-400">Units Online</span>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Store size={100} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <Store size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warehouse / POS</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-800">{stats.offline}</h3>
            <span className="text-xs font-bold text-slate-400">Units Offline</span>
          </div>
        </div>
      </div>

      {/* FILTER BAR SECTION */}
      <div className="glass-card p-6 rounded-[2rem] gap-4 grid grid-cols-1 md:grid-cols-5 items-center">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            placeholder="Search Items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12 h-12 text-sm"
          />
        </div>
        
        <div className="relative group">
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setSelectedProductId("");
              setSelectedVariant("");
            }}
            className="input h-12 text-sm appearance-none pr-10"
          >
            <option value="">Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
        </div>

        <div className="relative group">
          <select
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setSelectedVariant("");
            }}
            className="input h-12 text-sm appearance-none pr-10"
          >
            <option value="">Specific Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <Package className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
        </div>

        <div className="relative group">
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="input h-12 text-sm appearance-none pr-10"
          >
            <option value="">Variants/Weights</option>
            {variants.map((v, i) => (
              <option key={i} value={v}>{v}</option>
            ))}
          </select>
          <LayoutGrid className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
        </div>

        <button
          onClick={() => {
            setSearch("");
            setSelectedCategoryId("");
            setSelectedProductId("");
            setSelectedVariant("");
          }}
          className="h-12 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
        >
          Reset View
        </button>
      </div>

      {/* DATA TABLE CARD */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 uppercase">
                <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-400">Inventory SKU</th>
                <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-400">Variant Profile</th>
                <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-400">Classification</th>
                <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-400 text-center">Offline</th>
                <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-400 text-center">Online</th>
                <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-400 text-right">Aggregate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {filteredRows.map((r, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-8 py-5 font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-sm">
                    {r.productName}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-lg uppercase tracking-widest">
                      {r.variantLabel}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-400 font-bold uppercase tracking-widest">
                    {r.categoryName}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-rose-500 font-black">
                      <Store size={14} className="opacity-40" />
                      {r.offlineQty}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-blue-500 font-black">
                      <Smartphone size={14} className="opacity-40" />
                      {r.onlineQty}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-lg text-emerald-600">
                    <div className="flex items-center justify-end gap-2">
                       {r.totalQty}
                       {r.totalQty > 50 ? (
                         <ArrowUpRight size={14} className="text-emerald-300" />
                       ) : (
                         <ArrowDownRight size={14} className="text-rose-300" />
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRows.length === 0 && !loading && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-300">
            <LayoutGrid size={64} className="mb-6 opacity-10 font-thin" />
            <p className="font-black uppercase tracking-widest text-xs">No consolidated records found</p>
          </div>
        )}
      </div>
    </div>
  );
}