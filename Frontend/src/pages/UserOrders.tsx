import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../state/CartContext";
import { useAuth } from "../context/AuthContext";
import { Mail, User } from "lucide-react";

/* ================= TYPES ================= */

interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string; // ✅ IMAGE COMES FROM ORDER API
}

interface Order {
  orderId: string;
  orderStatus: string;
  placedAt: string;
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
}

/* ================= COMPONENT ================= */

const UserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, clearCart } = useCart();
  const { profile } = useAuth();
  const navigate = useNavigate();

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:9090/api/orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setOrders(res.data.content || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ================= REORDER ================= */
  const handleReorder = (order: Order) => {
    clearCart();

    order.items.forEach(item => {
      addToCart({
        productId: item.productId,
        name: item.productName,
        imageUrl: item.imageUrl || "",
        variants: [
          {
            weightLabel: "Default",
            weightInGrams: 0,
            mrp: item.unitPrice,
            offerPrice: item.unitPrice,
          },
        ],
        selectedVariantIndex: 0,
        qty: item.quantity,
      });
    });

    navigate("/cart");
  };

  if (loading) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* ================= USER SUMMARY ================= */}
      <div className="bg-green-50 rounded-lg p-6 flex justify-between items-center">
        <div className="space-y-1">
          <p className="font-semibold flex items-center gap-2">
            <User size={16} />
            {profile?.firstName} {profile?.lastName}
          </p>

          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Mail size={14} />
            {profile?.email}
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">Total orders</p>
          <p className="text-xl font-bold">{orders.length}</p>
        </div>
      </div>

      {/* ================= ORDER HISTORY ================= */}
      <h2 className="font-semibold text-lg flex items-center gap-2">
        🕒 Order history
      </h2>

      <div className="bg-white rounded-lg border divide-y">
        {orders.map(order =>
          order.items.map((item, idx) => (
            <div
              key={`${order.orderId}-${idx}`}
              className="flex justify-between items-center p-5"
            >
              {/* LEFT SIDE */}
              <div className="flex gap-4 items-center">
                <img
                  src={item.imageUrl || "/placeholder.png"}
                  className="w-16 h-20 object-contain border rounded"
                  alt={item.productName}
                />

                <div>
                  <p className="font-semibold">
                    {item.productName}
                  </p>

                  <p className="text-sm mt-1">
                    ₹{item.unitPrice} × {item.quantity} ={" "}
                    <span className="font-semibold">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Order ID: {order.orderId.slice(0, 8)} |{" "}
                    {new Date(order.placedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="text-right space-y-2">
                <p className="font-semibold text-lg">
                  ₹{order.totalAmount}
                </p>

                {order.orderStatus === "SHIPPED" && (
                  <div className="flex gap-2 justify-end">
                    <button className="px-3 py-1 text-sm bg-green-800 text-white rounded">
                      Track order
                    </button>
                    <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded">
                      Shipped
                    </span>
                  </div>
                )}

                {order.orderStatus === "DELIVERED" && (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1 text-sm bg-green-800 text-white rounded"
                    >
                      Reorder item
                    </button>
                    <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded">
                      Order Delivered
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrders;