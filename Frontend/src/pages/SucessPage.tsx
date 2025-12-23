
import { useLocation, useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <div className="p-10">No order found</div>;

  return (
    <div className="max-w-3xl mx-auto p-10 text-center">
      <h1 className="text-4xl font-bold text-green-600">Order Confirmed!</h1>

      <p className="text-lg mt-4">
        Your order has been placed successfully.
      </p>

      <div className="border rounded p-4 mt-6 bg-white shadow text-left">
        <h2 className="text-xl font-semibold mb-2">Order Details</h2>

        <p><b>Order ID:</b> {state.orderId}</p>
        <p><b>Total Amount:</b> ₹{state.totalAmount}</p>
        <p><b>Status:</b> {state.orderStatus}</p>

        <h3 className="font-semibold mt-4">Items</h3>
        <ul className="mt-2">
          {state.items.map((item: any, idx: number) => (
            <li key={idx} className="border-b py-2">
              {item.productName} × {item.quantityKg} — ₹{item.lineTotal}
            </li>
          ))}
        </ul>
      </div>

      <button
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
}