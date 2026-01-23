import { useEffect, useState } from "react";
import inventoryApi from "../api/inventoryApi";

export default function StockHistory({ productId }: { productId: number }) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    inventoryApi.get(`/stock/api/inventory/history/${productId}`)
      .then(res => setHistory(res.data));
  }, [productId]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Stock History</h3>

      <table className="w-full mt-2 border">
        <thead>
          <tr className="bg-gray-100">
            <th>Date</th>
            <th>Variant</th>
            <th>Qty</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          {history.map((h, i) => (
            <tr key={i}>
              <td>{new Date(h.createdAt).toLocaleString()}</td>
              <td>{h.variantLabel}</td>
              <td>{h.quantity}</td>
              <td>{h.transactionType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
