export default function ProductImage() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fafaf6] py-20">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT TEXT */}
        <div className="space-y-6 text-gray-900">
          <p className="uppercase tracking-[6px] text-sm text-green-600 font-medium">
            Pure Ingredients
          </p>

          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
              Real ingredients
            </h2>
            <h2 className="text-4xl md:text-6xl font-light leading-tight tracking-tight text-gray-700">
              Unreal flavor
            </h2>
          </div>

          <p className="text-xl md:text-2xl font-medium text-green-600/80 pt-2">
            Absolutely zero compromise
          </p>

          <div className="pt-8">
            <span className="inline-block text-3xl md:text-4xl font-bold tracking-tight">
              GoMunchZ
            </span>
            <div className="w-20 h-1 bg-green-500 mt-2 rounded-full"></div>
          </div>
        </div>

        {/* RIGHT PRODUCT IMAGE */}
        <div className="flex justify-center md:justify-end">
          <img
            src="/premium_snacks.png"
            alt="GoMunchZ Premium Snacks"
            className="w-full max-w-xl object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:scale-105 transition duration-700"
          />
        </div>
      </div>
    </section>
  );
}
