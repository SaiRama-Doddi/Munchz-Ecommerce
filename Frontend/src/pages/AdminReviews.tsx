import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import api from "../api/client";

interface Review {
  id: number;
  productName: string;
  userId: string;
  userName: string | null;
  rating: number;
  comment: string;
  imageUrl?: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [productFilter, setProductFilter] = useState("ALL");

  /* ================= FETCH USER NAME ================= */
  const fetchUserName = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8082/profile/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return `${res.data.firstName} ${res.data.lastName}`;
    } catch {
      return "N/A";
    }
  };

  /* ================= LOAD MASTER DATA ================= */
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  /* ================= LOAD REVIEWS ================= */
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await axios.get("http://localhost:9095/reviews/all");
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
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  /* ================= PRODUCTS BY CATEGORY ================= */
  const filteredProducts = useMemo(() => {
    if (categoryFilter === "ALL") return products;
    return products.filter(
      (p) => p.categoryId === Number(categoryFilter)
    );
  }, [categoryFilter, products]);

  /* ================= FINAL FILTER ================= */
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const product = products.find(
        (p) => p.name === r.productName
      );

      const matchesSearch =
        r.productName.toLowerCase().includes(search.toLowerCase()) ||
        r.userName?.toLowerCase().includes(search.toLowerCase()) ||
        r.comment.toLowerCase().includes(search.toLowerCase());

      const matchesRating =
        ratingFilter === "ALL" ||
        r.rating === Number(ratingFilter);

      const matchesCategory =
        categoryFilter === "ALL" ||
        product?.categoryId === Number(categoryFilter);

      const matchesProduct =
        productFilter === "ALL" ||
        product?.id === Number(productFilter);

      return (
        matchesSearch &&
        matchesRating &&
        matchesCategory &&
        matchesProduct
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
          filteredReviews.reduce((s, r) => s + r.rating, 0) /
          totalReviews
        ).toFixed(1)
      : "0";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-10">

        <h1 className="text-4xl font-bold mb-8">
          Reviews Dashboard
        </h1>

        {/* STATS */}
        <div className="flex gap-10 mb-8">
          <div className="bg-indigo-50 px-6 py-4 rounded-xl">
            <p>Total Reviews</p>
            <p className="text-2xl font-bold">{totalReviews}</p>
          </div>
          <div className="bg-yellow-50 px-6 py-4 rounded-xl">
            <p>Average Rating</p>
            <p className="text-2xl font-bold">{avgRating} ★</p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setProductFilter("ALL");
            }}
            className="border rounded-xl px-4 py-3"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="ALL">All Products</option>
            {filteredProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="ALL">All Ratings</option>
            {[5,4,3,2,1].map(r=>(
              <option key={r} value={r}>{r} Star</option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
  <table className="w-full table-fixed text-sm text-left">
    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
      <tr>
        <th className="px-6 py-4 w-[18%]">Product</th>
        <th className="px-6 py-4 w-[22%]">User</th>
        <th className="px-6 py-4 w-[12%] text-center">Rating</th>
        <th className="px-6 py-4 w-[30%]">Comment</th>
        <th className="px-6 py-4 w-[18%] text-center">Image</th>
      </tr>
    </thead>

    <tbody className="divide-y">
      {filteredReviews.map((r) => (
        <tr key={r.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 font-semibold">
            {r.productName}
          </td>

          <td className="px-6 py-4">
            <div className="font-medium">{r.userName}</div>
            <div className="text-xs text-gray-400">{r.userId}</div>
          </td>

          <td className="px-6 py-4 text-center text-amber-500 text-lg">
            {"★".repeat(r.rating)}
          </td>

          <td className="px-6 py-4 break-words">
            {r.comment}
          </td>

          <td className="px-6 py-4 flex justify-center">
            {r.imageUrl ? (
              <img
                src={r.imageUrl}
                className="w-20 h-20 rounded-lg object-cover border"
              />
            ) : (
              "—"
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      </div>
    </div>
  );
}
