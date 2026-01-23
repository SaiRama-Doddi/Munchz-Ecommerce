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
      const res = await api.get("/product/api/categories");
      return res.data as Category[];
    },
  });
}

export default function UserCategories() {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#fafaf6] py-10 md:py-14 relative overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-10">
        Explore our categories
      </h2>

      {/* LEFT ARROW — Always on Desktop (same as old) */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10
        bg-green-600 text-white shadow-lg p-2 rounded-full hover:scale-110 transition"
      >
        <ChevronLeft size={26} />
      </button>

      {/* RIGHT ARROW — Always on Desktop (same as old) */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10
        bg-green-600 text-white shadow-lg p-2 rounded-full hover:scale-110 transition"
      >
        <ChevronRight size={26} />
      </button>

      {/* Scroll Container */}
      <div className="relative">
        {/* Mobile fade indicator */}
        <div className="md:hidden pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[#fafaf6] to-transparent z-10" />

        <div
          ref={scrollRef}
          className="
            max-w-6xl mx-auto
            flex gap-6 md:gap-16
            px-4 md:px-6
            overflow-x-auto scroll-smooth
            snap-x snap-mandatory
            no-scrollbar
          "
        >
          {categories.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/category/${c.id}`)}
              className="snap-start flex-shrink-0 flex flex-col items-center cursor-pointer group"
            >
              {/* Circle */}
              <div
                className="
                  w-24 h-24 md:w-40 md:h-40
                  rounded-full bg-gray-200 border border-green-800
                  overflow-hidden transition group-hover:scale-105 mt-2
                "
              >
                <img
                  src={c.thumbnailImage}
                  alt={c.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Label */}
              <p className="mt-3 md:mt-4 text-sm md:text-lg font-medium text-center">
                {c.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile hint */}
      <p className="text-center text-xs text-gray-400 mt-4 md:hidden">
        Swipe to view more categories →
      </p>
    </div>
  );
}
