import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="w-full bg-white py-8 sm:py-10">

      {/* ABOUT SECTION */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 grid-cols-1 items-center">

        {/* LEFT SIDE — TEXT */}
        <div className="p-8 sm:p-12 md:p-16 bg-[#e3f0e8]">

          <p className="text-sm uppercase tracking-[3px] text-green-700 mb-2">
            Our Story
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-6 border-l-4 border-green-600 pl-4 text-gray-900">
            About GoMunchZ
          </h2>

          <p className="text-gray-700 leading-relaxed text-[16px] md:text-[17px] mb-4">
            At <span className="font-semibold text-green-700">GoMunchZ</span>, we
            believe great snacks start with real ingredients. Our mission is to
            deliver healthy, delicious, and premium-quality snacks made from
            carefully sourced nuts, dry fruits, and natural ingredients.
          </p>

          <p className="text-gray-700 leading-relaxed text-[16px] md:text-[17px] mb-6">
            Every product is crafted to balance taste and nutrition. From
            crunchy roasted nuts to flavorful snack blends, we focus on
            preserving freshness and delivering snacks that you can enjoy
            anytime with confidence.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-gray-700 text-[15px]">

            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              Premium quality dry fruits
            </div>

            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              Carefully sourced ingredients
            </div>

            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              Hygienic packaging standards
            </div>

            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              Taste with nutrition combined
            </div>

          </div>
        </div>

        {/* RIGHT SIDE — IMAGE */}
        <div className="relative h-[320px] sm:h-[420px] lg:h-full">

          <div className="absolute inset-0 bg-gradient-to-br from-[#dfe6dc] to-[#faeed6] -z-10"></div>

          <img
            src="/about.png"
            alt="About GoMunchZ"
            className="w-full h-full object-cover"
          />

        </div>
      </div>


      {/* SERVICE ICONS SECTION */}

      <div className="max-w-7xl mx-auto px-6 py-6 sm:py-8">
        <div className="bg-[#f7f7f7] rounded-xl shadow-sm border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">

          {/* PREMIUM QUALITY */}
          <div className="flex items-center gap-4 p-6 justify-center sm:justify-start">
            <ShieldCheck className="text-green-700" size={32} />
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                PREMIUM QUALITY
              </p>
              <p className="text-gray-500 text-sm">
                100% Quality Guarantee
              </p>
            </div>
          </div>

          {/* SWIFT SHIPPING */}
          <div className="flex items-center gap-4 p-6 justify-center sm:justify-start">
            <Truck className="text-green-700" size={32} />
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                SWIFT SHIPPING
              </p>
              <p className="text-gray-500 text-sm">
                Delivering across India
              </p>
            </div>
          </div>

          {/* EASY RETURN */}
          <div className="flex items-center gap-4 p-6 justify-center sm:justify-start">
            <RotateCcw className="text-green-700" size={32} />
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                EASY RETURN
              </p>
              <p className="text-gray-500 text-sm">
                Refer return policy
              </p>
            </div>
          </div>

          {/* 24/7 SUPPORT */}
          <div className="flex items-center gap-4 p-6 justify-center sm:justify-start">
            <Headphones className="text-green-700" size={32} />
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                24/7 SUPPORT
              </p>
              <p className="text-gray-500 text-sm">
                Support every time
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
