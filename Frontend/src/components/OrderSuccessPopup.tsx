import { CheckCircle } from "lucide-react";

export default function OrderSuccessPopup() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-[90%] max-w-md text-center shadow-xl animate-fadeIn">
        <CheckCircle size={72} className="text-green-600 mx-auto mb-4" />

        <h2 className="text-base font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h2>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="text-sm text-gray-500">
          Redirecting to home page...
        </div>
      </div>
    </div>
  );
}
