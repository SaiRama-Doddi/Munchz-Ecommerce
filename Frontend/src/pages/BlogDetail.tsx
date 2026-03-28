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
    <div className="w-full bg-white min-h-screen">
      <TopHeader />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-10 md:pt-6 md:pb-16">
        {/* ================= BREADCRUMBS ================= */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <ChevronRight size={14} />
          <Link to="/#blog-section" className="hover:text-green-600">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-green-700 font-medium truncate">{blog.title}</span>
        </nav>

        {/* ================= HEADER AREA ================= */}
        <div className="mb-6 md:mb-8">
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

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
            {blog.title}
          </h1>
          
          <p className="text-gray-600 text-base max-w-3xl leading-relaxed italic border-l-4 border-green-600 pl-6 py-2">
            {blog.description}
          </p>

        </div>

        {/* ================= CONTENT AREA ================= */}
        <main className="w-full">
          <div className="space-y-5 text-gray-700 leading-relaxed text-base text-justify">
            {blog.sections.map((section, idx) => {
              switch (section.type) {
                case "heading":
                  return (
                    <h2 key={idx} className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mt-6 mb-4 flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-green-600 rounded-full"></div>
                      {section.content as string}
                    </h2>
                  );
                case "paragraph":
                  return <p key={idx}>{section.content as string}</p>;
                case "list":
                  return (
                    <ul key={idx} className="space-y-4 my-6">
                      {(section.content as string[]).map((item, i) => (
                        <li key={i} className="flex items-start gap-3 group">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0 group-hover:scale-125 transition-transform" />
                          <span className="text-gray-700 font-medium group-hover:text-green-700 transition-colors">{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                case "quote":
                  return (
                    <div key={idx} className="font-bold text-gray-900 border-l-4 border-green-600 pl-6 italic bg-green-50/50 py-5 rounded-r-2xl my-10 text-base md:text-base shadow-sm">
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
        </main>
      </div>

      <Footer />
    </div>
  );
}
