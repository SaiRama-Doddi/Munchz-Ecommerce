import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, Clock, ChevronRight, BookOpen } from "lucide-react";
import { blogs } from "../data/blogData";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BlogListPage() {
  return (
    <div className="w-full bg-white min-h-screen">
      <TopHeader />
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20 text-center">
        {/* ================= HEADER AREA ================= */}
        <div className="mb-12 md:mb-20">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-6 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom duration-500">
            Insights & Updates
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Welcome to <span className="text-green-600">GoMunchz Blog</span>
          </h1>
          <p className="text-gray-500 text-base mt-3 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Exploring the world of healthy snacking, nutritional powerhouses, and smarter lifestyle choices for a better you.
          </p>
          <div className="w-20 h-[3px] bg-green-600 mx-auto mt-10"></div>
        </div>

        {/* ================= BLOG GRID ================= */}
        <main className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {blogs.map((blog, index) => (
            <article 
              key={blog.id} 
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group border border-gray-100 flex flex-col h-full animate-in fade-in zoom-in-95 duration-700 delay-[index*100ms]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-8 md:p-10 flex flex-col flex-grow text-left">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-green-600" />
                    <span>March 2025</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-green-600" />
                    <span>5 min</span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors leading-tight line-clamp-2">
                  <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h2>
                
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 line-clamp-3">
                  {blog.description}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-700 font-bold text-[10px]">
                      GM
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">GoMunchz Team</span>
                  </div>
                  
                  <Link 
                    to={`/blog/${blog.slug}`} 
                    className="flex items-center gap-1.5 text-xs font-bold text-green-700 hover:gap-3 transition-all tracking-widest uppercase"
                  >
                    Read More <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>

      <Footer />
    </div>
  );
}
