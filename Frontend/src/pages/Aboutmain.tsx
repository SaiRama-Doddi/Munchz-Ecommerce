import React from "react";
import { CheckCircle2, Leaf, Box, Heart, Activity } from "lucide-react";

export default function About() {
  return (
    <div className="w-full bg-[#fcfdfa] min-h-screen">

      {/* ================= HEADER ================= */}
      <section className="bg-green-600 py-16 md:py-24 px-6 text-center">
        <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight">
          About Us
        </h1>
        <div className="w-20 h-1 bg-white/30 mx-auto mt-6 rounded-full"></div>
      </section>

      {/* ================= CONTENT AREA ================= */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        
        {/* STORY SECTION */}
        <div className="space-y-8 text-gray-700 leading-relaxed text-lg md:text-xl">
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

          <p className="font-bold text-gray-900 border-l-4 border-green-600 pl-6 italic bg-green-50/50 py-4 rounded-r-2xl">
            Because we believe snacking should energize you, not weigh you down.
          </p>
        </div>

        {/* WHY CHOOSE SECTION */}
        <div className="mt-20 bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
            Why Choose GoMunchz
          </h2>

          <div className="grid gap-6">
            
            <FeatureItem 
              text="Premium quality dry fruits and nuts" 
              icon={<CheckCircle2 className="text-green-600" size={24} />} 
            />
            
            <FeatureItem 
              text="Carefully sourced, high-grade ingredients" 
              icon={<Leaf className="text-green-600" size={24} />} 
            />
            
            <FeatureItem 
              text="Hygienic, modern packaging standards" 
              icon={<Box className="text-green-600" size={24} />} 
            />
            
            <FeatureItem 
              text="Thoughtfully crafted flavors" 
              icon={<Heart className="text-green-600" size={24} />} 
            />
            
            <FeatureItem 
              text="A perfect balance of taste and nutrition" 
              icon={<Activity className="text-green-600" size={24} />} 
            />

          </div>
        </div>

      </main>

    </div>
  );
}

function FeatureItem({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 group p-4 rounded-xl hover:bg-green-50/50 transition-colors border border-transparent hover:border-green-100">
      <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-gray-800 font-semibold text-lg">
        {text}
      </p>
    </div>
  );
}
