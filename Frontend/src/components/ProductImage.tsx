export default function ProductImage() {
  return (
    <section className="relative w-full overflow-hidden bg-white border-y border-green-50">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 items-center">
        
        {/* LEFT TEXT */}
        <div className="py-12 md:py-20 space-y-6">
          <p className="text-xl md:text-2xl font-bold text-green-600/90 tracking-tight">
            Pure Ingredients
          </p>

          <div className="space-y-0">
            <h2 className="text-4xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
              Real ingredients
            </h2>
            <h2 className="text-4xl md:text-7xl font-normal text-gray-400/60 leading-tight tracking-tight">
              Unreal flavor
            </h2>
          </div>

          <p className="text-xl md:text-2xl font-bold text-green-600/90 tracking-tight pt-4">
            Absolutely zero compromise
          </p>

          <div className="pt-8">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              GoMunchz
            </h3>
            <div className="w-14 h-1.5 bg-green-500 mt-2 rounded-full"></div>
          </div>
        </div>

        {/* RIGHT IMAGE (SPLIT BACKGROUND) */}
        <div className="h-full bg-[#ecfdf5] flex items-center justify-center p-8 md:p-12 min-h-[300px] md:min-h-full">
          <img
            src="/pouch_collection_premium_1774433281820.png"
            alt="GoMunchz Pouch Collection"
            className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    </section>
  );
}
