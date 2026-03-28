import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Truck } from "lucide-react";
import orderApi from "../api/orderApi";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [order, setOrder] = useState<any>(null);

  // 🔒 Handle direct refresh / invalid access
  if (!state || !state.orderId) {
    navigate("/");
    return null;
  }

  const { orderId } = state as { orderId: string };

  useEffect(() => {
    orderApi.get(`/api/orders/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error("Failed to fetch order details", err));
  }, [orderId]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">

        {/* ✅ ICON */}
        <CheckCircle className="mx-auto text-green-600" size={72} />

        {/* ✅ TITLE */}
        <h1 className="text-base font-bold text-gray-800 mt-4">
          Payment Successful 🎉
        </h1>

        {/* ✅ MESSAGE */}
        <p className="text-gray-600 mt-2">
          Thank you for your order! Your payment has been processed successfully.
        </p>

        {/* ✅ TRACKING (IF SHIPROCKET READY) */}
        {order?.shiprocketShipmentId && (
          <div className="mt-6 p-4 bg-white border border-green-100 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Truck className="text-green-600" size={24} />
            </div>
            <div className="text-left">
              <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">Shiprocket Tracking</p>
              <button 
                onClick={() => navigate(`/track/${order.shiprocketShipmentId}`)}
                className="text-sm font-bold text-gray-800 hover:text-green-700 underline underline-offset-4 decoration-2 decoration-green-300"
              >
                Track Your Shipment
              </button>
            </div>
          </div>
        )}

        {/* ✅ ORDER ID */}
        <div className="mt-6 bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-mono text-xs text-gray-800 break-all">
            {orderId}
          </p>
        </div>

        {/* ✅ ACTIONS */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => navigate("/user-orders")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}