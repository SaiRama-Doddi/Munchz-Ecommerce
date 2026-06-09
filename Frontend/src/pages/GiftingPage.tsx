import React from "react";
import { useNavigate } from "react-router-dom";

export default function GiftingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col">
      {/* Banner Image Container - Full view to prevent cropping */}
      <div className="w-full bg-gray-50">
        <img
          src="https://res.cloudinary.com/dxfdcmxze/image/upload/f_auto,q_auto/v1780413412/gifts_coming_soon_banner_ysz6lu.png"
          alt="Gifting Coming Soon Banner"
          className="w-full h-auto block"
          loading="lazy"
        />
      </div>

      {/* Message and Call to Actions */}
      <div className="max-w-6xl w-full mx-auto px-4 py-6 md:py-10 text-center">
        <p className="text-gray-500 text-sm md:text-base max-w-6xl mx-auto mb-6 leading-relaxed lg:whitespace-nowrap">
          Our premium curated gifting hampers and custom snack boxes are on their way. Stay tuned to make your celebrations extra special!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/productpage")}
            className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-center cursor-pointer"
          >
            Explore Our Snacks
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all text-center cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

