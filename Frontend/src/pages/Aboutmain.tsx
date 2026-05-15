import React from "react";

export default function About() {
  return (
    <div className="w-full min-h-screen pt-4 pb-10 md:pt-6 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* ================= HEADER AREA ================= */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            About <span className="text-green-600">GoMunchz</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Bringing back the goodness of real, honest ingredients and transforming them into snacks you can feel good about.
          </p>
        </div>

        {/* ================= CONTENT AREA ================= */}
        <main className="flex flex-col gap-2">
          
          {/* STORY SECTION */}
          <div className="space-y-5 text-gray-700 leading-relaxed text-sm text-justify">
            <p>
              At <span className="text-green-700 font-bold tracking-tight">GoMunchz</span>, we believe that great snacking should never be a compromise between taste and health. In a world full of processed options, our mission is simple—bring back the goodness of real, honest ingredients and transform them into snacks you can feel good about.
            </p>

            <p>
              We specialize in crafting premium, better-for-you snacks using carefully sourced nuts, dry fruits, and natural ingredients. From light, crunchy roasted makhana to flavorful nut blends, every product is thoughtfully developed to deliver the perfect balance of taste, nutrition, and freshness.
            </p>

            <p>
              What sets us apart is our commitment to quality at every step. We work closely with trusted suppliers to source the finest ingredients, process them using stringent quality and hygiene standards, and package them to retain their natural flavor and crunch. The result is a range of snacks that are clean, wholesome, and consistently satisfying.
            </p>

            <p>
              At GoMunchz, we’re not just building a snack brand—we’re creating a smarter snacking culture. Whether you're at work, traveling, working out, or simply relaxing, our products are designed to fit seamlessly into your lifestyle.
            </p>

            <p className="font-bold text-gray-900 border-l-4 border-green-600 pl-6 italic bg-white/80 backdrop-blur-md py-5 rounded-r-2xl shadow-sm">
              Because we believe snacking should energize you, not weigh you down.
            </p>
          </div>

          {/* WHY CHOOSE SECTION - REPLACED WITH PREMIUM BANNER */}
          <div className="relative w-full overflow-hidden rounded-3xl shadow-lg border border-green-50 h-[260px] sm:h-[380px] md:h-[480px] lg:h-[75vh]">
            <img 
              src="https://res.cloudinary.com/dxfdcmxze/image/upload/v1778814027/why_choose_banner.jpg_imekt0.jpg" 
              alt="Why Choose GoMunchz"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

        </main>
      </div>
    </div>
  );
}


