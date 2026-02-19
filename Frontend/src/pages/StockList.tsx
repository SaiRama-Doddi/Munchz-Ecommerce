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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Inventory Stocks</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Manage and monitor product stock levels
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/addstock")}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-[1.03] transition"
          >
            + Add Stock
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Variant</th>
                <th className="px-6 py-4 text-center">Quantity</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {stocks.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {s.productName}
                  </td>

                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {s.variantLabel}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center font-bold text-lg text-emerald-600">
                    {s.quantity}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {s.categoryName}
                  </td>

                  <td className="px-6 py-4 text-center space-x-3">
                    <button
                      onClick={() =>
                        navigate("/admin/addstock", { state: { stock: s } })
                      }
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition text-xs font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteStock(s.id)}
                      className="px-4 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {stocks.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              No stock records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}