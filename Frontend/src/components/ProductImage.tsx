import { Leaf, Flame, Sparkles, Heart, ShieldCheck } from "lucide-react";

export default function ProductImage() {
  const steps = [
    {
      icon: <Leaf className="w-5 h-5 transition-colors duration-300 text-green-600 group-hover:text-white" />,
      title: "Premium Sourcing",
      desc: "We handpick only the finest, largest Foxnuts (Makhana) and premium dry fruits directly from sustainable farms.",
      badge: "100% Natural",
      badgeColor: "bg-green-50 text-green-700 border-green-200/60",
    },
    {
      icon: <Flame className="w-5 h-5 transition-colors duration-300 text-amber-600 group-hover:text-white" />,
      title: "Oil-Free Roasting",
      desc: "Slow-roasted to crunchy perfection without a single drop of palm oil, preserving natural nutrients and taste.",
      badge: "Roasted, Not Fried",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200/60",
    },
    {
      icon: <Sparkles className="w-5 h-5 transition-colors duration-300 text-green-600 group-hover:text-white" />,
      title: "Signature Seasoning",
      desc: "Tossed in small batches with our secret blend of natural spices and herbs for a burst of unreal flavor.",
      badge: "Real Spices",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    },
    {
      icon: <Heart className="w-5 h-5 transition-colors duration-300 text-rose-500 group-hover:text-white" />,
      title: "Guilt-Free Snacking",
      desc: "Enjoy your favorite treats without any regrets—nutrient-rich, low-calorie, and crafted with health in mind.",
      badge: "Healthy Choice",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200/60",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 transition-colors duration-300 text-teal-600 group-hover:text-white" />,
      title: "Zero Palm Oil",
      desc: "Cooked using only premium, heart-friendly healthy fats, completely free from cheap palm oil and trans fats.",
      badge: "100% Clean",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200/60",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-green-50/20 via-white to-amber-50/25 pt-4 pb-4 md:pt-6 md:pb-6 lg:pt-8 lg:pb-6">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT SIDE: TEXT & PROCESS */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div className="space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-green-700 bg-green-50 border border-green-200/50 uppercase">
                🌱 The GoMunchz Promise
              </span>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Real ingredients. <span className="text-green-600">Unreal flavor.</span>
              </h2>
              
              <p className="text-gray-500 text-sm mt-1.5 max-w-none leading-relaxed">
                We believe snacking should be exciting, clean, and completely guilt-free. Here's a look at the thoughtful process behind every premium pack of GoMunchz.
              </p>
            </div>

            {/* PROCESS CARDS */}
            <div className="grid gap-3">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="group flex flex-col sm:flex-row gap-4 p-3.5 sm:p-4 bg-white/70 backdrop-blur-md rounded-xl border border-gray-100 hover:border-green-200 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  {/* ICON WRAPPER */}
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 group-hover:bg-green-600 transition-all duration-300">
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </span>
                  </div>

                  {/* STEP CONTENT */}
                  <div className="flex-grow space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                        {step.title}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-[13px] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: PRODUCT SHOWCASE */}
          <div className="lg:col-span-5 flex items-stretch h-full w-full group">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm bg-[#1d130e] border border-gray-100 flex items-stretch min-h-[400px] lg:min-h-0">
              {/* Elegant Glowing Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-100/40 via-amber-100/25 to-transparent rounded-2xl blur-2xl transform rotate-3 scale-95 -z-10" />
              
              <img
                src="https://res.cloudinary.com/dxfdcmxze/image/upload/v1780908877/The_GoMunchz_Promise_nlyir6.png"
                alt="The GoMunchz Promise"
                className="w-full h-full object-contain rounded-2xl group-hover:scale-[1.01] transition duration-700 ease-out select-none"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
