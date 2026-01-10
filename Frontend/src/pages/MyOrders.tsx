import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { generateInvoice } from "../utils/invoiceGenerator";

/* ======================
   TYPES
====================== */

interface OrderItem {
  productId: string;     // ✅ IMPORTANT
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string;
}

interface Order {
  orderId: string;
  userId: string;
  orderStatus: string;
  totalAmount: number;
  currency: string;
  placedAt: string;
  shippingAddress: string;
  billingAddress: string;
  items: OrderItem[];
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
}

/* ======================
   CONSTANTS
====================== */

const PAGE_SIZE = 10;
const FALLBACK_IMAGE = "/no-image.png";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ======================
   HELPERS
====================== */

// 🔥 PRODUCT IMAGE FROM PRODUCT ID
const getProductImageUrl = (productId: string) => {
  return `${API_BASE_URL}/api/products/${productId}/image`;
};

const statusStyle = (status: string) => {
  switch (status) {
    case "SHIPPED":
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "PAID":
      return "bg-yellow-100 text-yellow-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/* ======================
   COMPONENT
====================== */

export default function MyOrders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get<PageResponse<Order>>(
        `/api/orders/my?page=${page}&size=${PAGE_SIZE}`
      );
      setOrders(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading orders...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-[#fafaf5] min-h-screen">

      {/* ================= PROFILE SUMMARY ================= */}
      <div className="bg-green-50 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-4 mb-10">
        <div>
          <p className="font-semibold text-lg">
            {profile?.firstName} {profile?.lastName}
          </p>
          <p className="text-sm text-gray-600">
            {profile?.email || profile?.mobile}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Total orders</p>
          <p className="text-xl font-bold">{orders.length}</p>
        </div>
      </div>

      {/* ================= HEADER ================= */}
      <h2 className="text-xl font-semibold mb-6">Order history</h2>

      {/* ================= ORDER LIST ================= */}
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order =>
            order.items.map((item, idx) => (
              <div
                key={`${order.orderId}-${idx}`}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                 <img
  src={item.imageUrl || FALLBACK_IMAGE}
  alt={item.productName}
  className="w-20 h-20 rounded-md object-cover border"
  onError={(e) => {
    e.currentTarget.src = FALLBACK_IMAGE;
  }}
/>


                  <div>
                    <p className="font-semibold text-lg">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} • ₹{item.unitPrice}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4 flex-wrap">
                  {order.orderStatus === "SHIPPED" && (
                    <button className="px-4 py-2 bg-green-700 text-white rounded-md text-sm">
                      Track order
                    </button>
                  )}

                  {order.orderStatus === "DELIVERED" && (
                    <button className="px-4 py-2 bg-green-700 text-white rounded-md text-sm">
                      Reorder item
                    </button>
                  )}

                  <span
                    className={`px-4 py-2 rounded-md text-sm font-medium ${statusStyle(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus === "DELIVERED"
                      ? "Order Delivered"
                      : order.orderStatus}
                  </span>


                  <button
  onClick={() => generateInvoice(order, profile)}
  className="px-4 py-2 border border-green-700 text-green-700 rounded-md text-sm hover:bg-green-700 hover:text-white transition"
>
  Download Invoice
</button>

                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="self-center">
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
