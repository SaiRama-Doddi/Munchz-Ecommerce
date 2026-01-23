import { useEffect, useState } from "react";
import inventoryApi from "../api/inventoryApi";
import offlineInventoryApi from "../api/offlineInventoryApi";

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

  const loadAllStock = async () => {
    setLoading(true);

    try {
      const [onlineRes, offlineRes] = await Promise.all([
        inventoryApi.get("/stock/api/inventory"),
        offlineInventoryApi.get("/stock/api/admin/offline-inventory"),
      ]);

      const online = onlineRes.data;
      const offline = offlineRes.data;

      const map = new Map<string, StockRow>();

      /* ================= ONLINE STOCK ================= */
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

      /* ================= OFFLINE STOCK ================= */
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

      /* ================= CALCULATE TOTAL ================= */
      map.forEach((row) => {
        row.totalQty = row.onlineQty + row.offlineQty;
      });

      setRows(Array.from(map.values()));
    } catch (error) {
      console.error("Failed to load complete stock", error);
      alert("Failed to load complete stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllStock();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        Complete Stock (Offline + Online + Total)
      </h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-gray-500 text-center">No stock available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-center text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Product</th>
                <th className="border px-3 py-2">Variant</th>
                <th className="border px-3 py-2">Category</th>
                <th className="border px-3 py-2">Offline Qty</th>
                <th className="border px-3 py-2">Online Qty</th>
                <th className="border px-3 py-2 font-semibold">Total Qty</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="border px-3 py-2">{r.productName}</td>
                  <td className="border px-3 py-2">{r.variantLabel}</td>
                  <td className="border px-3 py-2">{r.categoryName || "-"}</td>
                  <td className="border px-3 py-2">{r.offlineQty}</td>
                  <td className="border px-3 py-2">{r.onlineQty}</td>
                  <td className="border px-3 py-2 font-bold text-green-700">
                    {r.totalQty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
