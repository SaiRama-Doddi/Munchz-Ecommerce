import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, User, LayoutGrid, List, Eye, Upload, Star, Trash2, ShoppingBag, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaTimes } from "react-icons/fa";
import PremiumSpinner from "../components/PremiumSpinner";

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
            const res = await axios.get(`/product/api/products/${item.productId}`);
            imageMap[item.productId] = res.data.imageUrls?.[0] || res.data.imageUrl || "/placeholder.png";
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
        const reviewList = res.data || [];
        const itemKeys = new Set<string>(reviewList.map((r: any) => `${r.orderId}:${r.productId}`));
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
      headStyles: { fillColor: [34, 139, 34] },
    });
    const y = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Grand Total: Rs. ${order.totalAmount}`, 150, y, { align: "right" });
    doc.text("Thank you for shopping with GoMunchZ!", 105, y + 20, { align: "center" });
    doc.save(`Invoice-${order.orderId}.pdf`);
  };

  if (loading) return <div className="bg-white min-h-screen"><PremiumSpinner text="Fetching your orders..." /></div>;

  return (
    <div className="bg-white min-h-screen py-16 md:py-32 font-medium">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-20">
        
        {/* LOGGED IN USER HEADER - CURATED STYLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-12 border-b border-gray-100">
           <div>
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-gray-900 leading-none">
                Your <span className="text-green-600">Account</span>
              </h1>
              <div className="flex items-center gap-6 mt-12">
                 <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm"><User size={28} /></div>
                 <div>
                    <p className="text-2xl font-medium text-gray-900 tracking-tight uppercase">{profile?.firstName} {profile?.lastName}</p>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-[0.3em] mt-2">{profile?.email}</p>
                 </div>
              </div>
           </div>

           <div className="flex bg-gray-50 p-2.5 rounded-2xl border border-gray-100 self-start md:self-auto shadow-sm">
             <button
               onClick={() => setGridView(true)}
               className={`p-4 rounded-xl transition-all ${gridView ? "bg-white text-green-600 shadow-md" : "text-gray-300 hover:text-green-600"}`}
             >
               <LayoutGrid size={28} />
             </button>
             <button
               onClick={() => setGridView(false)}
               className={`p-4 rounded-xl transition-all ${!gridView ? "bg-white text-green-600 shadow-md" : "text-gray-300 hover:text-green-600"}`}
             >
               <List size={28} />
             </button>
           </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4">
          {[
            { label: "All Orders", value: "ALL" },
            { label: "Ordered Today", value: 1 },
            { label: "Last 7 Days", value: 7 },
            { label: "Last 30 Days", value: 30 },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => setFilterDays(f.value as any)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-medium uppercase tracking-[0.2em] border transition-all ${filterDays === f.value
                  ? "bg-gray-900 text-white border-gray-900 shadow-2xl shadow-gray-200"
                  : "bg-white text-gray-400 border-gray-100 hover:border-green-200"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ORDERS GRID/LIST */}
        <div className={gridView ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12" : "space-y-12"}>
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-[#ecfdf5]/40 rounded-[3rem] border border-green-50 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden group"
            >
              <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-green-50">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                  Ordered {new Date(order.placedAt).toLocaleDateString()}
                </span>
                <span className={`px-4 py-1.5 rounded-xl text-[8px] font-medium uppercase tracking-[0.2em] border
                  ${order.orderStatus === "DELIVERED"
                    ? "bg-green-50 text-green-600 border-green-100"
                    : order.orderStatus === "PENDING"
                    ? "bg-amber-50 text-amber-600 border-amber-100"
                    : "bg-gray-50 text-gray-500 border-gray-100"
                  }`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="p-10 space-y-8">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-center bg-white p-5 rounded-[2rem] border border-gray-50 hover:border-green-100 transition-all shadow-sm">
                    <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-gray-100 p-3">
                       <img src={productImages[item.productId] || "/placeholder.png"} className="w-full h-full object-contain" alt={item.productName} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 truncate tracking-tight uppercase">{item.productName}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-2">₹{item.unitPrice} × {item.quantity}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                       <button
                        onClick={() => navigate(`/product/${item.productId}`)}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl text-[8px] font-medium uppercase shadow-md hover:bg-green-700 transition-all"
                      >
                        Buy Again
                      </button>
                      {reviewedItems.has(`${order.orderId}:${item.productId}`) ? (
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[8px] font-medium uppercase text-center border border-emerald-100">Reviewed</div>
                      ) : (
                        <button
                          onClick={() => { setSelectedOrder(order); setReviewItem(item); }}
                          className="px-4 py-2 bg-white border border-green-600 text-green-600 rounded-xl text-[8px] font-medium uppercase hover:bg-green-50 transition-all text-center"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-10 pt-0 mt-6 flex justify-between items-center border-t border-green-50/50 bg-white/40 backdrop-blur-md">
                <div className="flex flex-col gap-2">
                   <p className="text-[8px] font-medium text-gray-400 uppercase tracking-[0.3em]">Total Value</p>
                   <p className="text-3xl font-medium text-gray-900 tracking-tighter italic leading-none">₹{order.totalAmount}</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-14 h-14 flex items-center justify-center bg-white text-green-600 rounded-3xl border border-green-50 shadow-md hover:shadow-xl transition-all"
                  >
                    <Eye size={24} />
                  </button>
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="px-8 py-4 bg-gray-900 text-white rounded-[1.5rem] text-[10px] font-medium uppercase tracking-[0.2em] shadow-2xl shadow-gray-200 hover:bg-black transition-all"
                  >
                    Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-2xl rounded-[4rem] p-16 shadow-2xl relative animate-in zoom-in duration-500">
              <button onClick={() => setSelectedOrder(null)} className="absolute top-12 right-12 w-14 h-14 flex items-center justify-center bg-gray-50 text-gray-400 rounded-3xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"><X size={32} /></button>
              <h2 className="text-5xl font-medium text-gray-900 tracking-tight uppercase mb-12">Order <span className="text-green-600">Details</span></h2>
              <div className="space-y-8 text-sm font-medium text-gray-600">
                 <p className="flex justify-between items-center border-b border-gray-50 pb-6 tracking-widest uppercase text-[10px]"><span>Order ID</span> <span className="text-gray-900">{selectedOrder.orderId}</span></p>
                 <p className="flex justify-between items-center border-b border-gray-50 pb-6 tracking-widest uppercase text-[10px]"><span>Placed On</span> <span className="text-gray-900">{new Date(selectedOrder.placedAt).toLocaleString()}</span></p>
                 <p className="flex justify-between items-center border-b border-gray-50 pb-6 tracking-widest uppercase text-[10px]"><span>Status</span> <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-xl shadow-sm">{selectedOrder.orderStatus}</span></p>
              </div>
              <div className="mt-12 overflow-y-auto max-h-[300px] pr-6 space-y-6">
                 {selectedOrder.items.map((item, i) => (
                   <div key={i} className="flex justify-between items-center p-6 bg-gray-50/50 rounded-3xl border border-gray-100 shadow-inner">
                      <p className="font-medium text-gray-900 uppercase tracking-tight">{item.productName} × {item.quantity}</p>
                      <p className="font-medium text-gray-900 tracking-tighter">₹{item.unitPrice * item.quantity}</p>
                   </div>
                 ))}
              </div>
              <div className="mt-12 pt-12 border-t border-gray-100 flex justify-between items-baseline">
                 <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.5em]">Grand Total</p>
                 <p className="text-6xl font-medium text-gray-900 tracking-tighter italic">₹{selectedOrder.totalAmount}</p>
              </div>
           </div>
        </div>
      )}

      {reviewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-6 text-gray-900">
           <div className="bg-white w-full max-w-lg rounded-[4rem] p-16 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-700">
              <button onClick={() => setReviewItem(null)} className="absolute top-12 right-12 text-gray-300 hover:text-red-500 transition-all"><X size={32} /></button>
              <h3 className="text-4xl font-medium tracking-tight uppercase mb-12">Review <span className="text-green-600">Snacks</span></h3>
              
              <div className="flex gap-6 items-center p-6 bg-gray-50 rounded-[2.5rem] mb-12 border border-inset shadow-inner">
                <img src={productImages[reviewItem.productId] || "/placeholder.png"} className="w-16 h-16 object-contain bg-white rounded-2xl border p-2 shadow-sm" />
                <p className="font-medium text-gray-900 uppercase tracking-tight truncate">{reviewItem.productName}</p>
              </div>

              <div className="space-y-12">
                 <div className="space-y-6">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.4em] px-1 text-center">Your Rating</p>
                    <div className="flex justify-center gap-4">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button key={r} onClick={() => setRating(r)} className={`transition-all hover:scale-125 ${rating >= r ? "text-yellow-400 drop-shadow-lg" : "text-gray-100"}`}><Star size={48} fill={rating >= r ? "currentColor" : "none"}/></button>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Share your experience</p>
                    <textarea value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Tell us about the flavor..." className="w-full h-40 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 outline-none focus:border-green-400 transition-all text-sm font-medium shadow-inner" />
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Snapshot</p>
                    {!preview ? (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-100 rounded-[3rem] cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all group shadow-sm bg-gray-50/30">
                         <Upload className="w-10 h-10 text-gray-300 group-hover:text-green-600 mb-4 transition-all" />
                         <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest group-hover:text-green-600">Select Image</p>
                         <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const f = e.target.files[0];
                              const MAX_SIZE = 5 * 1024 * 1024;
                              if (f.size > MAX_SIZE) { alert("File size exceeds 5MB limit. Please upload a smaller image."); return; }
                              setFile(f); setPreview(URL.createObjectURL(f));
                            }
                         }} />
                      </label>
                    ) : (
                      <div className="relative w-full h-48 rounded-[3rem] overflow-hidden border border-green-100 shadow-xl">
                         <img src={preview} className="w-full h-full object-cover" />
                         <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-6 right-6 p-3 bg-red-500 text-white rounded-2xl shadow-2xl hover:bg-red-600 transition-all"><Trash2 size={20} /></button>
                      </div>
                    )}
                 </div>

                 <button
                    disabled={submitting || !comment}
                    onClick={async () => {
                      try {
                        setSubmitting(true);
                        const token = localStorage.getItem("token")!;
                        const payload: any = JSON.parse(atob(token.split(".")[1]));
                        const formData = new FormData();
                        const reviewJson = { orderId: selectedOrder!.orderId, productId: reviewItem.productId, productName: reviewItem.productName, userId: payload.sub, userName: payload.name, rating, comment };
                        formData.append("request", JSON.stringify(reviewJson));
                        if (file) formData.append("file", file);
                        await axios.post("/reviews/form", formData);
                        alert("Review shared! Thank you.");
                        setReviewedItems(prev => new Set(prev).add(`${selectedOrder!.orderId}:${reviewItem.productId}`));
                        setReviewItem(null); setComment(""); setRating(5); setFile(null); setPreview(null);
                      } catch (e: any) { alert(e.response?.data?.message || "Error submitting review"); } finally { setSubmitting(false); }
                    }}
                    className="w-full bg-green-600 text-white py-7 rounded-[2rem] font-medium uppercase tracking-[0.3em] shadow-2xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
                 >
                    {submitting ? "Sharing..." : "Share Experience"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
