import React from "react";
import { Gem, Sprout, ShieldCheck, Scale, Quote } from "lucide-react";

export default function About() {
  return (
    <div className="w-full bg-[#f9faf7]">

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[360px]">
        <img
          src="https://res.cloudinary.com/dd4oiwnep/image/upload/ingredients-healthy-dessert-chia-puddings-kitchen-wooden-table_1_fiakub.jpg"
          alt="About GoMunchz"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            About <span className="text-green-400">GoMunchz</span>
          </h1>
          <p className="text-white/90 max-w-2xl text-base md:text-lg font-medium leading-relaxed">
            Bringing back the goodness of real, honest ingredients and transforming them into snacks you can feel good about.
          </p>
        </div>
      </section>

      {/* ================= WHO ARE WE ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT IMAGE */}
          <div className="w-full h-[320px] md:h-[400px] bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
             <img 
               src="https://res.cloudinary.com/dd4oiwnep/image/upload/v174098974/premium_snack_pouches_light_green_bg_1774174098974.png" 
               alt="Who we are"
               className="w-full h-full object-cover"
             />
          </div>

          {/* RIGHT TEXT */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-8 bg-green-600 rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Who are we?</h2>
            </div>

            <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-6">
              At <span className="font-bold text-green-700">GoMunchz</span>, we believe that great snacking should never be a compromise between taste and health. In a world full of processed options, our mission is simple—bring back the goodness of real, honest ingredients and transform them into snacks you can feel good about.
            </p>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              We create smarter snacking cultures. Whether you're at work, traveling, working out, or simply relaxing, our products are designed to fit seamlessly into your lifestyle while energizing you.
            </p>
          </div>
        </div>

        {/* FEATURE BOXES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16">

          <FeatureBox
            title="Premium Ingredients"
            desc="Carefully sourced high-grade nuts and fruits"
            icon={<Gem className="text-amber-600" size={24} />}
            bg="bg-amber-50 border-amber-100"
          />

          <FeatureBox
            title="Carefully Sourced"
            desc="Direct from trusted organic farmers"
            icon={<Sprout className="text-green-600" size={24} />}
            bg="bg-green-50 border-green-100"
          />

          <FeatureBox
            title="Hygienic Standards"
            desc="Modern vacuum sealed packaging"
            icon={<ShieldCheck className="text-blue-600" size={24} />}
            bg="bg-blue-50 border-blue-100"
          />

          <FeatureBox
            title="Perfect Balance"
            desc="Taste meets nutrition in every bite"
            icon={<Scale className="text-rose-600" size={24} />}
            bg="bg-rose-50 border-rose-100"
          />

        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Story</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              We specialize in crafting premium, better-for-you snacks using carefully sourced nuts, dry fruits, and natural ingredients. From light, crunchy roasted makhana to flavorful nut blends, every product is thoughtfully developed.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              What sets us apart is our commitment to quality at every step. We work closely with trusted suppliers to source the finest ingredients, process them using stringent quality and hygiene standards, and package them to retain their natural flavor and crunch.
            </p>
          </div>

          <div className="order-1 md:order-2 h-[320px] md:h-[400px] bg-gray-50 rounded-3xl overflow-hidden shadow-lg">
             <img 
               src="https://res.cloudinary.com/dd4oiwnep/image/upload/v174098974/premium_snack_pouches_pure_white_bg_1774178620329.png" 
               alt="Our Story"
               className="w-full h-full object-cover"
             />
          </div>

        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="bg-[#f9faf7] py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900">Meet the Creators</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Founder", role: "Visionary & Curator" },
              { name: "Nutritionist", role: "Quality & Health Expert" },
              { name: "Master Chef", role: "Flavor Architect" }
            ].map((member, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="h-48 w-full bg-green-50 rounded-2xl mb-4 flex items-center justify-center">
                  <span className="text-green-200 text-6xl font-bold">{member.name[0]}</span>
                </div>
                <h4 className="font-bold text-xl text-gray-900">{member.name}</h4>
                <p className="text-green-600 font-bold text-xs uppercase tracking-widest mt-1 mb-3">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm italic">
                  "Snacking should be an experience that energizes both the body and mind."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            What our snackers say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-green-50/50 p-8 rounded-3xl border border-green-100 relative group hover:bg-green-50 transition-colors"
              >
                <Quote className="absolute -top-4 right-6 text-green-200 group-hover:text-green-400 transition-colors" size={48} />

                <p className="text-gray-700 mb-6 text-lg leading-relaxed relative z-10 font-medium">
                  "The makhana is so crunchy and fresh. It's the only snack my kids ask for now. Finally, something healthy that they actually love!"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center font-bold text-green-700">
                    S
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Happy Snacker</p>
                    <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

/* ================= FEATURE CARD ================= */
function FeatureBox({
  title,
  desc,
  icon,
  bg,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className={`rounded-3xl p-6 flex flex-col items-start gap-4 border ${bg} hover:shadow-lg transition-all duration-300`}>
      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
        {icon}
      </div>

      <div>
        <h4 className="font-bold text-gray-900 text-base leading-tight">{title}</h4>
        <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
