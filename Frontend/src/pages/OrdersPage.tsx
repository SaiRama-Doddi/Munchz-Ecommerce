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
  Tag
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
  if (s === "PENDING" || s === "PROCESSING") 
    return "bg-amber-50 text-amber-600 border-amber-100";
  if (s === "CANCELLED" || s === "FAILED") 
    return "bg-red-50 text-red-600 border-red-100";
  return "bg-slate-50 text-slate-600 border-slate-100";
};

const getStatusIcon = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "PAID" || s === "DELIVERED" || s === "COMPLETED") return <CheckCircle2 size={12} />;
  if (s === "PENDING" || s === "PROCESSING") return <Clock size={12} />;
  if (s === "CANCELLED" || s === "FAILED") return <AlertCircle size={12} />;
  return <Package size={12} />;
};

/* =========================
   COMPONENT
========================= */

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
  const [filterDays, setFilterDays] = useState<number | "ALL">("ALL");

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
      if (filterDays === "ALL") return true;
      const limit = new Date();
      limit.setDate(limit.getDate() - filterDays);
      return new Date(o.placedAt) >= limit;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-bold">Fetching orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 font-medium">Monitor and process customer orders</p>
        </div>

        <div className="flex items-center gap-2 text-slate-400 bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-xl text-sm font-bold">
          <Package size={16} />
          <span>{orders.length} Total Orders</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="glass-card rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Calendar size={18} />
          </div>
          <span className="text-sm font-bold text-slate-700">Filter by period:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { label: "All History", value: "ALL" },
            { label: "Today", value: 1 },
            { label: "Last 7 Days", value: 7 },
            { label: "Last 30 Days", value: 30 },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => setFilterDays(f.value as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-300 ${
                filterDays === f.value
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">ID & Date</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Customer</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Total</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Items</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Shipping</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((o) => (
                <tr key={o.orderId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 tracking-tight">#{o.orderId.slice(-8).toUpperCase()}</span>
                      <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{formatDate(o.placedAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs border border-white shadow-sm">
                        {o.userName?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{o.userName}</span>
                        <span className="text-xs text-slate-400">{o.userEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-black text-emerald-600">₹{o.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-md">
                      {o.items.length} PKTS
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusStyles(o.orderStatus)}`}>
                      {getStatusIcon(o.orderStatus)}
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col max-w-[180px]">
                      {o.shiprocketOrderId ? (
                        <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-black uppercase">
                          <Truck size={12} />
                          Shiprocket Active
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium truncate italic">
                          {parseAddress(o.shippingAddress)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="w-10 h-10 bg-white border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:text-emerald-500 hover:border-emerald-100 transition-all shadow-sm"
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
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <ShoppingBag size={32} />
            </div>
            <p className="text-slate-400 font-bold">No orders found for this period</p>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col animate-scaleIn">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Order Details</h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">#{selectedOrder.orderId}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-11 h-11 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-10">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <UserIcon size={12} /> Customer Information
                  </h4>
                  <div className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100">
                    <p className="text-sm font-bold text-slate-700">{selectedOrder.userName}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5 font-medium">
                      <Mail size={12} /> {selectedOrder.userEmail}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <MapPin size={12} /> Shipping Destination
                  </h4>
                  <div className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100">
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {parseAddress(selectedOrder.shippingAddress)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <CreditCard size={12} /> Transaction Status
                  </h4>
                  <div className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${getStatusStyles(selectedOrder.orderStatus)}`}>
                        {selectedOrder.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center justify-between">
                      <span className="font-bold">Total Bill</span>
                      <span className="font-black text-emerald-600 text-sm">₹{selectedOrder.totalAmount}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <Package size={12} /> Ordered Items ({selectedOrder.items.length})
                </h4>
                <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Product</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Unit Price</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Qty</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 flex gap-4 items-center">
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-14 h-14 object-contain bg-slate-50 rounded-2xl p-2"
                            />
                            <div>
                              <p className="font-bold text-slate-800">{item.productName}</p>
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{item.variantLabel}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-slate-500">₹{item.unitPrice}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-slate-100 px-3 py-1 rounded-lg font-black text-[10px] text-slate-600">
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
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Subtotal</p>
                    <p className="text-xl font-black">₹{selectedOrder.totalAmount - selectedOrder.totalTax + selectedOrder.totalDiscount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Taxes</p>
                    <p className="text-xl font-black text-emerald-400">+ ₹{selectedOrder.totalTax}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Discounts</p>
                    <p className="text-xl font-black text-red-400">- ₹{selectedOrder.totalDiscount}</p>
                  </div>
                  <div className="space-y-1 border-l border-white/10 pl-8">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Grant Total</p>
                    <p className="text-3xl font-black">₹{selectedOrder.totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Tag size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Coupon: <span className="text-slate-900">{selectedOrder.couponCode || "No Coupon"}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-900 text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
