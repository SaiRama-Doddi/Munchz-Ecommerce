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
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import inventoryApi from "../api/inventoryApi";
import { useCategories, useProducts } from "../hooks/useQueryHelpers";
import paymentApi from "../api/paymentApi";
import axios from "axios";
import { 
  Package, 
  Layers, 
  ArrowUpRight, 
  AlertTriangle, 
  ShoppingCart, 
  CreditCard,
  Plus
} from "lucide-react";

/* ================= TYPES ================= */

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  createdAt: string;
}

interface Stock {
  id: number;
  productId: number;
  productName: string;
  categoryName: string;
  variantLabel: string;
  quantity: number;
}

const COLORS: string[] = [
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#f59e0b", // amber-500
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

export default function Dashboard() {
  const { data: cats = [] } = useCategories();
  const { data: prods = [] } = useProducts();

  const categories: Category[] = cats;
  const products: Product[] = prods;

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [todayPayments, setTodayPayments] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    paymentApi
      .get("/api/payments/today")
      .then((res) => setTodayPayments(res.data))
      .catch(console.error);

    inventoryApi.get("/inventory").then((res) => {
      setStocks(res.data);
    });

    const token = localStorage.getItem("token");
    axios
      .get("/order/api/orders/adminallorders?page=0&size=50&sort=placedAt,desc", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else if (res.data.content) {
          setOrders(res.data.content);
        }
      })
      .catch(console.error);
  }, []);

  const totalStockKg = useMemo(() => {
    const totalGrams = stocks.reduce((sum: number, s: Stock) => sum + s.quantity, 0);
    return (totalGrams / 1000).toFixed(1);
  }, [stocks]);

  const lowStockItems = useMemo(() => {
    return stocks.filter((s: Stock) => s.quantity < 100).length;
  }, [stocks]);

  const stockByCategory = useMemo(() => {
    return categories.map((c: Category) => {
      const total = stocks
        .filter((s: Stock) => s.categoryName === c.name)
        .reduce((sum: number, s: Stock) => sum + s.quantity, 0);

      return {
        name: c.name,
        value: +(total / 1000).toFixed(2),
      };
    }).filter(item => item.value > 0);
  }, [categories, stocks]);

  const recentProducts: Product[] = [...products]
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    })
    .slice(0, 6);

  const todayOrders = useMemo(() => {
    return orders.filter((o) => {
      if (!o.placedAt) return false;
      
      // Backend format: "dd MMM yyyy, hh:mm a" (e.g., "16 Mar 2026, 06:30 PM")
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();
      
      const todayString = `${day} ${month} ${year}`;
      
      // We check if the placedAt string contains today's date (dd MMM yyyy)
      return o.placedAt.startsWith(todayString);
    });
  }, [orders]);

  const navigate = useNavigate();

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 font-medium">An overview of your store's performance today.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/add-product")}
          className="flex items-center gap-2 bg-accent-gradient text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform duration-300"
        >
          <Plus size={18} />
          <span>New Product</span>
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Categories"
          value={categories.length}
          icon={<Layers size={24} className="text-blue-500" />}
          trend="+2 this month"
          color="blue"
        />
        <KPICard
          title="Live Products"
          value={products.length}
          icon={<Package size={24} className="text-emerald-500" />}
          trend="+12% vs last week"
          color="emerald"
        />
        <KPICard
          title="Stock Available"
          value={`${totalStockKg} KG`}
          icon={<ShoppingCart size={24} className="text-violet-500" />}
          trend="Healthy"
          color="violet"
        />
        <KPICard
          title="Low Stock Alerts"
          value={lowStockItems}
          icon={<AlertTriangle size={24} className="text-amber-500" />}
          trend="Action required"
          color="amber"
          isDanger={lowStockItems > 3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Stock Distribution" subtitle="Available stock (KG) per category">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={stockByCategory}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={5}
                stroke="none"
              >
                {stockByCategory.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Inventory Levels" subtitle="Current kg in warehouse vs category">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stockByCategory} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* RECENT PRODUCTS */}
      <section className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-800">Recently Added Products</h2>
          <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">View All</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {recentProducts.map((p: Product) => (
            <div key={p.id} className="group relative">
              <div className="aspect-square bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100 group-hover:border-emerald-200 transition-all duration-300">
                <img src={p.imageUrl} alt={p.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="mt-3">
                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">{p.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-1">ID: #{p.id}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TODAY'S ORDERS */}
        <div className="glass-card rounded-3xl p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <ShoppingCart size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Today's Orders</h2>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              {todayOrders.length} New
            </span>
          </div>

          <div className="space-y-4">
            {todayOrders.length === 0 ? (
              <div className="text-slate-400 text-sm font-medium py-10 flex flex-col items-center gap-3">
                <ShoppingCart size={40} className="opacity-20" />
                No orders placed today
              </div>
            ) : (
              todayOrders.map((o) => (
                <div key={o.orderId} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                      {o.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{o.userName}</p>
                      <p className="text-[10px] text-slate-500 font-medium">#{o.orderId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">₹{o.totalAmount}</p>
                    <span className="text-[10px] font-bold uppercase text-blue-500">{o.orderStatus}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TODAY'S PAYMENTS */}
        <div className="glass-card rounded-3xl p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <CreditCard size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Incoming Payments</h2>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              {todayPayments.length} Recv
            </span>
          </div>

          <div className="space-y-4">
            {todayPayments.length === 0 ? (
              <div className="text-slate-400 text-sm font-medium py-10 flex flex-col items-center gap-3">
                <CreditCard size={40} className="opacity-20" />
                No payments received today
              </div>
            ) : (
              todayPayments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100">
                      <ArrowUpRight size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Order #{p.orderId}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Payment ID #{p.id.slice(0,8)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">₹{(p.amount / 100).toLocaleString()}</p>
                    <span className={`text-[10px] font-bold uppercase ${p.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>{p.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function KPICard({
  title,
  value,
  icon,
  trend,
  color,
  isDanger = false
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
  color: string;
  isDanger?: boolean;
}) {
  const colorMap = {
    blue: "bg-blue-50/50 border-blue-100",
    emerald: "bg-emerald-50/50 border-emerald-100",
    violet: "bg-violet-50/50 border-violet-100",
    amber: "bg-amber-50/50 border-amber-100",
  };

  return (
    <div className={`glass-card rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <h3 className={`text-2xl font-black ${isDanger ? 'text-red-600' : 'text-slate-800'} tracking-tight`}>
            {value}
          </h3>
          <div className="mt-3 flex items-center gap-1.5">
            <span className={`text-[10px] font-bold ${isDanger ? 'text-red-500' : 'text-emerald-500'}`}>
              {trend}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-2xl ${colorMap[color as keyof typeof colorMap] || 'bg-slate-50'} border`}>
          {icon}
        </div>
      </div>
      
      {/* Decorative background shape */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-3xl p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
      </div>
      <div className="h-[320px]">
        {children}
      </div>
    </div>
  );
}