import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useCategories, useProducts } from "../hooks/useQueryHelpers";

/* =========================
   TYPES
========================= */
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

/* =========================
   CONSTANTS
========================= */
const COLORS: string[] = [
  "#16a34a",
  "#22c55e",
  "#4ade80",
  "#86efac",
];

/* =========================
   COMPONENT
========================= */
export default function Dashboard() {
  const { data: cats = [] } = useCategories();
  const { data: products = [] } = useProducts();

  /* =========================
     MOCK ANALYTICS DATA
     (Replace with API later)
  ========================= */
  const productGrowth: { month: string; count: number }[] = [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 18 },
    { month: "Mar", count: 25 },
    { month: "Apr", count: 32 },
    { month: "May", count: 40 },
  ];

  const stockByCategory: { name: string; value: number }[] =
    cats.map((c: Category) => ({
      name: c.name,
      value: Math.floor(Math.random() * 500) + 100,
    }));

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Categories" value={cats.length} />
        <Card title="Products" value={products.length} />
        <Card title="Total Stock (KG)" value="1,240" />
        <Card title="Low Stock Items" value="7" danger />
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LINE CHART */}
        <div className="bg-white p-5 rounded-xl shadow lg:col-span-2">
          <h2 className="font-semibold mb-4">
            Product Growth
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={productGrowth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">
            Stock Distribution
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stockByCategory}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {stockByCategory.map(
                  (
                    _item: { name: string; value: number },
                    index: number
                  ) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-4">
          Stock by Category
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockByCategory}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT PRODUCTS */}
      <section className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-4">
          Recent Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((p: Product) => (
            <div
              key={p.id}
              className="border rounded-lg p-3 hover:shadow transition"
            >
              <img
                src={p.imageUrl}
                alt={p.name}
                className="h-28 w-full object-contain mb-2"
              />
              <div className="text-sm font-medium truncate">
                {p.name}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

/* =========================
   CARD COMPONENT
========================= */
function Card({
  title,
  value,
  danger = false,
}: {
  title: string;
  value: number | string;
  danger?: boolean;
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <div className="text-sm text-gray-500">
        {title}
      </div>
      <div
        className={`text-3xl font-bold ${
          danger ? "text-red-600" : "text-green-700"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
