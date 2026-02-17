import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { useEffect, useMemo, useState } from "react";
import inventoryApi from "../api/inventoryApi";
import { useCategories, useProducts } from "../hooks/useQueryHelpers";

/* ================= TYPES ================= */

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  createdAt: string; // IMPORTANT
}

interface Stock {
  id: number;
  productId: number;
  productName: string;
  categoryName: string;
  variantLabel: string;
  quantity: number; // grams
}

const COLORS: string[] = [
  "#16a34a",
  "#22c55e",
  "#4ade80",
  "#86efac",
];

/* ================= COMPONENT ================= */

export default function Dashboard() {
  const { data: cats = [] } = useCategories();
  const { data: prods = [] } = useProducts();

  // locally type them (fixes TS errors)
  const categories: Category[] = cats;
  const products: Product[] = prods;

  const [stocks, setStocks] = useState<Stock[]>([]);

  /* ===== LOAD INVENTORY ===== */
  useEffect(() => {
    inventoryApi.get("/inventory").then((res) => {
      setStocks(res.data);
    });
  }, []);

  /* ===== TOTAL STOCK ===== */
  const totalStockGrams = useMemo(() => {
    return stocks.reduce(
      (sum: number, s: Stock) => sum + s.quantity,
      0
    );
  }, [stocks]);

  const totalStockKg = (totalStockGrams / 1000).toFixed(2);

  /* ===== LOW STOCK ===== */
  const lowStockItems = useMemo(() => {
    return stocks.filter(
      (s: Stock) => s.quantity < 100
    ).length;
  }, [stocks]);

  /* ===== STOCK BY CATEGORY ===== */
  const stockByCategory: { name: string; value: number }[] =
    useMemo(() => {
      return categories.map((c: Category) => {
        const total = stocks
          .filter(
            (s: Stock) =>
              s.categoryName === c.name
          )
          .reduce(
            (sum: number, s: Stock) =>
              sum + s.quantity,
            0
          );

        return {
          name: c.name,
          value: +(total / 1000).toFixed(2),
        };
      });
    }, [categories, stocks]);

    console.log(products.map(p => ({
  name: p.name,
  createdAt: p.createdAt
})));

const recentProducts: Product[] = [...products]
  .sort((a, b) => {
    const da = a.createdAt
      ? new Date(a.createdAt).getTime()
      : 0;

    const db = b.createdAt
      ? new Date(b.createdAt).getTime()
      : 0;

    return db - da;
  })
  .slice(0, 6);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Categories"
          value={categories.length}
        />
        <Card
          title="Products"
          value={products.length}
        />
        <Card
          title="Total Stock (KG)"
          value={totalStockKg}
        />
        <Card
          title="Low Stock Items"
          value={lowStockItems}
          danger
        />
      </div>

      {/* PIE CHART */}
      <ChartCard title="Stock Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stockByCategory}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {stockByCategory.map(
                (
                  _: {
                    name: string;
                    value: number;
                  },
                  i: number
                ) => (
                  <Cell
                    key={i}
                    fill={
                      COLORS[
                        i % COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* BAR CHART */}
      <ChartCard title="Stock by Category">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockByCategory}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#22c55e"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* RECENT PRODUCTS */}
     <section className="bg-white p-5 rounded-xl shadow">
  <h2 className="font-semibold mb-4">
    Recent Products
  </h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
    {recentProducts.map((p: Product) => (
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

/* ================= UI ================= */

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
          danger
            ? "text-red-600"
            : "text-green-700"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="font-semibold mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}