import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import paymentApi from "../api/paymentApi";

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  razorpayPaymentId?: string;
}

interface Order {
  orderId: string;
  userName: string;
  userEmail: string;
}

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState<"ALL" | "TODAY" | "7D" | "30D">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [payRes, orderRes] = await Promise.all([
          paymentApi.get("/api/payments/all"),
          axios.get("/order/api/orders/adminallorders?page=0&size=1000", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setPayments(payRes.data);
        const orderList = Array.isArray(orderRes.data) ? orderRes.data : orderRes.data.content || [];
        setOrders(orderList);
      } catch (err) {
        console.error("Error fetching payment data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getOrderName = (orderId: string) => {
    const order = orders.find(o => o.orderId === orderId);
    return order ? order.userName : "Guest Customer";
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const payDate = new Date(p.createdAt);
      const now = new Date();
      
      // Period Filter
      if (filterPeriod !== "ALL") {
        if (filterPeriod === "TODAY") {
          return payDate.toDateString() === now.toDateString();
        }
        
        const diffDays = (now.getTime() - payDate.getTime()) / (1000 * 60 * 60 * 24);
        if (filterPeriod === "7D" && diffDays > 7) return false;
        if (filterPeriod === "30D" && diffDays > 30) return false;
      }

      // Date Wise Filter
      if (selectedDate) {
        const d = new Date(selectedDate).toDateString();
        if (payDate.toDateString() !== d) return false;
      }

      // Search Filter (ID or Order ID)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.id.toLowerCase().includes(q) || 
          p.orderId.toLowerCase().includes(q) ||
          getOrderName(p.orderId).toLowerCase().includes(q)
        );
      }

      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [payments, orders, filterPeriod, searchQuery, selectedDate]);

  const stats = useMemo(() => {
    const successful = payments.filter(p => p.status === 'paid' || p.status === 'SUCCESS');
    const totalRev = successful.reduce((sum, p) => sum + (p.amount / 100), 0);
    return {
      totalRevenue: totalRev,
      successfulCount: successful.length,
      pendingCount: payments.length - successful.length
    };
  }, [payments]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'paid' || s === 'success') return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (s === 'pending') return "bg-orange-50 text-orange-600 border-orange-100";
    return "bg-red-50 text-red-600 border-red-100";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] text-gray-400 uppercase">Processing Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl text-black">Financial Ledger</h1>
          <p className="text-gray-400 uppercase text-[10px]">Payment Oversight & Reconciliation</p>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="flex-1 min-w-[140px] bg-white border border-gray-100 px-4 md:px-5 py-3 rounded-2xl shadow-sm flex items-center gap-3 group hover:border-emerald-500/30 transition-all">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Volume</p>
              <p className="text-sm text-black">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <button className="flex-1 md:flex-none justify-center bg-black text-white px-6 py-3 rounded-2xl text-[10px] uppercase hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center bg-white p-1 rounded-xl md:rounded-2xl border border-gray-100 w-full lg:w-auto flex-wrap sm:flex-nowrap">
            {[
              { label: "ALL", value: "ALL" },
              { label: "TODAY", value: "TODAY" },
              { label: "7D", value: "7D" },
              { label: "30D", value: "30D" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterPeriod(f.value as any)}
                className={`flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-lg md:rounded-xl text-[10px] transition-all duration-500 uppercase tracking-wider ${
                  filterPeriod === f.value
                    ? "bg-black text-white shadow-lg shadow-black/20"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:max-w-md w-full">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all placeholder:text-gray-300"
              />
            </div>
            
            <div className="relative group w-full sm:w-auto">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all appearance-none cursor-pointer sm:min-w-[160px]"
              />
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500"
                >
                  <ArrowUpRight size={14} className="rotate-45" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-8 py-6 text-[10px] text-gray-400 uppercase border-b border-gray-100">Transaction Details</th>
                <th className="px-8 py-6 text-[10px] text-gray-400 uppercase border-b border-gray-100">Customer Name</th>
                <th className="px-8 py-6 text-[10px] text-gray-400 uppercase border-b border-gray-100 text-right">Amount</th>
                <th className="px-8 py-6 text-[10px] text-gray-400 uppercase border-b border-gray-100 text-center">Status</th>
                <th className="px-8 py-6 text-[10px] text-gray-400 uppercase border-b border-gray-100 text-center">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="group hover:bg-green-50/5 transition-all duration-300 cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-black">#{p.id.slice(-12).toUpperCase()}</span>
                      <span className="text-[10px] text-gray-400 uppercase mt-1.5 flex items-center gap-1.5">
                        <Clock size={12} className="text-emerald-500" />
                        {formatDate(p.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xs border border-white shadow-sm ring-4 ring-orange-500/5 group-hover:scale-110 transition-all">
                        {getOrderName(p.orderId).charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-black">{getOrderName(p.orderId)}</span>
                        <span className="text-[10px] text-gray-400 leading-tight">Order #{p.orderId.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-base text-emerald-600">₹{(p.amount / 100).toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400 uppercase">{p.currency}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] border uppercase tracking-wider ${getStatusStyles(p.status)}`}>
                      {p.status === 'paid' || p.status === 'SUCCESS' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-[10px] text-gray-400 bg-white border border-gray-100 px-2 py-1 rounded-md">
                      {p.razorpayPaymentId || "DIRECT"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center bg-white">
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-center mb-6 text-gray-200 shadow-xl shadow-gray-200/20 animate-pulse">
              <AlertCircle size={40} />
            </div>
            <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">No transactions found in this scope</p>
          </div>
        )}
      </div>

      {/* PAGINATION (MOCK) */}
      <div className="flex items-center justify-center gap-4">
        <button className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-30 border border-gray-100" disabled>
          <ChevronLeft size={20} />
        </button>
        <span className="text-[10px] text-black px-6 py-3 bg-white border border-gray-100 rounded-2xl uppercase">Page 1 of 1</span>
        <button className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-30 border border-gray-100" disabled>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default AdminPayments;
