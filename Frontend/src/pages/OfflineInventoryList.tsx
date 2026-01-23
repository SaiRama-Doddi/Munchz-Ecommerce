import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import offlineInventoryApi from "../api/offlineInventoryApi";

export default function OfflineInventoryList() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD STOCK ================= */
  const loadStocks = async () => {
    setLoading(true);
    try {
      const res = await offlineInventoryApi.get("/stock/api/admin/offline-inventory");
      setStocks(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load offline inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  /* ================= DELETE ================= */
  const deleteStock = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this stock?")) return;

    try {
      await offlineInventoryApi.delete(`/stock/api/admin/offline-inventory/${id}`);
      loadStocks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete stock");
    }
  };

  /* ================= EDIT ================= */
  const editStock = (stock: any) => {
    navigate("/offline-inventory/add", {
      state: { stock }
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Offline Inventory</h1>

        <button
          onClick={() => navigate("/offline-inventory/add")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Offline Stock
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : stocks.length === 0 ? (
        <p className="text-gray-500">No offline stock available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Category</th>
                <th className="border px-3 py-2">Product</th>
                <th className="border px-3 py-2">Variant</th>
                <th className="border px-3 py-2">Quantity</th>
                <th className="border px-3 py-2">Min</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {stocks.map(stock => (
                <tr key={stock.id} className="text-center">
                  <td className="border px-3 py-2">
                    {stock.categoryName || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {stock.productName}
                  </td>
                  <td className="border px-3 py-2">
                    {stock.variantLabel}
                  </td>
                  <td className="border px-3 py-2">
                    {stock.quantity}
                  </td>
                  <td className="border px-3 py-2">
                    {stock.minThreshold}
                  </td>
                  <td className="border px-3 py-2 space-x-2">
                    <button
                      onClick={() => editStock(stock)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteStock(stock.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
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
