export default function ProductImage() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-2 pb-5 md:pt-3 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT TEXT */}
        <div className="space-y-6 text-gray-900">
          <p className="text-base font-medium text-green-600/80">
            Pure Ingredients
          </p>

          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            Real ingredients <span className="font-light text-gray-700 italic">Unreal flavor</span>
          </h2>

          <p className="text-base font-medium text-green-600/80 pt-2">
            Absolutely zero compromise
          </p>

          <div className="pt-8">
            <span className="inline-block text-3xl md:text-4xl font-bold tracking-tight">
              GoMunchz
            </span>

          </div>
        </div>

        {/* RIGHT PRODUCT IMAGE */}
        <div className="flex justify-center md:justify-end">
          <img
            src="/premium_snacks.png"
            alt="GoMunchz Premium Snacks"
            className="w-full max-w-lg max-h-[300px] md:max-h-[400px] object-contain hover:scale-105 transition duration-700"
          />
        </div>
      </div>
    </section>
  );
}
