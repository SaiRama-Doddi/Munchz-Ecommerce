import { Leaf, Flame, Sparkles } from "lucide-react";

export default function ProductImage() {
  const steps = [
    {
      icon: <Leaf className="w-6 h-6 transition-colors duration-300 text-green-600 group-hover:text-white" />,
      title: "Premium Sourcing",
      desc: "We handpick only the finest, largest Foxnuts (Makhana) and premium dry fruits directly from sustainable farms.",
      badge: "100% Natural",
      badgeColor: "bg-green-50 text-green-700 border-green-200/60",
    },
    {
      icon: <Flame className="w-6 h-6 transition-colors duration-300 text-amber-600 group-hover:text-white" />,
      title: "Oil-Free Roasting",
      desc: "Slow-roasted to crunchy perfection without a single drop of palm oil, preserving natural nutrients and taste.",
      badge: "Roasted, Not Fried",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200/60",
    },
    {
      icon: <Sparkles className="w-6 h-6 transition-colors duration-300 text-green-600 group-hover:text-white" />,
      title: "Signature Seasoning",
      desc: "Tossed in small batches with our secret blend of natural spices and herbs for a burst of unreal flavor.",
      badge: "Real Spices",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-green-50/20 via-white to-amber-50/25 pt-12 pb-4 md:pt-20 md:pb-6 lg:pt-24 lg:pb-8">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* LEFT SIDE: TEXT & PROCESS */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-green-700 bg-green-50 border border-green-200/50 uppercase">
                🌱 The GoMunchz Promise
              </span>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Real ingredients. <span className="text-green-600">Unreal flavor.</span>
              </h2>
              
              <p className="text-gray-500 text-sm mt-3 max-w-lg leading-relaxed">
                We believe snacking should be exciting, clean, and completely guilt-free. Here's a look at the thoughtful process behind every premium pack of GoMunchz.
              </p>
            </div>

            {/* PROCESS CARDS */}
            <div className="grid gap-6">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="group flex flex-col sm:flex-row gap-5 p-5 sm:p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  {/* ICON WRAPPER */}
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 group-hover:bg-green-600 transition-all duration-300">
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </span>
                  </div>

                  {/* STEP CONTENT */}
                  <div className="flex-grow space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                        {step.title}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: PRODUCT SHOWCASE */}
          <div className="lg:col-span-5 flex items-center justify-center relative lg:h-full w-full min-h-[300px] lg:min-h-0 group">
            {/* Elegant Glowing Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-100/40 via-amber-100/25 to-transparent rounded-[2.5rem] blur-2xl transform rotate-3 scale-95 -z-10" />
            
            <img
              src="https://res.cloudinary.com/dxfdcmxze/image/upload/v1780478793/all_makhana_flavour_rrkwf9.jpg"
              alt="GoMunchz Premium Snacks"
              className="w-full h-full max-h-[400px] lg:max-h-[500px] object-contain p-4 group-hover:scale-105 transition duration-700 ease-out select-none filter drop-shadow-[0_20px_40px_rgba(22,101,52,0.18)]"
            />

            {/* Floating Badges */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-green-50/60 flex items-center gap-1.5 text-xs font-bold text-gray-800 transition-all duration-300 hover:scale-105">
              <span className="text-base">✨</span> Guilt-Free Snacking
            </div>
            
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-amber-50/60 flex items-center gap-1.5 text-xs font-bold text-gray-800 transition-all duration-300 hover:scale-105">
              <span className="text-base">❌</span> Zero Palm Oil
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
