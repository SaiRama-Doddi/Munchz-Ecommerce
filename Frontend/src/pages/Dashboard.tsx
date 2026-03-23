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
import offlineInventoryApi from "../api/offlineInventoryApi";
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
  Plus,
  Boxes
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
  "#047857", // emerald-700
  "#059669", // emerald-600
  "#10b981", // emerald-500
  "#34d399", // emerald-400
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
  const navigate = useNavigate();
  const { data: cats = [] } = useCategories();
  const { data: prods = [] } = useProducts();

  const categories: Category[] = cats;
  const products: Product[] = prods;

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [offlineStocks, setOfflineStocks] = useState<any[]>([]);
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [chartView, setChartView] = useState<"distribution" | "inventory" | "orders">("distribution");
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "30d" | "all">("all");
  const [listFilter, setListFilter] = useState<"24h" | "7d" | "30d" | "all">("24h");

  useEffect(() => {
    paymentApi
      .get("/api/payments/all")
      .then((res) => setAllPayments(res.data))
      .catch(console.error);

    inventoryApi.get("/inventory").then((res) => {
      setStocks(res.data);
    });

    offlineInventoryApi.get("/offline-inventory").then((res) => {
      setOfflineStocks(res.data);
    });

    const token = localStorage.getItem("token");
    axios
      .get("/order/api/orders/adminallorders?page=0&size=1000&sort=placedAt,desc", {
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

  const totalStock = useMemo(() => {
    const online = stocks.reduce((sum: number, s: Stock) => sum + s.quantity, 0);
    const offline = offlineStocks.reduce((sum: number, s: any) => sum + (Number(s.quantity) || 0), 0);
    
    return {
      total: online + offline,
      online,
      offline
    };
  }, [stocks, offlineStocks]);

  const lowStockItems = useMemo(() => {
    return stocks.filter((s: Stock) => s.quantity < 100).length;
  }, [stocks]);

  /* ================= HELPERS ================= */
  const parseOrderDate = (dateStr: string) => {
    if (!dateStr) return new Date(0);
    try {
      // Format: "17 Mar 2026, 04:10 PM"
      const [datePart, timePart] = dateStr.split(', ');
      const [day, month, year] = datePart.split(' ');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIdx = monthNames.indexOf(month);
      
      let [time, modifier] = timePart.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      const d = new Date(Number(year), monthIdx, Number(day), hours, minutes);
      return isNaN(d.getTime()) ? new Date(dateStr) : d;
    } catch (e) {
      return new Date(dateStr);
    }
  };

  const recentProducts: Product[] = [...products]
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    })
    .slice(0, 6);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (!o.placedAt || timeFilter === "all") return true;

      const orderDate = parseOrderDate(o.placedAt);
      const now = new Date();
      const diffHrs = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

      if (timeFilter === "24h") {
        return orderDate.toDateString() === now.toDateString();
      }
      if (timeFilter === "7d") return diffHrs <= 168;
      if (timeFilter === "30d") return diffHrs <= 720;
      return true;
    });
  }, [orders, timeFilter]);

  const filteredPayments = useMemo(() => {
    return allPayments.filter((p) => {
      if (!p.createdAt || timeFilter === "all") return true;

      const payDate = new Date(p.createdAt);
      const now = new Date();
      const diffHrs = (now.getTime() - payDate.getTime()) / (1000 * 60 * 60);

      if (timeFilter === "24h") {
        return payDate.toDateString() === now.toDateString();
      }
      if (timeFilter === "7d") return diffHrs <= 168;
      if (timeFilter === "30d") return diffHrs <= 720;
      return true;
    });
  }, [allPayments, timeFilter]);

  const totalRevenue = useMemo(() => {
    return filteredPayments
      .filter(p => p.status === 'paid' || p.status === 'SUCCESS')
      .reduce((sum, p) => sum + (p.amount / 100), 0);
  }, [filteredPayments]);

  const ordersByDate = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach(o => {
      const date = o.placedAt ? o.placedAt.split(',')[0] : 'Unknown';
      map[date] = (map[date] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).reverse().slice(-7);
  }, [filteredOrders]);

  const listFilteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (!o.placedAt || listFilter === "all") return true;
      const orderDate = parseOrderDate(o.placedAt);
      const now = new Date();
      const diffHrs = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
      if (listFilter === "24h") {
        return orderDate.toDateString() === now.toDateString();
      }
      if (listFilter === "7d") return diffHrs <= 168;
      if (listFilter === "30d") return diffHrs <= 720;
      return true;
    });
  }, [orders, listFilter]);

  const listFilteredPayments = useMemo(() => {
    return allPayments.filter((p) => {
      if (!p.createdAt || listFilter === "all") return true;
      const payDate = new Date(p.createdAt);
      const now = new Date();
      const diffHrs = (now.getTime() - payDate.getTime()) / (1000 * 60 * 60 * 24); // Use days for 7d/30d
      
      if (listFilter === "24h") {
        return payDate.toDateString() === now.toDateString();
      }
      if (listFilter === "7d") return diffHrs <= 7;
      if (listFilter === "30d") return diffHrs <= 30;
      return true;
    });
  }, [allPayments, listFilter]);

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

  return (
    <div className="space-y-10 pb-10 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-3xl md:text-4xl text-black">System Overview</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1">Real-time Performance Metrics</p>
        </div>

        <button 
          onClick={() => navigate("/admin/add-product")}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-7 py-3.5 rounded-[1.25rem] text-[10px] uppercase shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all duration-500 w-full md:w-auto"
        >
          <Plus size={18} />
          <span>Launch New Product</span>
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <KPICard
          title="Revenue"
          subtitle="Total Sales"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={<CreditCard size={24} />}
          bgIcon={<CreditCard size={100} />}
          color="black"
          onClick={() => navigate("/admin/payments")}
        />
        <KPICard
          title="Global Aggregate"
          subtitle="Total Stock"
          value={totalStock.total.toLocaleString()}
          icon={<Boxes size={24} />}
          bgIcon={<Boxes size={100} />}
          color="emerald"
          onClick={() => navigate("/admin/complete-stock")}
        />
        <KPICard
          title="Orders"
          subtitle="Total volume"
          value={filteredOrders.length}
          icon={<ShoppingCart size={24} />}
          bgIcon={<ShoppingCart size={100} />}
          color="emerald"
          onClick={() => navigate("/admin/orders")}
        />
        <KPICard
          title="Products"
          subtitle="Live Catalog"
          value={products.length}
          icon={<Package size={24} />}
          bgIcon={<Package size={100} />}
          color="emerald"
          onClick={() => navigate("/admin/products")}
        />
        <KPICard
          title="Catalog"
          subtitle="Categories"
          value={categories.length}
          icon={<Layers size={24} />}
          bgIcon={<Layers size={100} />}
          color="emerald"
          onClick={() => navigate("/admin/category")}
        />
        <KPICard
          title="Inventory Monitor"
          subtitle="Low Stock"
          value={lowStockItems}
          icon={<AlertTriangle size={24} />}
          bgIcon={<AlertTriangle size={100} />}
          color="black"
          onClick={() => navigate("/admin/inventory")}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ChartCard 
          title="Performance Analytics" 
          subtitle="Real-time data visualization"
          action={
            <div className="relative">
              <select 
                value={chartView}
                onChange={(e) => setChartView(e.target.value as any)}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 pr-10 text-xs text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                <option value="distribution">Stock Distribution</option>
                <option value="inventory">Inventory Levels</option>
                <option value="orders">Daily Order Volume</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Plus size={14} className="rotate-45" />
              </div>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={360}>
            {chartView === "distribution" ? (
              <PieChart>
                <Pie
                  data={stockByCategory}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  innerRadius={80}
                  paddingAngle={5}
                  stroke="none"
                >
                  {stockByCategory.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            ) : chartView === "inventory" ? (
              <BarChart data={stockByCategory} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(240, 253, 244, 0.5)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={ordersByDate} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                   cursor={{ fill: 'rgba(240, 253, 244, 0.5)' }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                 />
                <Bar dataKey="value" fill="#047857" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* RECENT PRODUCTS */}
      <section className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg md:text-xl text-black">New Products</h2>
          <button className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors">View All</button>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {recentProducts.map((p: Product) => (
            <div key={p.id} className="group relative">
              <div className="aspect-square bg-gray-50 rounded-2xl p-4 flex items-center justify-center border border-gray-100 group-hover:border-emerald-600/30 transition-all duration-300">
                <img src={p.imageUrl} alt={p.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="mt-3">
                <p className="text-sm text-black truncate group-hover:text-emerald-600 transition-colors">{p.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">ID: #{p.id}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-4">
        {/* RECENT ORDERS */}
        <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm overflow-hidden flex flex-col h-full relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <ShoppingCart size={20} />
              </div>
              <div>
                <h2 className="text-xl text-black leading-tight">Orders Feed</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Live tracking</p>
              </div>
            </div>
            
            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100 flex-wrap sm:flex-nowrap">
              {[
                { label: 'ALL', value: 'all' },
                { label: 'TODAY', value: '24h' },
                { label: '7D', value: '7d' },
                { label: '30D', value: '30d' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setListFilter(f.value as any)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] transition-all duration-300 uppercase ${
                    listFilter === f.value 
                      ? 'bg-black text-white shadow-lg shadow-black/20 scale-105' 
                      : 'text-gray-400 hover:text-black hover:bg-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2 no-scrollbar max-h-[500px]">
            {listFilteredOrders.length === 0 ? (
              <div className="text-gray-400 text-sm py-16 flex flex-col items-center gap-3">
                <ShoppingCart size={40} className="opacity-10" />
                No orders for this period
              </div>
            ) : (
              listFilteredOrders.slice(0, 50).map((o) => (
                <div key={o.orderId} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-emerald-600/20 transition-all duration-300 group cursor-pointer" onClick={() => navigate("/admin/orders")}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 text-gray-400 group-hover:text-emerald-600 transition-colors">
                      {o.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-black">{o.userName}</p>
                      <p className="text-[10px] text-gray-400">{o.placedAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-black">₹{o.totalAmount}</p>
                    <span className="text-[10px] uppercase text-emerald-600">{o.orderStatus}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PAYMENTS */}
        <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-black text-white">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="text-xl text-black leading-tight">Payments Log</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Transaction history</p>
              </div>
            </div>
            
             <span className="px-3 py-1.5 bg-gray-50 text-black text-[10px] rounded-lg uppercase tracking-wider border border-gray-100">
              {listFilteredPayments.length} Recv
            </span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2 no-scrollbar max-h-[500px]">
            {listFilteredPayments.length === 0 ? (
              <div className="text-gray-400 text-sm py-16 flex flex-col items-center gap-3">
                <CreditCard size={40} className="opacity-10" />
                No payments for this period
              </div>
            ) : (
              listFilteredPayments.slice(0, 50).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-emerald-600/20 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-gray-100">
                      <ArrowUpRight size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-black">Order #{p.orderId}</p>
                      <p className="text-[10px] text-gray-400">Payment ID #{p.id.slice(0,8)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-emerald-600">₹{(p.amount / 100).toLocaleString()}</p>
                    <span className={`text-[10px] uppercase ${p.status === 'paid' ? 'text-emerald-600' : 'text-emerald-400'}`}>{p.status}</span>
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
  subtitle,
  value,
  icon,
  bgIcon,
  color,
  isDanger = false,
  onClick
}: {
  title: string;
  subtitle: string;
  value: number | string;
  icon: React.ReactNode;
  bgIcon: React.ReactNode;
  color: string;
  isDanger?: boolean;
  onClick?: () => void;
}) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600",
    black: "bg-gray-100 text-black",
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-gray-100 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-500 shadow-sm ${onClick ? 'cursor-pointer hover:border-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/5' : ''}`}
    >
      {/* Background Decorative Icon */}
      <div className="absolute -right-2 -top-2 md:-right-4 md:-top-4 opacity-[0.03] text-black group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none">
        {bgIcon}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3.5 mb-4 md:mb-6">
          <div className={`p-2.5 md:p-3 rounded-[1rem] md:rounded-[1.25rem] shadow-sm ${colorMap[color as keyof typeof colorMap] || colorMap.emerald}`}>
            {icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-[0.15em] leading-none mb-1">
              {title}
            </span>
            <span className="text-[10px] text-emerald-600/60 uppercase leading-none">
              Live Data
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-3xl text-black mb-1 leading-none">
            {value}
          </h3>
          <p className="text-[10px] text-gray-400 uppercase">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  action
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl text-black">
            {title}
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-wider">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="min-h-[360px]">
        {children}
      </div>
    </div>
  );
}