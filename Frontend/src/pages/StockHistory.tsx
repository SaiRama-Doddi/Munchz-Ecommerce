import { useEffect, useMemo, useState } from "react";
import inventoryApi from "../api/inventoryApi";

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

      const matchesSearch = h.variantLabel
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
    <div className="mt-8 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Stock History
      </h3>

      {/* FILTER BAR */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search variant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2"
        />

        <select
          value={variantFilter}
          onChange={(e) => setVariantFilter(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="">All Variants</option>
          {variants.map((v: any, i) => (
            <option key={i} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="">All Types</option>
          <option value="IN">Stock In</option>
          <option value="OUT">Stock Out</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded-xl px-4 py-2"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded-xl px-4 py-2"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 uppercase text-xs text-gray-600 tracking-wider">
            <tr>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Variant</th>
              <th className="px-6 py-4 text-center">Quantity</th>
              <th className="px-6 py-4 text-center">Transaction</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredHistory.map((h, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-gray-700">
                  {new Date(h.createdAt).toLocaleString()}
                </td>

                <td className="px-6 py-4 font-medium">
                  {h.variantLabel}
                </td>

                <td className="px-6 py-4 text-center font-bold text-lg">
                  {h.quantity}
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      h.transactionType === "IN"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {h.transactionType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredHistory.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No history records found.
          </div>
        )}
      </div>
    </div>
  );
}