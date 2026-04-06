import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="w-full bg-white pt-2 pb-2 md:pt-3 md:pb-3">

      {/* ABOUT SECTION */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl overflow-hidden">

          {/* LEFT SIDE — TEXT */}
          <div className="py-8 sm:py-12 md:py-16 pr-8 sm:pr-12 md:pr-16">
            <h2 className="text-4xl font-bold mb-8 text-gray-900 tracking-tight">
              About <span className="text-green-600">GoMunchz</span>
            </h2>

            <div className="space-y-6 text-gray-600 leading-relaxed text-base">
              <p>
                At <span className="font-semibold text-green-700">GoMunchz</span>, we
                believe great snacks start with real ingredients. Our mission is to
                deliver healthy, delicious, and premium-quality snacks made from
                carefully sourced nuts, dry fruits, and natural ingredients.
              </p>

              <p>
                Every product is crafted to balance taste and nutrition. From
                crunchy roasted nuts to flavorful snack blends, we focus on
                preserving freshness and delivering snacks that you can enjoy
                anytime with confidence.
              </p>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-6 text-gray-700 font-medium">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                Premium quality dry fruits
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                Carefully sourced ingredients
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                Hygienic packaging standards
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                Taste with nutrition combined
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — IMAGE */}
          <div className="p-8 lg:p-12">
            <div className="relative rounded-2xl overflow-hidden max-h-[400px] shadow-2xl">
              <img
                src="https://res.cloudinary.com/dpgomcvqz/image/upload/v1775062524/a-top-down-photograph-of-a-rustic-wooden_-qH3KLv5R3C-m03chQYudA_yjZz74-eTeyItpRsbX4x5g_cover_sd_effesi.jpg"
                alt="About GoMunchz Premium Selection"
                className="w-full h-full object-cover hover:scale-105 transition duration-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SERVICE ICONS SECTION */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

          {/* PREMIUM QUALITY */}
          <div className="flex items-center gap-4 p-8 justify-center sm:justify-start">
            <div className="p-3 bg-green-50 rounded-xl">
              <ShieldCheck className="text-green-700" size={28} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm tracking-wide">
                PREMIUM QUALITY
              </p>
              <p className="text-gray-500 text-xs mt-1">
                100% Quality Guarantee
              </p>
            </div>
          </div>

          {/* SWIFT SHIPPING */}
          <div className="flex items-center gap-4 p-8 justify-center sm:justify-start">
            <div className="p-3 bg-green-50 rounded-xl">
              <Truck className="text-green-700" size={28} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm tracking-wide">
                SWIFT SHIPPING
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Delivering across India
              </p>
            </div>
          </div>

          {/* EASY RETURN */}
          <div className="flex items-center gap-4 p-8 justify-center sm:justify-start">
            <div className="p-3 bg-green-50 rounded-xl">
              <RotateCcw className="text-green-700" size={28} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm tracking-wide">
                EASY RETURN
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Hassle-free 7-day returns
              </p>
            </div>
          </div>

          {/* 24/7 SUPPORT */}
          <div className="flex items-center gap-4 p-8 justify-center sm:justify-start">
            <div className="p-3 bg-green-50 rounded-xl">
              <Headphones className="text-green-700" size={28} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm tracking-wide">
                24/7 SUPPORT
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Dedicated support team
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
