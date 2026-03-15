export default function ProductImage() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* VIDEO BACKGROUND */}

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/YOUR_VIDEO_NAME.mp4"
          type="video/mp4"
        />
      </video>

      {/* DARK OVERLAY */}

      <div className="absolute inset-0 bg-black/40"></div>

      {/* CONTENT */}

      <div className="relative max-w-7xl mx-auto px-6 md:px-20 py-28 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT TEXT */}

        <div className="space-y-6 text-white">

          <p className="uppercase tracking-[6px] text-sm text-green-300">
            Pure Ingredients
          </p>

          <h2 className="text-4xl md:text-6xl font-light leading-tight">
            Real ingredients
          </h2>

          <h2 className="text-4xl md:text-6xl font-light leading-tight">
            Unreal flavor
          </h2>

          <p className="text-xl md:text-2xl font-medium text-green-200 pt-2">
            Absolutely zero compromise
          </p>

          <div className="pt-4">
            <span className="inline-block text-3xl md:text-4xl font-semibold">
              Munchz
            </span>

            <div className="w-16 h-[3px] bg-green-400 mt-2"></div>
          </div>

        </div>

        {/* RIGHT PRODUCT IMAGE */}

        <div className="flex justify-center md:justify-end">

          <img
            src="/product.png"
            alt="Munchz Products"
            className="w-full max-w-xl object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          />

        </div>

      </div>

    </section>
  );
}
