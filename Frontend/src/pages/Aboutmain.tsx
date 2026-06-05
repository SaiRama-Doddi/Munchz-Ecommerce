import React from "react";

export default function About() {
  return (
    <div className="w-full min-h-screen pt-4 pb-10 md:pt-8 md:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* ================= LEFT SIDE: CONTENT ================= */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
            
            {/* HEADER AREA */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                About <span className="text-green-600">GoMunchz</span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base mt-3 leading-relaxed">
                Bringing back the goodness of real, honest ingredients and transforming them into snacks you can feel good about.
              </p>
            </div>

            {/* STORY SECTION */}
            <div className="space-y-4 md:space-y-5 text-gray-700 leading-relaxed text-sm md:text-[15px] text-justify">
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

              <div className="font-bold text-gray-900 border-l-4 border-green-600 pl-5 md:pl-6 italic py-4 rounded-r-2xl bg-green-50/40 shadow-sm mt-6">
                "Because we believe snacking should energize you, not weigh you down."
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDE: IMAGE ================= */}
          <div className="lg:col-span-4 w-full">
            <div className="relative w-full overflow-hidden rounded-[2.5rem] shadow-xl border border-green-100/50 aspect-square">
              <img 
                src="https://res.cloudinary.com/dxfdcmxze/image/upload/v1780413411/why_choose_banner_rewjth.jpg" 
                alt="Why Choose GoMunchz"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


