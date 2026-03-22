import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PremiumSpinner from "../components/PremiumSpinner";

interface Category {
  id: number;
  name: string;
  thumbnailImage: string;
}

function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data as Category[];
    },
  });
}

export default function UserCategories() {
  const navigate = useNavigate();
  const { data: categories = [], isLoading } = useCategories();

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return <PremiumSpinner text="Fetching categories..." />;
  }

  return (
    <section className="bg-[#fafaf6] py-10 sm:py-12 lg:py-14">

      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Shop By <span className="text-green-600">Category</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
            Explore our diverse ranges of premium handpicked snacks
          </p>
          <div className="w-16 h-[3px] bg-green-600 mt-4 mx-auto"></div>
        </div>

          {/* ARROWS (Hidden for now) */}
          {/* 
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border bg-white hover:bg-gray-100 flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border bg-white hover:bg-gray-100 flex items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          */}




        {/* MOBILE SLIDER */}

        <div className="md:hidden flex gap-4 overflow-x-auto pb-6 no-scrollbar">

          {categories.map((c) => (

            <div
              key={c.id}
              onClick={() => navigate(`/category/${c.id}`)}
              className="flex-shrink-0 w-[110px] flex flex-col items-center cursor-pointer group"
            >

              <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-sm bg-[#ecfdf5] p-2 border border-green-100">
                <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-1">
                  <img
                    src={c.thumbnailImage}
                    alt={c.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition duration-500"
                  />
                </div>
              </div>

              <p className="text-[11px] text-center mt-2 font-bold text-gray-800 uppercase tracking-tighter line-clamp-1">
                {c.name}
              </p>

            </div>

          ))}

        </div>



        {/* DESKTOP CATEGORY SLIDER */}

        <div
          ref={scrollRef}
          className="
          hidden md:flex
          justify-center
          gap-8
          overflow-x-auto
          scroll-smooth
          no-scrollbar
          py-4
          "
        >

          {categories.map((c) => (

            <div
              key={c.id}
              onClick={() => navigate(`/category/${c.id}`)}
              className="
              flex-shrink-0
              w-[190px]
              group
              cursor-pointer
              text-center
              bg-[#ecfdf5]
              p-3
              rounded-3xl
              border border-green-100
              shadow-sm
              hover:shadow-xl
              transition-all
              duration-500
              hover:-translate-y-2
              "
            >

              {/* IMAGE */}

              <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-inner p-3 flex items-center justify-center">

                <img
                  src={c.thumbnailImage}
                  alt={c.name}
                  className="
                  w-full h-full object-contain
                  group-hover:scale-110
                  transition duration-700
                  "
                />

              </div>


              {/* CATEGORY NAME */}

              <div className="mt-4">

                <h4 className="text-[15px] font-bold text-gray-900 group-hover:text-green-700 transition-colors uppercase tracking-tight">
                  {c.name}
                </h4>

                <div className="flex justify-center mt-2">
                  <div className="w-8 h-[2px] bg-green-600 rounded-full group-hover:w-16 transition-all duration-500"></div>
                </div>

              </div>

            </div>

          ))}

        </div>


        </div>
      </section>
  );
}
