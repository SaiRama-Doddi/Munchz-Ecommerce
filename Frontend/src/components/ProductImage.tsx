
export default function ProductImage() {
  return (
    <section className="w-full bg-[#e3f0e8] py-16 px-6 md:px-20">  {/* #a8e6a3 */}  {/* #f3efe4 */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE TEXT */}
        <div className="space-y-3">
          <h2 className="text-4xl md:text-5xl font-normal text-black">
            Real ingredients
          </h2>

          <h2 className="text-4xl md:text-5xl font-normal text-black">
            Unreal flavor
          </h2>

          <p className="text-2xl md:text-3xl font-semibold text-black mt-4">
            Absolutely zero<br />compromise
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-4">Munchz</h2>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center md:justify-end">
          <img
            src="/product.png"
            alt="Munchz Products"
            className="w-full max-w-xl object-contain"
          />
        </div>

      </div>
    </section>
  );
}
