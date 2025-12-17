
export default function AboutUs() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-full mx-auto grid lg:grid-cols-2 grid-cols-1">
        
        {/* LEFT SIDE — TEXT */}
        <div className="p-10 md:p-16 bg-[#e3f0e8]">
          <h2 className="text-2xl font-semibold mb-5 border-l-4 border-green-600 pl-3">
            About us
          </h2>

          <p className="text-gray-700 leading-relaxed text-[17px]">
            Lorem ipsum dolor sit amet consectetur. Ac vulputate tellus tincidunt 
            lorem nunc sit vitae. Convallis sodales mi nisl diam aliquam ac 
            commodo eget nunc. Ornare tortor egestas ultrices pretium eget.
          </p>
        </div>

        {/* RIGHT SIDE — IMAGE SECTION */}
        <div className="relative">
          {/* Background diagonal */}
          <div className="absolute inset-0 bg-[linear-to-br from-[#dfe6dc] to-[#faeed6]] -z-10" />   {/* linear-to-br from-[#dfe6dc] to-[#faeed6] */}

          <img
            src="/about.png" 
            alt="about us banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
