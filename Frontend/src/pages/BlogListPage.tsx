import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ChevronDown } from "lucide-react";
import { blogs } from "../data/blogData";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";

const blogImages = [
  "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072064/blog-1_gxv6y7.jpg",
  "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072071/blog-2_bth1df.jpg",
  "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072078/blog-3_udfeic.jpg",
  "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072101/blog-4_ugnefn.jpg",
  "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072113/blog-5_ulcdyp.jpg",
  "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072132/blog-6_jkskqk.jpg"
];

export default function BlogListPage() {
  return (
    <div className="w-full bg-white min-h-screen">
      <TopHeader />
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-10 md:pt-6 md:pb-20">
        {/* ================= HEADER AREA ================= */}
        <div className="mb-10 md:mb-14">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
            Insights & <span className="text-green-600">Updates</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Exploring the world of healthy snacking, nutritional powerhouses, and smarter lifestyle choices for a better you.
          </p>
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
                <div className="flex items-center justify-between text-sm text-gray-400 mb-6 font-medium">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-green-600" />
                      <span>March 2025</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-green-600" />
                      <span>5 min</span>
                    </div>
                  </div>
                  {/* Chevron down inside circular outline */}
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="w-8 h-8 rounded-full border border-green-600 flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300"
                  >
                    <ChevronDown size={16} />
                  </Link>
                </div>

                {/* Blog Image */}
                <div className="w-full aspect-[16/10] overflow-hidden rounded-2xl mb-6">
                  <Link to={`/blog/${blog.slug}`}>
                    <img
                      src={blogImages[index]}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors leading-tight line-clamp-2">
                  <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h2>

                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {blog.description}
                </p>
              </div>
            </article>
          ))}
        </main>
      </div>

      <Footer />
    </div>
  );
}
