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
  Award
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
          r.rating === Number(ratingFilter)) &&
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-white">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-gray-400 uppercase text-[10px]">Aggregating Feedback...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-base text-black tracking-[-0.02em]">Market Sentiment</h1>
          <p className="text-gray-400 uppercase text-[9px] md:text-[10px]">Monitor your reputation and product quality</p>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 shadow-sm p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center gap-4 md:gap-6">
          <div className="p-4 md:p-5 bg-emerald-50 text-emerald-600 rounded-[1.2rem] md:rounded-[1.5rem] shadow-sm">
            <MessageSquare size={24} className="md:w-8 md:h-8" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase mb-1">Total Mentions</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl md:text-4xl text-black">{totalReviews}</p>
              <span className="text-[9px] md:text-[10px] text-emerald-500 flex items-center gap-1 uppercase">
                <TrendingUp size={12} /> Live
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center gap-4 md:gap-6">
          <div className="p-4 md:p-5 bg-black text-white rounded-[1.2rem] md:rounded-[1.5rem] shadow-sm">
            <Award size={24} className="md:w-8 md:h-8" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase mb-1">Satisfaction</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl md:text-4xl text-black">{avgRating}</p>
              <div className="flex gap-0.5 text-emerald-500 mb-1 ml-2 hidden sm:flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(Number(avgRating)) ? "currentColor" : "none"} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-[2rem] gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 items-center">
        <div className="sm:col-span-2 md:col-span-4 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            placeholder="Search keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-5 py-3 text-xs placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="relative group md:col-span-2">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setProductFilter("ALL");
            }}
            className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3 text-xs appearance-none pr-10 outline-none focus:bg-white focus:border-emerald-500 transition-all h-11"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
        <div className="relative group md:col-span-3">
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3 text-xs appearance-none pr-10 outline-none focus:bg-white focus:border-emerald-500 transition-all h-11"
          >
            <option value="ALL">All Products</option>
            {filteredProducts.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
        <div className="relative group md:col-span-2">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3 text-xs appearance-none pr-10 outline-none focus:bg-white focus:border-emerald-500 transition-all h-11"
          >
            <option value="ALL">All Ratings</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
        <div className="hidden md:flex md:col-span-1 justify-end">
           <div className="p-3 bg-gray-50 text-gray-400 rounded-xl">
            <Filter size={18} />
           </div>
        </div>
      </div>

      {/* REVIEWS GRID/LIST */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        {filteredReviews.map((r) => (
          <div key={r.id} className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-6 md:p-8 group hover:translate-y-[-4px] transition-all duration-300 hover:border-emerald-200">
            <div className="flex flex-col md:flex-row gap-6">
              {/* IMAGE (If available) */}
              {r.imageUrl && (
                <div className="w-full md:w-32 h-32 shrink-0 relative">
                  <img
                    src={r.imageUrl}
                    className="w-full h-full rounded-2xl object-cover shadow-inner bg-gray-50"
                    alt="Review Visual"
                  />
                  <div className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100">
                    <ImageIcon size={12} className="text-emerald-500" />
                  </div>
                </div>
              )}

              {/* CONTENT */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                     <div className="flex gap-0.5 text-emerald-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <h3 className="text-base text-black leading-tight group-hover:text-emerald-600 transition-colors">
                      {r.productName}
                    </h3>
                  </div>
                  <div className="text-[9px] text-gray-400 uppercase bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                    ID: #{r.id}
                  </div>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed italic">
                  "{r.comment}"
                </p>

                <div className="pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm text-xs">
                      {r.userName?.charAt(0) || "U"}
                    </div>
                    <div>
                       <p className="text-sm text-black">{r.userName || "Anonymous"}</p>
                       <p className="text-[10px] text-gray-400 uppercase">Verified Customer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[9px] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 uppercase tracking-wider">
                      <Package size={12} /> BATCH: {String(r.id).padStart(3, '0')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && !loading && (
        <div className="py-32 flex flex-col items-center justify-center text-gray-300 bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem]">
          <MessageSquare size={64} className="mb-6 opacity-10" />
          <p className=" uppercase text-[10px]">No feedback matches your filters</p>
          <button onClick={() => {setSearch(""); setRatingFilter("ALL"); setCategoryFilter("ALL"); setProductFilter("ALL");}} className="mt-6 text-emerald-600 text-[10px] uppercase tracking-[0.2em] hover:text-black transition-colors">Clear all filters</button>
        </div>
      )}
    </div>
  );
}
