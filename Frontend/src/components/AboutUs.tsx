import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";
import { optimizeCloudinaryUrl } from "../utils/imageUtils";

export default function AboutUs() {
  return (
    <section className="w-full bg-white pt-0 pb-0">

      {/* ABOUT SECTION */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl overflow-hidden">

          {/* LEFT SIDE — TEXT */}
          <div className="py-3 md:py-5 pr-2 md:pr-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">
              About <span className="text-green-600">GoMunchz</span>
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base text-justify">
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
          </div>

          {/* RIGHT SIDE — IMAGE */}
          <div className="p-3 lg:p-4 flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-square">
              <img
                src={optimizeCloudinaryUrl("https://res.cloudinary.com/dxfdcmxze/image/upload/f_auto,q_auto/v1780413409/About_GoMunchz_banner_thvxg8.jpg", 600)}
                alt="About GoMunchz Premium Selection"
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SERVICE ICONS SECTION */}
      <div className="max-w-7xl mx-auto px-4 mt-2">
        <div className="bg-white rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100">

          {/* PREMIUM QUALITY */}
          <div className="flex items-center gap-4 py-4 px-6 md:py-5 justify-start">
            <div className="p-2.5 bg-green-50 rounded-xl">
              <ShieldCheck className="text-green-700" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs tracking-wide">
                PREMIUM QUALITY
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                100% Quality Guarantee
              </p>
            </div>
          </div>

          {/* SWIFT SHIPPING */}
          <div className="flex items-center gap-4 py-4 px-6 md:py-5 justify-start">
            <div className="p-2.5 bg-green-50 rounded-xl">
              <Truck className="text-green-700" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs tracking-wide">
                SWIFT SHIPPING
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                Delivering across India
              </p>
            </div>
          </div>

          {/* EASY RETURN */}
          <div className="flex items-center gap-4 py-4 px-6 md:py-5 justify-start">
            <div className="p-2.5 bg-green-50 rounded-xl">
              <RotateCcw className="text-green-700" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs tracking-wide">
                EASY RETURN
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                Hassle-free 7-day returns
              </p>
            </div>
          </div>

          {/* 24/7 SUPPORT */}
          <div className="flex items-center gap-4 py-4 px-6 md:py-5 justify-start">
            <div className="p-2.5 bg-green-50 rounded-xl">
              <Headphones className="text-green-700" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs tracking-wide">
                24/7 SUPPORT
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                Dedicated support team
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
