import React from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { blogs } from "../data/blogData";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopHeader />
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
          <Link to="/" className="text-green-600 hover:underline flex items-center gap-2">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f9fdf7] min-h-screen">
      <TopHeader />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {/* ================= BREADCRUMBS ================= */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <ChevronRight size={14} />
          <span className="hover:text-green-600">Blog</span>
          <ChevronRight size={14} />
          <span className="text-green-700 font-medium truncate">{blog.title}</span>
        </nav>

        {/* ================= HEADER AREA ================= */}
        <div className="mb-12 md:mb-16">
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <Calendar size={14} className="text-green-600" />
              <span>March 25, 2025</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <User size={14} className="text-green-600" />
              <span>GoMunchz Team</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <Clock size={14} className="text-green-600" />
              <span>5 min read</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
            {blog.title}
          </h1>
          
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl leading-relaxed italic border-l-4 border-green-600 pl-6 py-2">
            {blog.description}
          </p>
          <div className="w-20 h-1 bg-green-600 mt-8"></div>
        </div>

        {/* ================= CONTENT AREA ================= */}
        <main className="max-w-4xl">
          <div className="space-y-10 text-gray-700 leading-relaxed text-base md:text-xl text-justify">
            {blog.sections.map((section, idx) => {
              switch (section.type) {
                case "heading":
                  return (
                    <h2 key={idx} className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mt-12 mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-green-600 rounded-full"></div>
                      {section.content as string}
                    </h2>
                  );
                case "paragraph":
                  return <p key={idx} className="mb-6">{section.content as string}</p>;
                case "list":
                  return (
                    <ul key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                      {(section.content as string[]).map((item, i) => (
                        <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-green-50 hover:border-green-200 transition-colors">
                          <div className="mt-1 bg-green-100 p-1 rounded-full text-green-700 flex-shrink-0">
                            <ChevronRight size={14} />
                          </div>
                          <span className="font-semibold text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                case "quote":
                  return (
                    <div key={idx} className="font-bold text-gray-900 border-l-4 border-green-600 pl-6 italic bg-green-50/50 py-8 rounded-r-3xl my-10 text-xl md:text-2xl shadow-sm">
                      "{section.content as string}"
                    </div>
                  );
                case "table":
                  const tableData = section.content as { headers: string[]; rows: string[][] };
                  return (
                    <div key={idx} className="overflow-x-auto my-10 rounded-2xl border border-green-100 shadow-sm bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-green-600 text-white">
                            {tableData.headers.map((header, i) => (
                              <th key={i} className="px-6 py-4 font-bold uppercase tracking-wider text-sm">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-green-50">
                          {tableData.rows.map((row, i) => (
                            <tr key={i} className="hover:bg-green-50/50 transition-colors">
                              {row.map((cell, j) => (
                                <td key={j} className="px-6 py-5 text-gray-800 font-medium">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>

          {/* ================= CONCLUSION / FOOTER INFO ================= */}
          <div className="mt-20 p-8 md:p-12 bg-green-600 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Love these insights?</h3>
                <p className="text-green-50 text-base md:text-lg max-w-md opacity-90">
                  Join thousands of smart snackers who choose GoMunchz every day for a healthier lifestyle.
                </p>
              </div>
              <Link to="/productpage" className="bg-white text-green-700 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-green-50 transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
                Shop Our Collection
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
