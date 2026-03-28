import React from "react";
import { CheckCircle2, Leaf, Box, Heart, Activity } from "lucide-react";

export default function About() {
  return (
    <div className="w-full bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* ================= HEADER AREA ================= */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            About <span className="text-green-600">GoMunchz</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-3 leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis">
            Bringing back the goodness of real, honest ingredients and transforming them into snacks you can feel good about.
          </p>
          <div className="w-16 h-[3px] bg-green-600 mt-4 md:mt-6"></div>
        </div>

        {/* ================= CONTENT AREA ================= */}
        <main className="grid lg:grid-cols-1 gap-12">
          
          {/* STORY SECTION */}
          <div className="space-y-8 text-gray-700 leading-relaxed text-base md:text-xl text-justify">
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

            <p className="font-bold text-gray-900 border-l-4 border-green-600 pl-6 italic bg-white py-5 rounded-r-2xl">
              Because we believe snacking should energize you, not weigh you down.
            </p>
          </div>

          {/* WHY CHOOSE SECTION */}
          <div className="mt-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-green-50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-green-600 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Why Choose GoMunchz
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
              
              <FeatureItem 
                text="Premium quality dry fruits and nuts" 
                icon={<CheckCircle2 className="text-green-600" size={20} />} 
              />
              
              <FeatureItem 
                text="Carefully sourced, high-grade ingredients" 
                icon={<Leaf className="text-green-600" size={20} />} 
              />
              
              <FeatureItem 
                text="Hygienic, modern packaging standards" 
                icon={<Box className="text-green-600" size={20} />} 
              />
              
              <FeatureItem 
                text="Thoughtfully crafted flavors" 
                icon={<Heart className="text-green-600" size={20} />} 
              />
              
              <FeatureItem 
                text="A perfect balance of taste and nutrition" 
                icon={<Activity className="text-green-600" size={20} />} 
              />

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

function FeatureItem({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 group p-3 rounded-xl hover:bg-green-50 transition-all border border-transparent hover:border-green-100">
      <div className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-gray-800 font-semibold text-base leading-tight">
        {text}
      </p>
    </div>
  );
}
