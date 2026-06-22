import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { blogs, BlogContent } from "../data/blogData";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";

const blogImages: Record<string, string> = {
  "1": "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072064/blog-1_gxv6y7.jpg",
  "2": "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072071/blog-2_bth1df.jpg",
  "3": "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072078/blog-3_udfeic.jpg",
  "4": "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072101/blog-4_ugnefn.jpg",
  "5": "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072113/blog-5_ulcdyp.jpg",
  "6": "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072132/blog-6_jkskqk.jpg"
};

interface GroupedItem {
  heading: string;
  paragraph?: string;
}

type RenderBlock = 
  | { type: 'normal'; section: BlogContent }
  | { type: 'numbered-grid'; items: GroupedItem[] };

const processSections = (sections: BlogContent[]): RenderBlock[] => {
  const result: RenderBlock[] = [];
  let i = 0;
  
  while (i < sections.length) {
    const current = sections[i];
    
    // Check if current is a numbered heading ("1. ", "2. ", etc.)
    const isNumberedHeading = 
      current.type === 'heading' && 
      typeof current.content === 'string' && 
      /^\d+\.\s/.test(current.content);
      
    // Check if current is a numbered paragraph ("1. ", "2. ", etc.)
    const isNumberedParagraph = 
      current.type === 'paragraph' && 
      typeof current.content === 'string' && 
      /^\d+\.\s/.test(current.content);
      
    if (isNumberedHeading) {
      const groupItems: GroupedItem[] = [];
      while (i < sections.length) {
        const itemHeading = sections[i];
        const isNextNumberedHeading = 
          itemHeading.type === 'heading' && 
          typeof itemHeading.content === 'string' && 
          /^\d+\.\s/.test(itemHeading.content);
          
        if (!isNextNumberedHeading) {
          break;
        }
        
        let paragraphText: string | undefined = undefined;
        if (i + 1 < sections.length && sections[i + 1].type === 'paragraph') {
          paragraphText = sections[i + 1].content as string;
          i += 2;
        } else {
          i += 1;
        }
        
        groupItems.push({
          heading: itemHeading.content as string,
          paragraph: paragraphText
        });
      }
      result.push({
        type: 'numbered-grid',
        items: groupItems
      });
    } 
    else if (isNumberedParagraph) {
      const groupItems: GroupedItem[] = [];
      while (i < sections.length) {
        const itemPara = sections[i];
        const isNextNumberedParagraph = 
          itemPara.type === 'paragraph' && 
          typeof itemPara.content === 'string' && 
          /^\d+\.\s/.test(itemPara.content);
          
        if (!isNextNumberedParagraph) {
          break;
        }
        
        const contentStr = itemPara.content as string;
        const colonIndex = contentStr.indexOf(":");
        let headingText = contentStr;
        let descText: string | undefined = undefined;
        
        if (colonIndex !== -1) {
          headingText = contentStr.substring(0, colonIndex).trim();
          descText = contentStr.substring(colonIndex + 1).trim();
        }
        
        groupItems.push({
          heading: headingText,
          paragraph: descText
        });
        i++;
      }
      result.push({
        type: 'numbered-grid',
        items: groupItems
      });
    } 
    else {
      result.push({
        type: 'normal',
        section: current
      });
      i++;
    }
  }
  
  return result;
};

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const blog = blogs.find((b) => b.slug === slug);
  const navigate = useNavigate();

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
    <div className="w-full bg-[#fcfcfc] min-h-screen font-sans">
      <TopHeader />
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-10 md:pt-5 md:pb-14">
        {/* ================= BREADCRUMBS ================= */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-5 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <ChevronRight size={14} />
          <Link to="/blog" className="hover:text-green-600">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-green-700 font-medium truncate">{blog.title}</span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: main blog content (col-span-8) ================= */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* FEATURED COVER IMAGE */}
            <div className="w-full overflow-hidden rounded-3xl shadow-sm border border-gray-100">
              <img 
                src={blogImages[blog.id] || "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072064/blog-1_gxv6y7.jpg"}
                alt={blog.title} 
                className="w-full h-auto block"
              />
            </div>

            {/* HEADER AREA */}
            <div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                  <Calendar size={14} className="text-green-600" />
                  <span>June 25, 2026</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                  <User size={14} className="text-green-600" />
                  <span>GoMunchz Team</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                  <Clock size={14} className="text-green-600" />
                  <span>5 min read</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 text-left">
                {blog.title}
              </h1>

              <p className="text-gray-600 text-sm leading-relaxed italic border-l-4 border-green-600 pl-4 py-1.5 text-left bg-green-50/20 rounded-r-xl">
                {blog.description}
              </p>
            </div>

            {/* MAIN CONTENT TEXT */}
            <main className="w-full">
              <div className="space-y-4 text-gray-700 leading-relaxed text-sm text-justify">
                {processSections(blog.sections).map((block, idx) => {
                  if (block.type === "numbered-grid") {
                    const isOdd = block.items.length % 2 !== 0;
                    return (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                        {block.items.map((item, itemIdx) => {
                          const isLast = itemIdx === block.items.length - 1;
                          return (
                            <div 
                              key={itemIdx} 
                              className={`bg-green-50/40 border border-green-100/50 p-5 rounded-2xl shadow-sm flex flex-col justify-start text-left hover:shadow-md transition-all duration-300 ${
                                isLast && isOdd ? "md:col-span-2" : ""
                              }`}
                            >
                              <h3 className="text-base font-bold text-green-700 mb-1.5 flex items-center gap-2">
                                {item.heading}
                              </h3>
                              {item.paragraph && (
                                <p className="text-gray-600 text-xs font-semibold leading-relaxed">
                                  {item.paragraph}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  const section = block.section;
                  switch (section.type) {
                    case "heading":
                      return (
                        <h2 key={idx} className="text-xl font-bold text-gray-900 tracking-tight mt-4 mb-2 flex items-center gap-2">
                          <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                          {section.content as string}
                        </h2>
                      );
                    case "paragraph":
                      return <p key={idx} className="mb-2">{section.content as string}</p>;
                    case "list":
                      return (
                        <ul key={idx} className="space-y-2 my-2 pl-2">
                          {(section.content as string[]).map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 group">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0 group-hover:scale-125 transition-transform" />
                              <span className="text-gray-700 font-medium group-hover:text-green-700 transition-colors">{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    case "quote":
                      return (
                        <div key={idx} className="font-bold text-gray-950 border-l-4 border-green-600 pl-4 italic bg-green-50/50 py-4 rounded-r-xl my-4 text-sm shadow-sm">
                          "{section.content as string}"
                        </div>
                      );
                    case "table":
                      const tableData = section.content as { headers: string[]; rows: string[][] };
                      return (
                        <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-green-100 shadow-sm bg-white">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-green-600 text-white">
                                {tableData.headers.map((header, i) => (
                                  <th key={i} className="px-4 py-3 font-bold uppercase tracking-wider text-xs">{header}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-green-50">
                              {tableData.rows.map((row, i) => (
                                <tr key={i} className="hover:bg-green-50/30 transition-colors">
                                  {row.map((cell, j) => (
                                    <td key={j} className="px-4 py-3 text-gray-800 text-xs font-semibold">{cell}</td>
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

            {/* ================= BOTTOM AD BANNER ================= */}
            <div className="bg-emerald-950 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden my-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/20 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-2 text-left z-10">
                <h3 className="text-xl md:text-2xl font-bold">Share the Goodness of GoMunchz</h3>
                <p className="text-emerald-200/80 text-xs font-medium max-w-xl">
                  Refer your friends to smart snacking! They get 5% OFF on their first purchase, and you earn ₹50 cashback when their order is delivered.
                </p>
              </div>
              <button 
                onClick={() => navigate("/refer-and-earn")}
                className="bg-amber-400 hover:bg-amber-500 text-black px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg flex-shrink-0 cursor-pointer z-10 border-0"
              >
                Refer & Earn Now
              </button>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Sidebar (aside) (col-span-4) ================= */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* SIDEBAR WIDGET 1: Recent Posts */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-left">
              <h3 className="font-bold text-lg text-gray-900 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                <span className="w-1 h-4 bg-green-600 rounded-full"></span>
                Recent Stories
              </h3>
              
              <div className="space-y-4">
                {blogs
                  .filter((b) => b.id !== blog.id)
                  .slice(0, 3)
                  .map((recentBlog) => (
                    <Link
                      key={recentBlog.id}
                      to={`/blog/${recentBlog.slug}`}
                      className="flex items-center gap-3 group transition-all"
                    >
                      <img
                        src={blogImages[recentBlog.id] || "https://res.cloudinary.com/dxfdcmxze/image/upload/v1781072064/blog-1_gxv6y7.jpg"}
                        alt=""
                        className="w-16 h-12 object-cover rounded-lg border border-gray-100 flex-shrink-0 group-hover:scale-[1.03] transition-transform duration-300"
                      />
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">MUNCHZ BLOG</p>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug">
                          {recentBlog.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* SIDEBAR WIDGET 2: Right Ad Banner */}
            <div className="bg-gradient-to-b from-[#ecfdf5] to-[#f0fdf4] rounded-3xl p-6 border border-green-100 text-center shadow-sm relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 left-0 w-24 h-24 bg-green-200/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md mb-4">
                🏷️
              </div>
              
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">Healthy Snacking Made Easy</h3>
              <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-5 max-w-[200px]">
                Get premium oil-free roasted foxnuts, dry fruits, and nuts delivered to your door.
              </p>
              
              <div className="bg-white border border-green-200 rounded-xl px-4 py-2 mb-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">First Order Promo</p>
                <p className="text-base font-black text-green-700 tracking-wider leading-none">10% OFF | MUNCH10</p>
              </div>
              
              <button 
                onClick={() => navigate("/productpage")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all active:scale-95 shadow-md shadow-green-100 text-sm cursor-pointer border-0"
              >
                Shop Snacks
              </button>
            </div>

          </aside>

        </div>

      </div>

      <Footer />
    </div>
  );
}
