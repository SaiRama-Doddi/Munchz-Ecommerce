import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../api/inventoryApi";

export default function AdminStockDetails() {
  const [stocks, setStocks] = useState<any[]>([]);
  const navigate = useNavigate();

  const loadData = async () => {
    const res = await inventoryApi.get("/inventory/entries");
    setStocks(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteStock = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this stock?")) return;
    await inventoryApi.delete(`/inventory/entries/${id}`);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow">

      <h2 className="text-2xl font-semibold mb-6">Stock Inventory Details</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Sub Category</th>
              <th className="border p-2">Product</th>

              <th className="border p-2">Supplier</th>
              <th className="border p-2">GST</th>

              <th className="border p-2">Quantity</th>
              <th className="border p-2">Purchase Price</th>
              <th className="border p-2">Selling Price</th>

              <th className="border p-2">Stock In Date</th>
              <th className="border p-2">Expiry Date</th>

              <th className="border p-2">Remarks</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((s) => (
              <tr key={s.id} className="text-center hover:bg-gray-50">

                <td className="border p-2">{s.id}</td>
                <td className="border p-2">{s.categoryName}</td>
                <td className="border p-2">{s.subCategoryName || "-"}</td>
                <td className="border p-2 font-medium">{s.productName}</td>

                <td className="border p-2">{s.supplierName}</td>
                <td className="border p-2">{s.supplierGst}</td>

                <td className="border p-2">{s.quantity}</td>
                <td className="border p-2">₹{s.purchasePrice}</td>
                <td className="border p-2">₹{s.sellingPrice}</td>

                <td className="border p-2">{s.stockInDate}</td>
                <td className="border p-2">{s.expiryDate}</td>

                <td className="border p-2">{s.remarks || "-"}</td>

                <td className="border p-2 space-x-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() =>
                      navigate("/adminStockEntry", { state: { stock: s } })
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
    </div>
  );
}
