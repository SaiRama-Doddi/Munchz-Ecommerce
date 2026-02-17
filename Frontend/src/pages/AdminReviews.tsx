import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import api from "../api/client";

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
        `http://localhost:8082/profile/users/${userId}`,
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
        const res = await axios.get(
          "http://localhost:9095/reviews/all"
        );
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
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">
        Reviews Dashboard
      </h1>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          title="Total Reviews"
          value={totalReviews}
          color="bg-indigo-50"
        />
        <StatCard
          title="Average Rating"
          value={`${avgRating} ★`}
          color="bg-yellow-50"
        />
      </div>

      {/* ===== Filters ===== */}
      <div className="bg-white p-6 rounded-2xl shadow border grid md:grid-cols-5 gap-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={setSearch}
        />

        <Select
          value={categoryFilter}
          onChange={(v) => {
            setCategoryFilter(v);
            setProductFilter("ALL");
          }}
          options={[
            { label: "All Categories", value: "ALL" },
            ...categories.map((c) => ({
              label: c.name,
              value: c.id,
            })),
          ]}
        />

        <Select
          value={productFilter}
          onChange={setProductFilter}
          options={[
            { label: "All Products", value: "ALL" },
            ...filteredProducts.map((p) => ({
              label: p.name,
              value: p.id,
            })),
          ]}
        />

        <Select
          value={ratingFilter}
          onChange={setRatingFilter}
          options={[
            { label: "All Ratings", value: "ALL" },
            ...[5, 4, 3, 2, 1].map((r) => ({
              label: `${r} Star`,
              value: r,
            })),
          ]}
        />
      </div>

      {/* ===== Table ===== */}
      <div className="bg-white rounded-2xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">User</th>
              <th className="p-4 text-center">Rating</th>
              <th className="p-4">Comment</th>
              <th className="p-4 text-center">Image</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredReviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 ml-10">
                <td className="p-4 font-semibold">
                  {r.productName}
                </td>

                <td className="p-4">
                  <div className="font-medium">
                    {r.userName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {r.userId}
                  </div>
                </td>

                <td className="p-4 text-center text-amber-500 text-lg">
                  {"★".repeat(r.rating)}
                </td>

                <td className="p-4 break-words">
                  {r.comment}
                </td>

                <td className="p-4 text-center">
                  {r.imageUrl ? (
                    <img
                      src={r.imageUrl}
                      className="w-20 h-20 rounded-lg object-cover border mx-auto"
                    />
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReviews.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No reviews found.
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= REUSABLE UI ================= */

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`${color} p-6 rounded-xl`}>
      <p>{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-xl px-4 py-3"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: any;
  onChange: (v: any) => void;
  options: { label: string; value: any }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-xl px-4 py-3"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}