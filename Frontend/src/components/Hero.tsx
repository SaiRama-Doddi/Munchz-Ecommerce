import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HERO_IMAGES = [
  "/hero.png",
  "https://www.shutterstock.com/image-photo/healthy-snack-mixed-nuts-dried-600nw-2309692033.jpg",
  "https://img.pikbest.com/origin/10/01/82/867pIkbEsTAIq.png!w700wp",
  "https://nutribinge.in/cdn/shop/articles/Unveiling_the_Essence_of_Dry_Fruits_in_Indian_Festivities.jpg?v=1713257842",
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="mt-4 sm:mt-6 lg:mt-8 max-w-7xl mx-auto px-4">
      <div className="relative w-full overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm h-[400px] sm:h-[450px] lg:h-[500px] flex flex-col md:flex-row">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-10">
          <p className="text-green-600 font-semibold text-lg mb-4">Pure Ingredients</p>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#0f172a] leading-tight">
            Real ingredients
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-normal text-gray-400 mb-8 leading-tight">
            Unreal flavor
          </h2>
          
          <p className="text-green-600 font-medium text-lg mb-12">Absolutely zero compromise</p>
          
          <div className="flex flex-col items-start">
            <span className="text-3xl font-extrabold text-[#0f172a] relative">
              GoMunchz
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-green-500"></div>
            </span>
          </div>
        </div>

        {/* Right Image Container */}
        <div className="flex-1 relative bg-[#e7f5e9] md:rounded-l-[100px] overflow-hidden">
          <img
            src="https://nutribinge.in/cdn/shop/articles/Unveiling_the_Essence_of_Dry_Fruits_in_Indian_Festivities.jpg?v=1713257842"
            alt="Healthy snacks"
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e7f5e9] via-transparent to-transparent hidden md:block w-32"></div>
        </div>

      </div>
    </section>
  );
}
