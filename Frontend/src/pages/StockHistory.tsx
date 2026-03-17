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
    <div className="mt-12 bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      
      <div className="flex items-center gap-4 mb-8 relative">
        <div className="p-3 bg-black text-white rounded-2xl shadow-lg shadow-black/5">
          <History size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-black uppercase tracking-tight">Transaction Ledger</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Historical Batch Movements</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-10 relative">
        <div className="flex-1 min-w-[150px] relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Variant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-xl pl-10 pr-4 py-3 text-[11px] font-bold placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-11"
          />
        </div>

        <div className="flex-1 min-w-[150px] relative group">
          <select
            value={variantFilter}
            onChange={(e) => setVariantFilter(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-[11px] font-bold appearance-none pr-8 outline-none focus:bg-white focus:border-emerald-500 transition-all h-11"
          >
            <option value="">All Variants</option>
            {variants.map((v: any, i) => (
              <option key={i} value={v}>{v}</option>
            ))}
          </select>
          <LayoutGrid className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>

        <div className="flex-1 min-w-[150px] relative group">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-[11px] font-bold appearance-none pr-8 outline-none focus:bg-white focus:border-emerald-500 transition-all h-11"
          >
            <option value="">All Types</option>
            <option value="IN">Inflow</option>
            <option value="OUT">Outflow</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>

        <div className="flex-1 min-w-[130px] relative group">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all h-11"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>

        <div className="flex-1 min-w-[130px] relative group">
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all h-11"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm relative no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 whitespace-nowrap">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Variant Identity</th>
              <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Correction</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Activity</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 font-bold">
            {filteredHistory.map((h, i) => (
              <tr key={i} className="group hover:bg-gray-50/50 transition-all">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                    <Clock size={12} className="text-emerald-500" />
                    {new Date(h.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="text-[11px] font-black text-black uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                    {h.variantLabel}
                  </span>
                </td>

                <td className="px-6 py-5 text-center">
                  <span className={`text-xl font-black ${
                    h.transactionType === "IN" ? "text-emerald-600" : "text-black"
                  }`}>
                    {h.transactionType === "IN" ? "+" : "-"}{h.quantity}
                  </span>
                </td>

                <td className="px-6 py-5 text-right">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-sm ${
                    h.transactionType === "IN"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-black text-white border-black"
                  }`}>
                    {h.transactionType === "IN" ? (
                      <ArrowUpCircle size={14} />
                    ) : (
                      <ArrowDownCircle size={14} />
                    )}
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      {h.transactionType === "IN" ? "Restock" : "Dispatch"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredHistory.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-gray-300">
            <History size={48} className="mb-4 opacity-10" />
            <p className="font-black uppercase tracking-widest text-[10px]">No transaction history found</p>
          </div>
        )}
      </div>
    </div>
  );
}