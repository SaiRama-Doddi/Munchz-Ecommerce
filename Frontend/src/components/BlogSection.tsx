import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Target,
  Search,
  Moon,
  ChefHat,
  ArrowRight
} from "lucide-react";
import { blogs } from "../data/blogData";

const blogImages = [
  "C:/Users/win/.gemini/antigravity/brain/fea17ac9-c43e-4ccf-b5ea-97177e5205ce/blog_healthy_future_1774591163331.png",
  "C:/Users/win/.gemini/antigravity/brain/fea17ac9-c43e-4ccf-b5ea-97177e5205ce/blog_makhana_choice_1774591177442.png",
  "C:/Users/win/.gemini/antigravity/brain/fea17ac9-c43e-4ccf-b5ea-97177e5205ce/blog_weight_loss_snacks_1774591193463.png",
  "C:/Users/win/.gemini/antigravity/brain/fea17ac9-c43e-4ccf-b5ea-97177e5205ce/blog_choose_snacks_1774591210840.png",
  "C:/Users/win/.gemini/antigravity/brain/fea17ac9-c43e-4ccf-b5ea-97177e5205ce/blog_late_night_cravings_1774591227626.png",
  "C:/Users/win/.gemini/antigravity/brain/fea17ac9-c43e-4ccf-b5ea-97177e5205ce/blog_makhana_5_ways_1774591243433.png"
];

export default function BlogSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Our <span className="text-green-600">Blog</span>
            </h2>
            <div className="w-16 h-[3px] bg-green-600 mt-4"></div>
            <p className="text-gray-600 text-sm md:text-base mt-2 font-normal">
              Latest from GoMunchz Blog
            </p>
          </div>

          <Link to="/blog" className="flex items-center gap-2 text-green-700 font-bold hover:gap-4 transition-all group underline underline-offset-8 decoration-2 decoration-green-100 hover:decoration-green-600">
            View All Blogs <ArrowRight size={20} />
          </Link>
        </div>

        {/* ================= DESKTOP & TABLET GRID / MOBILE SCROLL ================= */}
        <div className="relative group">

          {/* Mobile Arrows */}
          <button
            onClick={() => scroll("left")}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-3 rounded-full shadow-lg border border-gray-100 -ml-2 hover:bg-green-600 hover:text-white transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-3 rounded-full shadow-lg border border-gray-100 -mr-2 hover:bg-green-600 hover:text-white transition-all active:scale-90"
          >
            <ChevronRight size={24} />
          </button>

          {/* Grid Container */}
          <div
            ref={scrollRef}
            className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4 lg:gap-4 overflow-x-auto md:overflow-hidden snap-x snap-mandatory no-scrollbar pb-6"
          >
            {blogs.map((blog, index) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="min-w-[85%] sm:min-w-[45%] md:min-w-0 snap-center bg-[#ecfdf5] p-6 md:p-5 lg:p-6 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-green-100 transition-all duration-500 border border-green-50/50 hover:border-green-200 flex flex-col items-center text-center group/card h-full"
              >
                <h3 className="text-gray-900 font-bold text-sm md:text-sm lg:text-base leading-snug lg:leading-tight mb-4 flex-grow line-clamp-2">
                  {blog.title}
                </h3>

                {/* BLOG IMAGE */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 shadow-md group-hover/card:scale-105 transition-transform duration-500 border-4 border-white">
                  <img src={blogImages[index]} alt={blog.title} className="w-full h-full object-cover" />
                </div>

                <div className="mt-auto flex items-center gap-1.5 text-[10px] font-bold text-green-700 group-hover/card:gap-3 transition-all uppercase tracking-[0.2em] bg-white/50 px-4 py-2 rounded-full">
                  Read More <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
