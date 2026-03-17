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
    return <PremiumSpinner text="Gourmet Collection..." />;
  }

  return (
    <section className="bg-white py-20 lg:py-32">

      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-emerald-600"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
                Curated Selection
              </p>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight tracking-[-0.03em]">
              Explore <span className="text-emerald-600 italic">Categories</span>
            </h2>
          </div>

          <div className="hidden md:flex gap-4">
            <button
              onClick={() => scroll("left")}
              className="w-14 h-14 rounded-2xl border border-gray-100 bg-white hover:bg-emerald-50 hover:border-emerald-100 text-gray-400 hover:text-emerald-700 flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() => scroll("right")}
              className="w-14 h-14 rounded-2xl border border-gray-100 bg-white hover:bg-emerald-50 hover:border-emerald-100 text-gray-400 hover:text-emerald-700 flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>



        {/* MOBILE SLIDER */}

        <div className="md:hidden flex gap-6 overflow-x-auto pb-8 no-scrollbar -mx-4 px-4">
          {categories.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/category/${c.id}`)}
              className="flex-shrink-0 w-[120px] flex flex-col items-center group active:scale-95 transition-all"
            >
              <div className="w-full aspect-square rounded-[2rem] overflow-hidden shadow-premium-soft border border-gray-50 bg-white p-2">
                <img
                  src={c.thumbnailImage}
                  alt={c.name}
                  className="w-full h-full object-cover rounded-[1.8rem]"
                />
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-center mt-4 text-gray-800">
                {c.name}
              </p>
            </div>
          ))}
        </div>



        {/* DESKTOP CATEGORY SLIDER */}

        <div
          ref={scrollRef}
          className="hidden md:flex gap-12 overflow-x-auto scroll-smooth no-scrollbar py-8"
        >
          {categories.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/category/${c.id}`)}
              className="flex-shrink-0 w-[240px] group cursor-pointer"
            >
              <div className="h-[300px] rounded-[3rem] overflow-hidden premium-card bg-white p-4">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-gray-50">
                  <img
                    src={c.thumbnailImage}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms] cubic-bezier(0.4, 0, 0.2, 1)"
                  />
                </div>
              </div>

              <div className="mt-8 px-2 flex flex-col items-center">
                <p className="text-[13px] font-black uppercase tracking-[0.2em] text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {c.name}
                </p>
                <div className="w-0 group-hover:w-16 h-px bg-emerald-600 mt-3 transition-all duration-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
