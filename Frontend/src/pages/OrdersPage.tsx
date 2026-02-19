import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";

/* =========================
   BACKEND TYPES (match API)
========================= */

interface BackendOrderItem {
  productId: number;
  skuId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  taxAmount: number;
  discountAmount: number;
  variantLabel: string;
  imageUrl: string;
}

interface BackendOrder {
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;

  orderStatus: string;

  totalAmount: number;
  totalTax: number;
  totalDiscount: number;

  paymentId: string;
  couponCode: string;
  couponId: number;

  currency: string;

  shippingAddress: any;
  billingAddress: any;

  placedAt: string;
  updatedAt: string;

  items: BackendOrderItem[];
}




/* =========================
   HELPERS
========================= */

const parseAddress = (addr: any): string => {
  if (!addr) return "—";
  return [
    addr.addressLine1,
    addr.addressLine2,
    addr.city,
    addr.state,
    addr.pincode,
  ]
    .filter(Boolean)
    .join(", ");
};

/* =========================
   COMPONENT
========================= */

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedOrder, setSelectedOrder] =
    useState<BackendOrder | null>(null);
const [filterDays, setFilterDays] = useState<number | "ALL">("ALL");


const todayOrders = orders.filter((o) => {
  const today = new Date();
  const orderDate = new Date(o.placedAt);

  return (
    orderDate.getDate() === today.getDate() &&
    orderDate.getMonth() === today.getMonth() &&
    orderDate.getFullYear() === today.getFullYear()
  );
});

useEffect(() => {
  const token = localStorage.getItem("token");

  axios
    .get("http://localhost:9090/api/orders/adminallorders?page=0&size=200", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log("ORDER API RESPONSE:", res.data);

      // handle both pageable and non-pageable responses
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (res.data.content) {
        setOrders(res.data.content);
      } else {
        setOrders([]);
      }

      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
}, []);


  if (loading) {
    return <div className="p-10 text-center">Loading orders…</div>;
  }


  const filteredOrders = [...orders]
  // sort newest first
  .sort(
    (a, b) =>
      new Date(b.placedAt).getTime() -
      new Date(a.placedAt).getTime()
  )
  // apply date filter
  .filter((o) => {
    if (filterDays === "ALL") return true;

    const limit = new Date();
    limit.setDate(limit.getDate() - filterDays);

    return new Date(o.placedAt) >= limit;
  });



  return (
    <div className="max-w-7xl mx-auto p-6">
 
      <h1 className="text-3xl font-bold mb-6">Admin – All Orders</h1>


      
      <div className="flex gap-3 mb-4">
  {[
    { label: "All", value: "ALL" },
    { label: "Today", value: 1 },
    { label: "Last 7 days", value: 7 },
    { label: "Last 30 days", value: 30 },
  ].map((f) => (
    <button
      key={f.label}
      onClick={() => setFilterDays(f.value as any)}
      className={`px-4 py-1.5 rounded border text-sm ${
        filterDays === f.value
          ? "bg-blue-600 text-white"
          : "bg-white"
      }`}
    >
      {f.label}
    </button>
  ))}
</div>

      {/* TABLE */}
      <div className="bg-white border shadow rounded overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Order</th>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Email</th>
               <th className="p-3 border">Shipping Address</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Tax</th>
              <th className="p-3 border">Discount</th>
              <th className="p-3 border">Coupon</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Items</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
           {filteredOrders.map((o) => (

              <tr key={o.orderId} className="hover:bg-gray-50">
                <td className="p-3 border">{o.orderId}</td>
                <td className="p-3 border">{o.userName}</td>
                <td className="p-3 border">{o.userEmail}</td>
                  <td className="p-3 border">{o.shippingAddress}</td>
                <td className="p-3 border">{o.placedAt}</td>
                <td className="p-3 border font-semibold text-green-700">
                  ₹{o.totalAmount} {o.currency}
                </td>
                <td className="p-3 border">₹{o.totalTax}</td>
                <td className="p-3 border">₹{o.totalDiscount}</td>
                <td className="p-3 border">{o.couponCode || "—"}</td>
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

      {/* POPUP */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-3/4 max-h-[85vh] overflow-auto p-6 rounded shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
              Order #{selectedOrder.orderId}
            </h2>

            <p><b>User:</b> {selectedOrder.userName}</p>
            <p><b>Email:</b> {selectedOrder.userEmail}</p>
            <p><b>Placed At:</b> {selectedOrder.placedAt}</p>
            <p><b>Status:</b> {selectedOrder.orderStatus}</p>
            <p><b>Shipping:</b> {parseAddress(selectedOrder.shippingAddress)}</p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Items</h3>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Tax</th>
                  <th className="p-2 border">Discount</th>
                  <th className="p-2 border">Total</th>
                </tr>
              </thead>

              <tbody>
                {selectedOrder.items.map((i, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border flex gap-2 items-center">
                      <img
                        src={i.imageUrl}
                        className="w-10 h-10 object-cover"
                      />
                      <div>
                        <div>{i.productName}</div>
                        <div className="text-xs text-gray-500">
                          {i.variantLabel}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 border">{i.quantity}</td>
                    <td className="p-2 border">₹{i.unitPrice}</td>
                    <td className="p-2 border">₹{i.taxAmount}</td>
                    <td className="p-2 border">₹{i.discountAmount}</td>
                    <td className="p-2 border font-semibold text-green-700">
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