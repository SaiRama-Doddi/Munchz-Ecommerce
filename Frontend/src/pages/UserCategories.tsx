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
    <div className="bg-[#fafaf6] py-14 relative">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Explore our categories
      </h2>

      {/* LEFT ARROW */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10
        bg-green-600 text-white shadow-lg p-2 rounded-full hover:scale-110 transition"
      >
        <ChevronLeft size={26} />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10
        bg-green-600 text-white shadow-lg p-2 rounded-full hover:scale-110 transition"
      >
        <ChevronRight size={26} />
      </button>

      {/* SCROLL CONTAINER */}
    <div
  ref={scrollRef}
  className="
    max-w-6xl mx-auto
    flex gap-16 px-6
    overflow-x-auto scroll-smooth
    no-scrollbar
  "
>

        {categories.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/category/${c.id}`)}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
          >
            {/* Circle */}
            <div className="
              w-40 h-40 rounded-full bg-gray-200 border border-green-800
              overflow-hidden transition group-hover:scale-105 mt-2
            ">
              <img
                src={c.thumbnailImage}
                alt={c.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Label */}
            <p className="mt-4 text-lg font-medium text-center">
              {c.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
