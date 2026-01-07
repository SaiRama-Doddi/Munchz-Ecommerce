import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // 🔒 Handle direct refresh / invalid access
  if (!state || !state.orderId) {
    navigate("/");
    return null;
  }

  const { orderId } = state as { orderId: string };

  return (
    <div className="min-h-screen bg-[#f6fff4] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">

        {/* ✅ ICON */}
        <CheckCircle className="mx-auto text-green-600" size={72} />

        {/* ✅ TITLE */}
        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          Payment Successful 🎉
        </h1>

        {/* ✅ MESSAGE */}
        <p className="text-gray-600 mt-2">
          Thank you for your order! Your payment has been processed successfully.
        </p>

        {/* ✅ ORDER ID */}
        <div className="mt-6 bg-gray-50 border rounded-lg p-4">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-mono text-sm text-gray-800 break-all">
            {orderId}
          </p>
        </div>

        {/* ✅ ACTIONS */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => navigate("/orders")}
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
