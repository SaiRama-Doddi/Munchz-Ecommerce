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
        <div className="mb-12 text-left">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Shop By <span className="text-green-600">Category</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-lg">
            Explore our diverse ranges of premium handpicked snacks
          </p>
          <div className="w-16 h-[3px] bg-green-600 mt-4"></div>
        </div>

      </div>



      {/* MOBILE SLIDER */}

      <div className="md:hidden flex gap-5 overflow-x-auto pb-6 no-scrollbar">

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
          justify-start
          gap-10
          overflow-x-auto
          scroll-smooth
          no-scrollbar
          px-4
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

            <div className="h-[150px] rounded-2xl overflow-hidden shadow-sm">

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

              <p className="text-[16px] font-semibold text-gray-800">
                {c.name}
              </p>

              <div className="flex justify-center mt-2">
                <span className="w-10 h-[3px] bg-green-600 rounded-full"></span>
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
