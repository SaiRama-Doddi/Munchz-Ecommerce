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
import PremiumSpinner from "../components/PremiumSpinner";

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
    <div className="space-y-10 pb-12 bg-white min-h-screen relative">
      {loading && <PremiumSpinner text="Gathering stock data..." backdrop={true} fullScreen={true} />}
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl text-black">Consolidated Inventory</h1>
          <p className="text-gray-400 uppercase text-[10px]">Unified visibility across Omni-channels</p>
        </div>
        <button
          onClick={loadAllStock}
          className={`bg-white border border-gray-100 shadow-sm p-3.5 rounded-2xl text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition-all ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform text-black">
            <Layers size={100} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white border border-gray-100 text-black rounded-2xl">
              <BarChart3 size={24} />
            </div>
            <span className="text-[10px] text-gray-400 uppercase">Global Aggregate</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl text-black">{stats.total}</h3>
            <span className="text-[10px] text-gray-400 uppercase">Total Units</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform text-emerald-600">
            <Smartphone size={100} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Smartphone size={24} />
            </div>
            <span className="text-[10px] text-gray-400 uppercase">E-Commerce Reserve</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl text-black">{stats.online}</h3>
            <span className="text-[10px] text-gray-400 uppercase">Units Online</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform text-gray-200">
            <Store size={100} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-black text-white rounded-2xl">
              <Store size={24} />
            </div>
            <span className="text-[10px] text-gray-400 uppercase">Warehouse / POS</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl text-black">{stats.offline}</h3>
            <span className="text-[10px] text-gray-400 uppercase">Units Offline</span>
          </div>
        </div>
      </div>

      {/* FILTER BAR SECTION */}
      <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-[2rem] gap-4 grid grid-cols-1 md:grid-cols-5 items-center">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            placeholder="Search Items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-5 py-3 text-sm placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all"
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
            className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3 text-sm appearance-none pr-10 outline-none focus:bg-white focus:border-emerald-500 transition-all"
          >
            <option value="">Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        <div className="relative group">
          <select
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setSelectedVariant("");
            }}
            className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3 text-sm appearance-none pr-10 outline-none focus:bg-white focus:border-emerald-500 transition-all"
          >
            <option value="">Specific Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <Package className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        <div className="relative group">
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3 text-sm appearance-none pr-10 outline-none focus:bg-white focus:border-emerald-500 transition-all"
          >
            <option value="">Variants/Weights</option>
            {variants.map((v, i) => (
              <option key={i} value={v}>{v}</option>
            ))}
          </select>
          <LayoutGrid className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        <button
          onClick={() => {
            setSearch("");
            setSelectedCategoryId("");
            setSelectedProductId("");
            setSelectedVariant("");
          }}
          className="h-12 border border-gray-100 rounded-xl text-[10px] uppercase text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm"
        >
          Reset View
        </button>
      </div>

      {/* DATA TABLE CARD */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] text-gray-400 uppercase">Inventory SKU</th>
                <th className="px-6 py-5 text-[10px] text-gray-400 uppercase">Variant Profile</th>
                <th className="px-6 py-5 text-[10px] text-gray-400 uppercase">Classification</th>
                <th className="px-6 py-5 text-[10px] text-gray-400 uppercase text-center">Offline</th>
                <th className="px-6 py-5 text-[10px] text-gray-400 uppercase text-center">Online</th>
                <th className="px-8 py-5 text-[10px] text-gray-400 uppercase text-right">Aggregate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50/50">
              {filteredRows.map((r, i) => (
                <tr key={i} className="group hover:bg-green-50/5 transition-all duration-300 cursor-pointer">
                  <td className="px-8 py-5 text-black group-hover:text-emerald-600 transition-colors text-sm">
                    {r.productName}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1.5 bg-white border border-gray-100 text-[9px] text-gray-400 rounded-lg uppercase group-hover:border-emerald-200 group-hover:text-emerald-600">
                      {r.variantLabel}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[10px] text-gray-300 uppercase">
                    {r.categoryName}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-black text-sm">
                      <Store size={14} className="text-gray-200" />
                      {r.offlineQty}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-sm">
                      <Smartphone size={14} className="text-emerald-100" />
                      {r.onlineQty}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right text-xl text-black">
                    <div className="flex items-center justify-end gap-2">
                       {r.totalQty}
                       {r.totalQty > 50 ? (
                         <ArrowUpRight size={16} className="text-emerald-500" />
                       ) : (
                         <ArrowDownRight size={16} className="text-gray-300" />
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRows.length === 0 && !loading && (
          <div className="py-24 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-300 m-8">
            <LayoutGrid size={64} className="mb-6 opacity-10 font-thin" />
            <p className=" uppercase text-[10px]">No consolidated records found</p>
          </div>
        )}
      </div>
    </div>
  );
}