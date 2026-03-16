import { useEffect, useMemo, useState } from "react";
import inventoryApi from "../api/inventoryApi";
import {
  History,
  Search,
  Filter,
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  LayoutGrid
} from "lucide-react";

export default function StockHistory({ productId }: { productId: number }) {
  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [variantFilter, setVariantFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    inventoryApi
      .get(`/inventory/history/${productId}`)
      .then((res) => setHistory(res.data));
  }, [productId]);

  /* ===== Unique variants ===== */
  const variants = useMemo(
    () => [...new Set(history.map((h) => h.variantLabel))],
    [history]
  );

  /* ===== Filtered Data ===== */
  const filteredHistory = useMemo(() => {
    return history.filter((h) => {
      const date = new Date(h.createdAt);

      const matchesSearch = (h.variantLabel || "")
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesVariant = variantFilter
        ? h.variantLabel === variantFilter
        : true;

      const matchesType = typeFilter
        ? h.transactionType === typeFilter
        : true;

      const matchesFrom = fromDate
        ? date >= new Date(fromDate)
        : true;

      const matchesTo = toDate
        ? date <= new Date(toDate + "T23:59:59")
        : true;

      return (
        matchesSearch &&
        matchesVariant &&
        matchesType &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [history, search, variantFilter, typeFilter, fromDate, toDate]);

  return (
    <div className="mt-12 glass-card rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-2xl overflow-hidden">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
          <History size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Transaction Ledger</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Historical Batch Movements</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search variant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input h-11 pl-10 text-xs"
          />
        </div>

        <div className="relative group">
          <select
            value={variantFilter}
            onChange={(e) => setVariantFilter(e.target.value)}
            className="input h-11 text-xs appearance-none pr-8"
          >
            <option value="">All Variants</option>
            {variants.map((v: any, i) => (
              <option key={i} value={v}>{v}</option>
            ))}
          </select>
          <LayoutGrid className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
        </div>

        <div className="relative group">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input h-11 text-xs appearance-none pr-8"
          >
            <option value="">All Types</option>
            <option value="IN">Stock Inflow</option>
            <option value="OUT">Stock Outflow</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
        </div>

        <div className="relative group">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="input h-11 text-xs"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
        </div>

        <div className="relative group">
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="input h-11 text-xs"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Variant Identity</th>
              <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Delta Qty</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {filteredHistory.map((h, i) => (
              <tr key={i} className="group hover:bg-slate-50/30 transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Clock size={12} className="text-slate-300" />
                    {new Date(h.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                    {h.variantLabel}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={`text-lg font-black ${
                    h.transactionType === "IN" ? "text-emerald-500" : "text-rose-500"
                  }`}>
                    {h.transactionType === "IN" ? "+" : "-"}{h.quantity}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                    h.transactionType === "IN"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-rose-50 text-rose-600 border-rose-100"
                  }`}>
                    {h.transactionType === "IN" ? (
                      <ArrowUpCircle size={14} />
                    ) : (
                      <ArrowDownCircle size={14} />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {h.transactionType === "IN" ? "Restock" : "Dispatch"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredHistory.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300">
            <History size={48} className="mb-4 opacity-10" />
            <p className="font-black uppercase tracking-widest text-[10px]">No transaction history found</p>
          </div>
        )}
      </div>
    </div>
  );
}