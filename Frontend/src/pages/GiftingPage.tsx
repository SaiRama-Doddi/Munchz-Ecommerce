import React from "react";
import { Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GiftingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Gift className="text-green-600 w-12 h-12" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
        Coming Soon
      </h1>
      <p className="text-gray-500 text-lg text-center max-w-md mb-8">
        We're working on something special! Our curated gifting options will be available shortly. Stay tuned for premium snack boxes and hampers.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transition-all"
      >
        Back to Home
      </button>
    </div>
  );
}
