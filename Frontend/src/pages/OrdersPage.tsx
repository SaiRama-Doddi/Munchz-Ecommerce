import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  ShoppingBag, 
  Calendar, 
  User as UserIcon, 
  Mail, 
  MapPin, 
  CreditCard, 
  Package, 
  Eye, 
  X,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  Search,
  Filter
} from "lucide-react";

/* =========================
   BACKEND TYPES (match API)
========================= */

interface BackendOrderItem {
  productId: number;
  skuId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  taxAmount: number;
  discountAmount: number;
  variantLabel: string;
  imageUrl: string;
}
interface BackendOrder {
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderStatus: string;
  totalAmount: number;
  totalTax: number;
  totalDiscount: number;
  paymentId: string;
  couponCode: string;
  couponId: number;
  currency: string;
  shippingAddress: any;
  billingAddress: any;
  placedAt: string;
  updatedAt: string;
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  items: BackendOrderItem[];
}

/* =========================
   HELPERS
========================= */

const parseAddress = (addr: any): string => {
  if (!addr) return "—";
  if (typeof addr === "string") return addr;
  return [
    addr.addressLine1,
    addr.addressLine2,
    addr.city,
    addr.state,
    addr.pincode,
  ]
    .filter(Boolean)
    .join(", ");
};

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
  const s = status?.toUpperCase();
  if (s === "PAID" || s === "DELIVERED" || s === "COMPLETED") 
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  return "bg-gray-50 text-black border-gray-100";
};

const getStatusIcon = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "PAID" || s === "DELIVERED" || s === "COMPLETED") return <CheckCircle2 size={12} />;
  return <Clock size={12} />;
};

/* =========================
   COMPONENT
 ========================= */

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<"ALL" | "TODAY" | "7D" | "30D">("ALL");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/order/api/orders/adminallorders?page=0&size=200", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else if (res.data.content) {
          setOrders(res.data.content);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredOrders = [...orders]
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
    .filter((o) => {
      const orderDate = new Date(o.placedAt);
      const now = new Date();

      // Period Filter
      if (filterPeriod !== "ALL") {
        if (filterPeriod === "TODAY") {
          if (orderDate.toDateString() !== now.toDateString()) return false;
        } else {
          const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
          if (filterPeriod === "7D" && diffDays > 7) return false;
          if (filterPeriod === "30D" && diffDays > 30) return false;
        }
      }

      // Date Wise Filter
      if (selectedDate) {
        const d = new Date(selectedDate).toDateString();
        if (orderDate.toDateString() !== d) return false;
      }

      // Search Filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          o.orderId.toLowerCase().includes(q) ||
          o.userName.toLowerCase().includes(q) ||
          o.userEmail.toLowerCase().includes(q)
        );
      }

      return true;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Fetching orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Order Management</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Transaction Oversight</p>
        </div>

        <div className="flex items-center gap-2 text-gray-400 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
          <Package size={16} />
          <span>{orders.length} ACTIVE ORDERS</span>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center bg-gray-50/80 p-1 rounded-xl md:rounded-2xl border border-gray-100 w-full lg:w-auto flex-wrap sm:flex-nowrap">
            {[
              { label: "ALL", value: "ALL" },
              { label: "TODAY", value: "TODAY" },
              { label: "7D", value: "7D" },
              { label: "30D", value: "30D" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterPeriod(f.value as any)}
                className={`flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-lg md:rounded-xl text-[10px] font-black transition-all duration-500 uppercase tracking-wider ${
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
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all placeholder:text-gray-300"
              />
            </div>
            
            <div className="relative group w-full sm:w-auto">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all appearance-none cursor-pointer sm:min-w-[160px]"
              />
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500"
                >
                  <Filter size={14} className="rotate-45" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">ID & Date</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Customer</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Total</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Items</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((o) => (
                <tr key={o.orderId} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-black tracking-tight">#{o.orderId.slice(-8).toUpperCase()}</span>
                      <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{formatDate(o.placedAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-black text-xs border border-white shadow-sm">
                        {o.userName?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-black">{o.userName}</span>
                        <span className="text-xs text-gray-400">{o.userEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-black text-emerald-600">₹{o.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="bg-gray-50 text-gray-500 text-[10px] font-black px-2 py-1 rounded-md">
                      {o.items.length} ITEMS
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusStyles(o.orderStatus)}`}>
                      {getStatusIcon(o.orderStatus)}
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="w-10 h-10 bg-white border border-gray-100 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm mx-auto"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!filteredOrders.length && (
          <div className="text-center py-20 bg-gray-50/20">
            <div className="w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm">
              <ShoppingBag size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No orders found for this period</p>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-inter">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col animate-scaleIn border border-gray-100">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black tracking-tight">Order Insight</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">REF: #{selectedOrder.orderId}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-11 h-11 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-10">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <UserIcon size={12} /> Customer Information
                  </h4>
                  <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100">
                    <p className="text-sm font-bold text-black">{selectedOrder.userName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1.5 font-medium">
                      <Mail size={12} /> {selectedOrder.userEmail}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <MapPin size={12} /> Shipping details
                  </h4>
                  <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100">
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {parseAddress(selectedOrder.shippingAddress)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <CreditCard size={12} /> Financial Status
                  </h4>
                  <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${getStatusStyles(selectedOrder.orderStatus)}`}>
                        {selectedOrder.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-black flex items-center justify-between">
                      <span className="font-bold">Amount Due</span>
                      <span className="font-black text-emerald-600 text-sm">₹{selectedOrder.totalAmount}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <Package size={12} /> Items Manifest ({selectedOrder.items.length})
                </h4>
                <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[500px]">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Product</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Price</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Qty</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 flex gap-4 items-center">
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-14 h-14 object-contain bg-gray-50 rounded-2xl p-2"
                            />
                            <div>
                              <p className="font-bold text-black">{item.productName}</p>
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{item.variantLabel}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-gray-400">₹{item.unitPrice}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-gray-100 px-3 py-1 rounded-lg font-black text-[10px] text-black">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-black text-emerald-600">₹{item.lineTotal}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-black rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Subtotal</p>
                    <p className="text-lg md:text-xl font-black">₹{selectedOrder.totalAmount - selectedOrder.totalTax + selectedOrder.totalDiscount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Taxes</p>
                    <p className="text-lg md:text-xl font-black text-emerald-400">+ ₹{selectedOrder.totalTax}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Discounts</p>
                    <p className="text-lg md:text-xl font-black text-gray-400">- ₹{selectedOrder.totalDiscount}</p>
                  </div>
                  <div className="space-y-1 sm:border-l border-white/10 sm:pl-8">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Grant Total</p>
                    <p className="text-2xl md:text-3xl font-black">₹{selectedOrder.totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Tag size={16} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                  Coupon: <span className="text-black font-black">{selectedOrder.couponCode || "NONE"}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-black text-white px-10 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-black/5"
              >
                CLOSE VIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
