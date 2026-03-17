import { ShieldCheck, Truck, RotateCcw, Headphones, Star, Award, Heart } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="w-full bg-white py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* STORY ARC */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* LEFT: NARATIVE */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-emerald-600"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Heritage & Vision</p>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                Crafting the Future of <br />
                <span className="text-emerald-600 italic">Gourmet Snacking</span>
              </h2>
            </div>

            <div className="space-y-6 text-[15px] font-bold text-gray-400 leading-relaxed uppercase tracking-wide">
              <p>
                At <span className="text-gray-900">Munchz Premium</span>, we curate more than just snacks; we curate experiences. Our mission is an relentless pursuit of the finest natural assets—nuts, dry fruits, and botanical blends—sourced with uncompromising standards.
              </p>
              <p>
                Each selection in our archive undergoes a rigorous quality protocol, ensuring that every bite balances nutritional density with an elite sensory experience. From our specialized roasting chambers to your doorstep, freshness is our primary directive.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {[
                "Elite Archive Selections",
                "Priority Sourcing Grid",
                "Advanced Preservation Standards",
                "Nutritional Integrity Protocol"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-50 hover:border-emerald-100 transition-all group">
                   <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Star size={14} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: VISUAL ARCHIVE */}
          <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden premium-card group shadow-2xl shadow-emerald-900/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-black/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <img
              src="/about.png"
              alt="Munchz Premium Heritage"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
            />
            {/* FLOATING BADGE */}
            <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 z-20 flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Established</p>
                  <p className="text-xl font-black text-white uppercase tracking-tighter italic">Alpha Generation</p>
               </div>
               <Award size={32} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* SERVICE TRUST GRID */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { icon: <ShieldCheck size={32} />, title: "Prestige Guarantee", sub: "100% Quality Assurance Protocol" },
            { icon: <Truck size={32} />, title: "Logistics Network", sub: "Express Priority Transfer India-wide" },
            { icon: <RotateCcw size={32} />, title: "Archive Protection", sub: "Seamless Policy Reversal Standards" },
            { icon: <Headphones size={32} />, title: "Elite Concierge", sub: "24/7 Intelligence Support Grid" }
          ].map((service, i) => (
            <div key={i} className="group premium-card bg-gray-50/30 p-10 rounded-[3rem] border border-gray-50 hover:bg-white hover:shadow-2xl shadow-emerald-900/5 transition-all duration-500">
               <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-emerald-600 shadow-sm mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                  {service.icon}
               </div>
               <h4 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-3">{service.title}</h4>
               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">{service.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
