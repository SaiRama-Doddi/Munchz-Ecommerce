import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    return (
      <div className="bg-[#f6fff4] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Fetching your categories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#fafaf6] py-10 sm:py-12 lg:py-14">

      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-10">

          <div>
            <p className="text-sm tracking-[4px] text-green-600 mb-2">
              Go MunchZ COLLECTION
            </p>

            <h2 className="text-3xl font-semibold text-gray-900">
              Explore Categories
            </h2>
          </div>

          {/* ARROWS */}

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

        </div>



        {/* MOBILE SLIDER */}

        <div className="md:hidden flex gap-5 overflow-x-auto pb-2 no-scrollbar">

          {categories.map((c) => (

            <div
              key={c.id}
              onClick={() => navigate(`/category/${c.id}`)}
              className="flex-shrink-0 w-[90px] flex flex-col items-center cursor-pointer"
            >

              <div className="w-[75px] h-[75px] rounded-2xl overflow-hidden shadow-md bg-white">

                <img
                  src={c.thumbnailImage}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />

              </div>

              <p className="text-xs text-center mt-2 font-medium">
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
          gap-10
          overflow-x-auto
          scroll-smooth
          no-scrollbar
          "
        >

          {categories.map((c) => (

            <div
              key={c.id}
              onClick={() => navigate(`/category/${c.id}`)}
              className="
              flex-shrink-0
              w-[200px]
              group
              cursor-pointer
              text-center
              "
            >

              {/* IMAGE */}

              <div className="h-[150px] rounded-2xl overflow-hidden">

                <img
                  src={c.thumbnailImage}
                  alt={c.name}
                  className="
                  w-full h-full object-cover
                  group-hover:scale-105
                  transition duration-500
                  "
                />

              </div>


              {/* CATEGORY NAME */}

              <div className="mt-4">

                <p className="text-[16px] font-medium text-gray-800">
                  {c.name}
                </p>

                <div className="flex justify-center mt-2">
                  <span className="w-10 h-[3px] bg-green-600 rounded-full"></span>
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
