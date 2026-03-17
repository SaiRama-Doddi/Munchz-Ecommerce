import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, User as UserIcon, LayoutGrid, List, Eye, Upload, Star, Trash2, Package, Calendar, MapPin, ChevronRight, FileText, ShoppingBag } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaTimes } from "react-icons/fa";
import PremiumSpinner from "../components/PremiumSpinner";

/* ================= TYPES ================= */

interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

interface Order {
  orderId: string;
  orderStatus: string;
  placedAt: string;
  totalAmount: number;
  shippingAddress: any;
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  items: OrderItem[];
}

const formatAddress = (address: any): string[] => {
  try {
    const a = typeof address === "string" ? JSON.parse(address) : address;
    return [
      `${a.label || ""}`,
      `${a.addressLine1 || ""}`,
      `${a.addressLine2 || ""}`,
      `${a.city || ""}, ${a.state || ""} - ${a.pincode || ""}`,
      `${a.country || ""}`,
      `Phone: ${a.phone || ""}`,
    ].filter((line) => line.trim() !== "");
  } catch {
    return ["Address not available"];
  }
};

export default function UserOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productImages, setProductImages] = useState<Record<number, string>>({});
  const [reviewedItems, setReviewedItems] = useState<Set<string>>(new Set());
  const [reviewItem, setReviewItem] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState<number | "ALL">("ALL");
  const [gridView, setGridView] = useState(true);

  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/order/api/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setOrders(res.data.content || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const imageMap: Record<number, string> = {};
      for (const order of orders) {
        for (const item of order.items) {
          if (!imageMap[item.productId]) {
            try {
              const res = await axios.get(`/product/api/products/${item.productId}`);
              imageMap[item.productId] = res.data.imageUrls?.[0] || res.data.imageUrl || "/placeholder.png";
            } catch {
              imageMap[item.productId] = "/placeholder.png";
            }
          }
        }
      }
      setProductImages(imageMap);
    };
    if (orders.length > 0) fetchImages();
  }, [orders]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const payload: any = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub;
        const res = await axios.get(`/reviews/user/${userId}`);
        const itemKeys = new Set<string>(res.data.map((r: any) => `${r.orderId}:${r.productId}`));
        setReviewedItems(itemKeys);
      } catch (err) {
        console.error("Failed to fetch user reviews", err);
      }
    };
    fetchReviews();
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (filterDays !== "ALL") {
      const limit = new Date();
      limit.setDate(limit.getDate() - filterDays);
      filtered = orders.filter((o) => new Date(o.placedAt) >= limit);
    }
    return [...filtered].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
  }, [orders, filterDays]);

  const downloadInvoice = (order: Order) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.addImage("/munchz.png", "PNG", 14, 10, 30, 15);
    doc.setFontSize(12);
    doc.text("GoMunchZ Foods Pvt Ltd", 150, 15, { align: "right" });
    doc.text("Hyderabad, India", 150, 22, { align: "right" });
    doc.text("support@gomunchz.com", 150, 29, { align: "right" });
    doc.setFontSize(18);
    doc.text("INVOICE", 105, 50, { align: "center" });
    doc.setFontSize(11);
    doc.text(`Order ID: ${order.orderId}`, 14, 65);
    doc.text(`Date: ${new Date(order.placedAt).toLocaleDateString()}`, 14, 72);
    doc.text("Bill To:", 14, 85);
    doc.text(`${profile?.firstName} ${profile?.lastName}`, 14, 92);
    doc.text(`${profile?.email}`, 14, 99);
    doc.text("Shipping Address:", 14, 106);
    const addressLines = formatAddress(order.shippingAddress);
    doc.text(addressLines, 14, 113);
    const rows = order.items.map((item, i) => [i + 1, item.productName, item.quantity, `Rs. ${item.unitPrice}`, `Rs. ${item.unitPrice * item.quantity}`]);
    autoTable(doc, {
      startY: 140,
      head: [["#", "Product", "Qty", "Unit Price", "Total"]],
      body: rows,
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129] },
    });
    const y = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Grand Total: Rs. ${order.totalAmount}`, 150, y, { align: "right" });
    doc.text("Thank you for choosing Munchz Gourmet!", 105, y + 20, { align: "center" });
    doc.save(`Invoice-${order.orderId.slice(-8)}.pdf`);
  };

  if (loading) return <PremiumSpinner text="Auditing Your Gourmet Portfolio..." />;

  return (
    <div className="bg-white min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-20">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-50 pb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-emerald-600"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Account History</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Your Gourmet <span className="text-emerald-600 italic">Portfolio</span></h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex bg-gray-50 border border-gray-100 p-1.5 rounded-2xl">
              <button onClick={() => setGridView(true)} className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${gridView ? 'bg-white shadow-premium-soft text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid size={20} /></button>
              <button onClick={() => setGridView(false)} className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${!gridView ? 'bg-white shadow-premium-soft text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}><List size={20} /></button>
            </div>
          </div>
        </header>

        {/* FILTERS & USER SUMMARY */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Full Legacy", value: "ALL" },
              { label: "Cycle Today", value: 1 },
              { label: "Last 7 Cycles", value: 7 },
              { label: "Last 30 Cycles", value: 30 },
            ].map((f) => (
              <button
                key={f.label}
                onClick={() => setFilterDays(f.value as any)}
                className={`h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterDays === f.value ? "bg-black text-white shadow-xl shadow-black/10" : "bg-gray-50 text-gray-400 hover:bg-white hover:border-emerald-100 border border-transparent"}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="premium-card bg-emerald-50/50 p-6 lg:px-10 rounded-[2rem] flex items-center gap-6 border border-emerald-100/50">
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20"><UserIcon size={24} /></div>
            <div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-wide">{profile?.firstName} {profile?.lastName}</p>
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mt-1 opacity-70">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* ORDERS LIST */}
        <div className={gridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" : "space-y-10"}>
          {filteredOrders.map((order) => (
            <div key={order.orderId} className={`group premium-card bg-white rounded-[2.5rem] border border-gray-50 overflow-hidden transition-all duration-500 hover:shadow-2xl shadow-emerald-900/5 flex flex-col ${!gridView ? 'lg:flex-row' : ''}`}>
              
              <div className={`p-8 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center ${!gridView ? 'lg:border-b-0 lg:border-r lg:min-w-[280px]' : ''}`}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <Calendar size={12} className="text-emerald-600" />
                    {new Date(order.placedAt).toLocaleDateString()}
                  </div>
                  <p className="text-[11px] font-black text-gray-900 uppercase tracking-tighter">ID: {order.orderId.slice(-12)}</p>
                </div>
                <span className={`h-8 px-4 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center ${order.orderStatus === "DELIVERED" ? "bg-emerald-100 text-emerald-700" : order.orderStatus === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="p-8 flex-grow flex flex-col gap-8">
                <div className="space-y-6">
                  {order.items.slice(0, gridView ? 2 : undefined).map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center group/item transition-all">
                      <div className="relative w-20 h-20 bg-white rounded-2xl border border-gray-100 p-2 overflow-hidden shadow-sm group-hover/item:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                        <img src={productImages[item.productId] || "/placeholder.png"} className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-black text-gray-900 uppercase tracking-wide truncate mb-1 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => navigate(`/product/${item.productId}`)}>{item.productName}</p>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">₹{item.unitPrice} <span className="text-[9px] mx-1">×</span> {item.quantity}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.productId}`); }} className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-emerald-600 hover:text-white rounded-xl flex items-center justify-center transition-all"><ShoppingBag size={16} /></button>
                    </div>
                  ))}
                  {gridView && order.items.length > 2 && (
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600 text-center py-2 border-y border-emerald-50 bg-emerald-50/20 rounded-lg">+{order.items.length - 2} More Selections</p>
                  )}
                </div>

                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-1">Portfolio Value</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{order.totalAmount}</p>
                  </div>
                  <div className="flex gap-3">
                     <button onClick={() => setSelectedOrder(order)} className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-lg transition-all"><Eye size={18} /></button>
                     <button onClick={() => downloadInvoice(order)} className="h-12 px-6 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-black/5 flex items-center gap-3">
                        <FileText size={14} className="text-emerald-400" />
                        Invoice
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 backdrop-blur-xl bg-black/40 animate-fadeIn">
          <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl p-0 overflow-hidden flex flex-col lg:flex-row h-full max-h-[85vh] animate-slideUp">
            
            <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 z-10 w-12 h-12 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm"><FaTimes size={16} /></button>

            {/* SIDEBAR SUMMARY */}
            <div className="lg:w-[350px] bg-gray-50/80 p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col gap-10">
               <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Package size={18} className="text-emerald-600" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Archive Details</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Identifier</p>
                      <p className="text-xs font-black text-gray-900 break-all bg-white p-3 rounded-xl border border-gray-100 uppercase tracking-tighter">{selectedOrder.orderId}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Recorded At</p>
                      <p className="text-xs font-black text-gray-900">{new Date(selectedOrder.placedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Current Protocol</p>
                      <span className="inline-flex items-center h-8 px-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">{selectedOrder.orderStatus}</span>
                    </div>
                  </div>
               </div>

               <div>
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin size={18} className="text-emerald-600" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Destination</h3>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-gray-100 space-y-2">
                    {formatAddress(selectedOrder.shippingAddress).map((line, i) => (
                      <p key={i} className={`text-[11px] font-bold text-gray-500 uppercase tracking-wide ${i === 0 ? 'text-gray-900 font-black' : ''}`}>{line}</p>
                    ))}
                  </div>
               </div>

               <div className="mt-auto">
                 {selectedOrder.shiprocketShipmentId && (
                    <button onClick={() => navigate(`/track/${selectedOrder.shiprocketShipmentId}`)} className="w-full h-18 bg-emerald-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">
                       <Truck size={20} />
                       Track Sequence
                       <ChevronRight size={16} className="text-emerald-300" />
                    </button>
                 )}
               </div>
            </div>

            {/* MAIN CONTENT: ITEMS */}
            <div className="flex-1 p-10 lg:p-16 overflow-y-auto">
               <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gourmet <span className="text-emerald-600 italic">Inventory</span></h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">{selectedOrder.items.length} Items Securing</p>
               </div>

               <div className="space-y-8">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="group/detail p-6 bg-white border border-gray-50 rounded-[2rem] hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all flex flex-col sm:flex-row items-center gap-10">
                        <div className="w-24 h-24 bg-gray-50 rounded-2xl p-3 border border-gray-100 flex items-center justify-center group-hover/detail:scale-105 transition-transform cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                           <img src={productImages[item.productId] || "/placeholder.png"} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                           <h4 className="text-[14px] font-black text-gray-900 uppercase tracking-widest mb-2 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => navigate(`/product/${item.productId}`)}>{item.productName}</h4>
                           <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Premium Gourmet Selection</p>
                           <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-4">₹{item.unitPrice} <span className="mx-2 opacity-30">|</span> QTY {item.quantity}</p>
                        </div>
                        <div className="text-center sm:text-right flex flex-col gap-4">
                           <p className="text-lg font-black text-gray-900">₹{item.unitPrice * item.quantity}</p>
                           {reviewedItems.has(`${selectedOrder.orderId}:${item.productId}`) ? (
                             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">Review Authenticated</span>
                           ) : (
                             <button onClick={() => setReviewItem(item)} className="text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors border-b border-emerald-600/20 hover:border-emerald-600 pb-1">Initialize Review</button>
                           )}
                        </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 pt-12 border-t-4 border-emerald-50 flex flex-col items-end gap-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300">Total Portfolio Investment</p>
                  <p className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter italic">₹{selectedOrder.totalAmount}</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW PRODUCT */}
      {reviewItem && selectedOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/60 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 lg:p-14 space-y-12 animate-slideUp border border-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Star size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Gourmet <span className="text-emerald-600 italic">Review</span></h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-4 leading-relaxed max-w-[250px] mx-auto">Analyze and document your experience with this premium selection.</p>
            </div>
            
            <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center gap-6">
               <img src={productImages[reviewItem.productId] || "/placeholder.png"} className="w-16 h-16 object-contain bg-white rounded-xl border border-gray-100 p-2" />
               <p className="text-[12px] font-black text-gray-900 uppercase tracking-widest truncate">{reviewItem.productName}</p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Excellence Rating</p>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} onClick={() => setRating(r)} className={`transition-all duration-300 transform hover:scale-125 ${rating >= r ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "text-gray-100"}`}><Star size={36} fill={rating >= r ? "currentColor" : "none"} strokeWidth={1.5} /></button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Detailed Testimonial</p>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Elaborate on the flavor, texture, and overall presentation..." rows={4} className="w-full bg-gray-50 border-gray-50 border-2 rounded-[1.5rem] p-6 text-[13px] font-bold text-gray-900 placeholder:text-gray-300 outline-none focus:bg-white focus:border-emerald-500/30 transition-all shadow-inner" />
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex justify-between">Visual Evidence <span className="text-emerald-600/50 italic font-medium tracking-normal text-[9px]">Optional Architecture</span></p>
                {!preview ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-100 rounded-[1.5rem] cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group">
                    <div className="flex flex-col items-center justify-center">
                      <Upload size={24} className="text-gray-300 mb-2 group-hover:text-emerald-600 transition-colors" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Capture Media</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) { const f = e.target.files[0]; setFile(f); setPreview(URL.createObjectURL(f)); } }} />
                  </label>
                ) : (
                  <div className="relative w-full h-40 rounded-[1.5rem] overflow-hidden border-2 border-emerald-100 shadow-xl">
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 shadow-lg"><Trash2 size={16} /></button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6">
              <button onClick={() => setReviewItem(null)} className="h-16 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Discard Draft</button>
              <button disabled={submitting || !comment} onClick={async () => {
                try {
                  setSubmitting(true);
                  const token = localStorage.getItem("token")!;
                  const payload: any = JSON.parse(atob(token.split(".")[1]));
                  const formData = new FormData();
                  formData.append("request", JSON.stringify({ orderId: selectedOrder.orderId, productId: reviewItem.productId, productName: reviewItem.productName, userId: payload.sub, userName: payload.name, rating, comment }));
                  if (file) formData.append("file", file);
                  await axios.post("/reviews/form", formData);
                  alert("Review Successfully Authenticated!");
                  setReviewedItems(prev => new Set(prev).add(`${selectedOrder.orderId}:${reviewItem.productId}`));
                  setReviewItem(null); setComment(""); setRating(5); setFile(null); setPreview(null);
                } catch (e: any) { alert(e.response?.data?.message || "Transmission Error"); } finally { setSubmitting(false); }
              }} className="h-16 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-black/10 disabled:opacity-50">
                {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Publish Review <ArrowRight size={14} className="text-emerald-400" /></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
