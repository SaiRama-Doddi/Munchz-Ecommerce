import React, { useEffect, useState } from "react";
import axios from "axios";

/* =========================
   BACKEND RESPONSE TYPES
========================= */

interface BackendOrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface BackendOrder {
  orderId: string;            // ✅ MUST MATCH BACKEND
  userId: string;
  orderStatus: string;
  totalAmount: number;
  shippingAddress?: string;   // JSON STRING
  billingAddress?: string;    // JSON STRING
  items: BackendOrderItem[];
}

/* =========================
   UI TYPES
========================= */

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Order {
  orderId: string;
  userId: string;
  address: string;
  totalAmount: number;
  orderStatus: string;
  items: OrderItem[];
}

/* =========================
   HELPERS
========================= */

const parseAddress = (json?: string): string => {
  if (!json) return "—";
  try {
    const a = JSON.parse(json);
    return [
      a.addressLine1,
      a.addressLine2,
      a.city,
      a.state,
      a.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  } catch {
    return "—";
  }
};

/* =========================
   COMPONENT
========================= */

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:9090/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const mapped: Order[] = res.data.content.map(
          (o: BackendOrder) => ({
            orderId: o.orderId, // ✅ FIXED
            userId: o.userId,
            orderStatus: o.orderStatus,
            totalAmount: o.totalAmount,
            address: parseAddress(o.shippingAddress), // ✅ FIXED
            items: (o.items ?? []).map((i) => ({
              productName: i.productName,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              lineTotal: i.lineTotal,
            })),
          })
        );

        setOrders(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ORDERS ERROR:", err.response?.data || err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading orders…</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin – All Orders</h1>

      {/* TABLE */}
      <div className="bg-white border shadow rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">User ID</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Items</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId} className="hover:bg-gray-50">
                <td className="p-3 border">{o.orderId}</td>
                <td className="p-3 border">{o.userId}</td>
                <td className="p-3 border">{o.address}</td>
                <td className="p-3 border text-green-700 font-semibold">
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

      {/* DETAILS POPUP */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-xl w-2/3 max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">
              Order #{selectedOrder.orderId}
            </h2>

            <p><b>User:</b> {selectedOrder.userId}</p>
            <p><b>Shipping Address:</b> {selectedOrder.address}</p>
            <p><b>Status:</b> {selectedOrder.orderStatus}</p>

            <h3 className="text-xl font-semibold mt-4">Items</h3>

            <table className="w-full mt-2 border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((i, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{i.productName}</td>
                    <td className="p-2 border">{i.quantity}</td>
                    <td className="p-2 border">₹{i.unitPrice}</td>
                    <td className="p-2 border text-green-700 font-semibold">
                      ₹{i.lineTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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