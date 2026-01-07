import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../api/inventoryApi";

export default function StockList() {
  const [stocks, setStocks] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchStock = async () => {
    const res = await inventoryApi.get("/inventory");
    setStocks(res.data);
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const deleteStock = async (id: number) => {
    if (!window.confirm("Delete this stock?")) return;
    await inventoryApi.delete(`/inventory/${id}`);
    fetchStock();
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Stock Inventory</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Product</th>
            <th>Variant</th>
            <th>Qty</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((s) => (
            <tr key={s.id} className="border-t text-center">
              <td>{s.productName}</td>
              <td>{s.variantLabel}</td>
              <td>{s.quantity}</td>
              <td>{s.categoryName}</td>
              <td className="space-x-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() =>
                    navigate("/addstock", { state: { stock: s } })
                  }
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => deleteStock(s.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
