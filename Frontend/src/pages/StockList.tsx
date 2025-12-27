import { useEffect, useState } from "react";
import inventoryApi from "../api/inventoryApi";

export default function StockList() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newQty, setNewQty] = useState("");

  /* ================= LOAD STOCK ================= */
  const fetchStock = async () => {
    try {
      const res = await inventoryApi.get("/inventory");
      setStocks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  /* ================= UPDATE STOCK ================= */
  const updateStock = async (stock: any) => {
    if (!newQty) return alert("Enter quantity");

    try {
      await inventoryApi.post("/inventory/add", {
        categoryId: stock.categoryId,
        categoryName: stock.categoryName,
        subCategoryId: stock.subCategoryId,
        subCategoryName: stock.subCategoryName,
        productId: stock.productId,
        productName: stock.productName,
        variant: stock.variantLabel,
        quantity: Number(newQty),
      });

      setEditingId(null);
      setNewQty("");
      fetchStock();
    } catch (err) {
      alert("Update failed");
    }
  };

  /* ================= DELETE STOCK ================= */
  const deleteStock = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await inventoryApi.delete(`/inventory/${id}`);
      fetchStock();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Stock Inventory</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Product</th>
            <th>Variant</th>
            <th>Qty</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.productName}</td>
              <td>{s.variantLabel}</td>
              <td>
                {editingId === s.id ? (
                  <input
                    type="number"
                    className="border px-2 py-1 w-20"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                  />
                ) : (
                  s.quantity
                )}
              </td>
              <td>{s.categoryName}</td>
              <td className="space-x-2">
                {editingId === s.id ? (
                  <>
                    <button
                      onClick={() => updateStock(s)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingId(s.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStock(s.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
