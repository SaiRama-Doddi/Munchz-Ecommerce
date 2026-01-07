import React from "react";

export default function About() {
  return (
    <div className="w-full bg-[#f9faf7]">

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[360px]">
        <img
          src="https://res.cloudinary.com/dd4oiwnep/image/upload/ingredients-healthy-dessert-chia-puddings-kitchen-wooden-table_1_fiakub.jpg"
          alt="About"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl md:text-5xl font-semibold mb-3">
            About Us
          </h1>
          <p className="text-white/90 max-w-2xl text-sm md:text-base">
            Lorem ipsum dolor sit amet consectetur. Auctor morbi sed morbi odio sit sed.
            Tellus amet ultrices orci scelerisque facilisis.
          </p>
        </div>
      </section>

      {/* ================= WHO ARE WE ================= */}
      <section className="max-w-6xl mx-auto px-6 py-14">

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT IMAGE */}
          <div className="w-full h-[260px] bg-gray-200 rounded-lg"></div>

          {/* RIGHT TEXT */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Who are we?</h2>

            <p className="text-gray-600 leading-relaxed text-sm">
              Lorem ipsum dolor sit amet consectetur. Auctor morbi sed morbi odio sit sed.
              Tellus amet ultrices orci scelerisque facilisis et bibendum sed.
              Lorem ipsum dolor sit amet consectetur. Auctor morbi sed morbi odio sit sed.
              Tellus amet ultrices orci scelerisque facilisis et bibendum sed.
            </p>
          </div>
        </div>

        {/* FEATURE BOXES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">

          <FeatureBox
            title="Premium Ingredients"
            bg="bg-[#f6caa4]"
          />

          <FeatureBox
            title="Fast Delivery"
            bg="bg-[#ffcf96]"
          />

          <FeatureBox
            title="Unique Flavours"
            bg="bg-[#f5b7c7]"
          />

          <FeatureBox
            title="Quality Checked"
            bg="bg-[#a8e6cf]"
          />

        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Auctor morbi sed morbi odio sit sed.
              Tellus amet ultrices orci scelerisque facilisis sit bibendum sed.
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>

          <div className="h-[260px] bg-gray-200 rounded-lg"></div>

        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="bg-[#f9faf7] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-10">Meet the team</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-36 w-full bg-gray-200 rounded-lg mb-3"></div>
                <h4 className="font-semibold">Name</h4>
                <p className="text-gray-500 text-sm">
                  Lorem ipsum dolor sit amet consectetur.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Testimonials
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-green-50 p-6 rounded-xl shadow relative"
              >
                <span className="absolute -top-4 right-4 text-green-400 text-4xl">
                  ❝
                </span>

                <p className="text-gray-600 mb-4 text-sm">
                  Lorem ipsum dolor sit amet consectetur. Etiam habitant
                  ultrices sapien.
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-300 rounded-full" />
                  <div>
                    <p className="font-semibold">Name</p>
                    <p className="text-xs text-gray-500">Customer</p>
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
  bg,
}: {
  title: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-lg p-4 flex items-center gap-4`}>
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
        <p className="text-xs text-gray-600 mt-1">
          Lorem ipsum dolor sit amet.
        </p>
      </div>
    </div>
  );
}
