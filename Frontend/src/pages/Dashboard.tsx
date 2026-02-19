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
import paymentApi from "../api/paymentApi";
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

interface Order {
  orderId: string;
  userName: string;
  totalAmount: number;
  placedAt: string;
   orderStatus: string; 
}
interface DashboardProps {
  orders: Order[];
}

/* ================= COMPONENT ================= */

export default function Dashboard({ orders }: DashboardProps) {



  
  const { data: cats = [] } = useCategories();
  const { data: prods = [] } = useProducts();


  // locally type them (fixes TS errors)
  const categories: Category[] = cats;
  const products: Product[] = prods;

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [todayPayments, setTodayPayments] = useState<any[]>([]);





useEffect(() => {
  paymentApi
    .get("/api/payments/today")
    .then((res) => setTodayPayments(res.data))
    .catch(console.error);
}, []);



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

const todayOrders = useMemo(() => {
  return orders.filter((o) => {
    if (!o.placedAt) return false;

    // Convert backend format safely
    const formatted = o.placedAt
      .replace(" ", "T")
      .split("+")[0];

    const orderDate = new Date(formatted);
    const now = new Date();

    return (
      orderDate.getFullYear() === now.getFullYear() &&
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getDate() === now.getDate()
    );
  });
}, [orders]);

console.log("Today:", new Date());
console.log("Orders:", orders);
console.log("Today Orders:", todayOrders);

console.log("Orders object:", orders);


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


<div className="bg-white border rounded-xl p-6 mt-6 shadow-sm">
  <h2 className="text-2xl font-semibold mb-6">Today's Orders</h2>

  {todayOrders.length === 0 ? (
    <div className="text-gray-500 text-center py-6">
      No orders today
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {todayOrders.map((o) => (
        <div
          key={o.orderId}
          className="bg-gray-50 rounded-xl p-5 border hover:shadow-md transition"
        >
          <div className="flex justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold text-gray-800">
                {o.orderId}
              </p>
            </div>

            <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              {o.orderStatus}
            </span>
          </div>

          <p className="text-sm text-gray-500">Customer</p>
          <p className="font-medium">{o.userName}</p>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-xl font-bold text-green-600">
              ₹{o.totalAmount}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>



   <section className="bg-white border rounded-xl p-6 mt-6 shadow-sm">
  <h2 className="text-2xl font-semibold mb-6">Today's Payments</h2>

  {todayPayments.length === 0 ? (
    <div className="text-gray-500 text-center py-10">
      No payments recorded today
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {todayPayments.map((p: any) => (
        <div
          key={p.id}
          className="bg-gray-50 rounded-xl p-5 border hover:shadow-md transition duration-200"
        >
          {/* Top Section */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold text-lg text-gray-800">
                {p.orderId}
              </p>
            </div>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                p.status === "paid"
                  ? "bg-green-100 text-green-700"
                  : p.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {p.status}
            </span>
          </div>

          {/* Amount */}
          <div className="mt-4">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{(p.amount / 100).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
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