import React from "react";
import { useNavigate } from "react-router-dom";

export default function GiftingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center px-4 py-8 md:py-16">
      <div className="max-w-6xl w-full mx-auto">
        {/* Banner Image Container */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-gray-100 mb-8 group">
          <img
            src="https://res.cloudinary.com/dxfdcmxze/image/upload/v1780413412/gifts_coming_soon_banner_ysz6lu.png"
            alt="Gifting Coming Soon Banner"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>

        {/* Message and Call to Actions */}
        <div className="text-center">
          <p className="text-gray-500 text-base md:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
            Our premium curated gifting hampers and custom snack boxes are on their way. Stay tuned to make your celebrations extra special!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/productpage")}
              className="w-full sm:w-auto px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-center"
            >
              Explore Our Snacks
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all text-center"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

