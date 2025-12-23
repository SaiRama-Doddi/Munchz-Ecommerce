import React, { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
  productId: number;
  productName: string;
  quantityKg: number;
  unitPrice: number;
  lineTotal: number;
}

interface Order {
  orderId: number;
  userId: number;
  userName: string;
  address: string;
  totalAmount: number;
  orderStatus: string;
  items: OrderItem[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/orders")
      .then((res) => {
        setOrders(res.data.content); // backend returns { content: [...] }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      <div className="bg-white shadow rounded border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">User Name</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Items</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId} className="hover:bg-gray-50">
                <td className="p-3 border">{o.orderId}</td>
                <td className="p-3 border">{o.userName}</td>
                <td className="p-3 border">{o.address}</td>
                <td className="p-3 border font-semibold text-green-700">
                  ₹{o.totalAmount}
                </td>
                <td className="p-3 border">{o.orderStatus}</td>
                <td className="p-3 border">{o.items.length}</td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS POPUP */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-xl w-2/3 max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">
              Order #{selectedOrder.orderId}
            </h2>

            <p><strong>User:</strong> {selectedOrder.userName}</p>
            <p><strong>Address:</strong> {selectedOrder.address}</p>
            <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Items</h3>

            <table className="w-full border-collapse mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Qty (kg)</th>
                  <th className="p-2 border">Unit Price</th>
                  <th className="p-2 border">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{item.productName}</td>
                    <td className="p-2 border">{item.quantityKg}</td>
                    <td className="p-2 border">₹{item.unitPrice}</td>
                    <td className="p-2 border font-semibold text-green-700">
                      ₹{item.lineTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between mt-4 text-lg font-bold">
              <span>Total Amount</span>
              <span>₹{selectedOrder.totalAmount}</span>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 bg-red-600 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;