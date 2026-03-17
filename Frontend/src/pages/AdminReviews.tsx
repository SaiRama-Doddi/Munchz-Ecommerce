import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import api from "../api/client";
import { 
  Star, 
  Search, 
  MessageSquare, 
  Filter, 
  User, 
  Layers, 
  Package, 
  ChevronDown,
  Image as ImageIcon,
  TrendingUp,
  Award,
  Calendar,
  Quote
} from "lucide-react";

/* ================= TYPES ================= */

interface Review {
  id: number;
  productName: string;
  userId: string;
  userName: string | null;
  rating: number;
  comment: string;
  imageUrl?: string;
  createdAt?: string;
}

/* ================= COMPONENT ================= */

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [productFilter, setProductFilter] = useState("ALL");

  /* ===== Fetch User Name ===== */
  const fetchUserName = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/profile/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return `${res.data.firstName} ${res.data.lastName}`;
    } catch {
      return "N/A";
    }
  };

  /* ===== Load Master Data ===== */
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  /* ===== Load Reviews ===== */
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await axios.get("/reviews/all");
        const data: Review[] = res.data;

        const updated = await Promise.all(
          data.map(async (r) => {
            if (!r.userName) {
              const name = await fetchUserName(r.userId);
              return { ...r, userName: name };
            }
            return r;
          })
        );

        setReviews(updated);
      } catch (err) {
        console.error("Load reviews failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  /* ===== Filters ===== */
  const filteredProducts = useMemo(() => {
    if (categoryFilter === "ALL") return products;
    return products.filter(
      (p) => p.categoryId === Number(categoryFilter)
    );
  }, [categoryFilter, products]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const product = products.find(
        (p) => p.name === r.productName
      );

      return (
        (r.productName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
          r.userName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          r.comment
            .toLowerCase()
            .includes(search.toLowerCase())) &&
        (ratingFilter === "ALL" ||
          String(r.rating) === String(ratingFilter)) &&
        (categoryFilter === "ALL" ||
          product?.categoryId ===
            Number(categoryFilter)) &&
        (productFilter === "ALL" ||
          product?.id === Number(productFilter))
      );
    });
  }, [
    reviews,
    search,
    ratingFilter,
    categoryFilter,
    productFilter,
    products,
  ]);

  const totalReviews = filteredReviews.length;
  const avgRating =
    totalReviews > 0
      ? (
          filteredReviews.reduce(
            (s, r) => s + r.rating,
            0
          ) / totalReviews
        ).toFixed(1)
      : "0";

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-emerald-500">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            fill={i < rating ? "currentColor" : "none"} 
            className={i < rating ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "text-gray-200"}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 bg-white">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <div>
          <p className="text-black font-black text-center uppercase tracking-[0.2em] text-[10px]">Sentiment Analysis</p>
          <p className="text-gray-400 font-bold text-center text-[9px] uppercase tracking-widest mt-1">Aggregating Global Feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">Market Sentiment</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Reputation Intelligence & Quality Control</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-black uppercase tracking-widest">Real-time Stream</span>
           </div>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-[2.5rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform text-emerald-600">
            <MessageSquare size={100} />
          </div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <MessageSquare size={24} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Mentions</span>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <p className="text-4xl font-black text-black">{totalReviews}</p>
            <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 uppercase tracking-widest">
              <TrendingUp size={12} /> Positive Trend
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform text-black">
            <Star size={100} />
          </div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-4 bg-black text-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
              <Award size={24} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Satisfaction</span>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <p className="text-4xl font-black text-black">{avgRating}</p>
            <div className="flex gap-1 ml-3 mb-1">
               {renderStars(Math.round(Number(avgRating)))}
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-[2.5rem] space-y-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="w-full lg:flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                placeholder="Search feedback, customers or products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-xs font-bold placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all shadow-sm focus:ring-4 focus:ring-emerald-500/5"
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
               <div className="flex-1 min-w-[140px] relative">
                 <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setProductFilter("ALL");
                    }}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    <option value="ALL">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
               </div>

               <div className="flex-1 min-w-[140px] relative">
                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    <option value="ALL">All Products</option>
                    {filteredProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
               </div>

               <div className="flex-1 min-w-[140px] relative">
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    <option value="ALL">All Ratings</option>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Stars</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
               </div>
            </div>
        </div>
      </div>

      {/* REVIEWS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredReviews.map((r) => (
          <div key={r.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:border-emerald-500/20 relative overflow-hidden">
             
             <div className="flex flex-col md:flex-row gap-8 relative z-10">
               {/* VISUAL ASSET */}
               {r.imageUrl ? (
                  <div className="w-full md:w-40 h-40 shrink-0 relative rounded-3xl overflow-hidden group/img">
                    <img
                      src={r.imageUrl}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                      alt="Market Review"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg">
                      <ImageIcon size={14} className="text-emerald-500" />
                    </div>
                  </div>
               ) : (
                  <div className="w-full md:w-40 h-40 shrink-0 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-200">
                     <ImageIcon size={32} />
                     <span className="text-[8px] font-black uppercase tracking-widest mt-2">No Visuals</span>
                  </div>
               )}

               {/* CONTENT BLOCK */}
               <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        {renderStars(r.rating)}
                        <h3 className="text-xl font-black text-black tracking-tight mt-3 group-hover:text-emerald-600 transition-colors">
                          {r.productName}
                        </h3>
                     </div>
                     <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 uppercase tracking-widest">
                       #{r.id}
                     </span>
                  </div>

                  <div className="flex-1 relative">
                     <Quote size={24} className="absolute -top-2 -left-2 text-emerald-500/10" />
                     <p className="text-sm font-bold text-gray-400 leading-relaxed italic pl-4 pb-6 line-clamp-4">
                       "{r.comment}"
                     </p>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-black text-sm shadow-sm">
                           {r.userName?.charAt(0) || "U"}
                        </div>
                        <div>
                           <p className="text-sm font-black text-black">{r.userName || "Guest Patron"}</p>
                           <p className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                              <Award size={10} /> Verified Purchase
                           </p>
                        </div>
                     </div>
                     <div className="hidden sm:flex items-center gap-2">
                        <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-black hover:text-white transition-all cursor-pointer border border-gray-100">
                           <Layers size={14} />
                        </div>
                     </div>
                  </div>
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredReviews.length === 0 && !loading && (
        <div className="py-40 flex flex-col items-center justify-center bg-gray-50/20 rounded-[3rem] border-2 border-dashed border-gray-100 m-2">
          <div className="w-24 h-24 bg-white border border-gray-100 rounded-[2.5rem] flex items-center justify-center mb-8 text-gray-200 shadow-xl shadow-gray-200/20">
            <MessageSquare size={48} />
          </div>
          <p className="text-black font-black uppercase tracking-[0.3em] text-[12px]">Zero matching records in scope</p>
          <button 
            onClick={() => {setSearch(""); setRatingFilter("ALL"); setCategoryFilter("ALL"); setProductFilter("ALL");}} 
            className="mt-8 px-8 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
          >
            Reset Intelligence
          </button>
        </div>
      )}
    </div>
  );
}
