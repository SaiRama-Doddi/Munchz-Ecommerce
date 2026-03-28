import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowUpRight
} from "lucide-react";
import { blogs } from "../data/blogData";

import blog1 from "../assets/blog/blog_healthy_future.png";
import blog2 from "../assets/blog/blog_makhana_choice.png";
import blog3 from "../assets/blog/blog_weight_loss_snacks.png";
import blog4 from "../assets/blog/blog_choose_snacks.png";
import blog5 from "../assets/blog/blog_late_night_cravings.png";
import blog6 from "../assets/blog/blog_makhana_5_ways.png";

const blogImages = [blog1, blog2, blog3, blog4, blog5, blog6];

const blogCategories = [
  "Lifestyle",
  "Smart Choice",
  "Fitness",
  "Guide",
  "Health",
  "Recipes"
];

const blogExcerpts = [
  "Explore why making healthy choices today leads to a vibrant tomorrow...",
  "Discover why Makhana is the ultimate smart snack for every Indian home...",
  "Achieve your fitness goals with these top 7 nutrient-packed snack picks...",
  "Learn the secrets to identifying truly healthy snacks beyond the labels...",
  "Satisfy your late-night hunger without the guilt with these healthy alternatives...",
  "Level up your snack game with 5 innovative ways to prepare Makhana..."
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
    <section id="blog-section" className="py-5 md:py-8 bg-white overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              Our <span className="text-green-600">Blog</span>
            </h2>

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
            className="flex md:grid md:grid-cols-3 lg:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible pb-10 px-2"
          >
            {blogs.slice(0, 6).map((blog, index) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="min-w-[85%] sm:min-w-[45%] md:min-w-0 bg-[#ecfdf5] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-green-100/50 group/card flex flex-col"
              >
                {/* BLOG IMAGE - FIXED ASPECT RATIO AS PER REQUESTED DESIGN */}
                <div className="w-full aspect-[16/10] overflow-hidden">
                  <img 
                    src={blogImages[index]} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" 
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  {/* CATEGORY TAG */}
                  <p className="text-[12px] font-bold text-[#8b5cf6] mb-3 uppercase tracking-wider">
                    {blogCategories[index]}
                  </p>

                  {/* TITLE WITH ARROW */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-gray-900 font-bold text-base leading-snug group-hover/card:text-green-700 transition-colors line-clamp-2 mt-1">
                      {blog.title}
                    </h3>
                    <ArrowUpRight size={20} className="text-gray-400 group-hover/card:text-green-700 transition-all group-hover/card:-translate-y-1 group-hover/card:translate-x-1 shrink-0 mt-1" />
                  </div>

                  {/* EXCERPT/DESCRIPTION */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {blogExcerpts[index]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
