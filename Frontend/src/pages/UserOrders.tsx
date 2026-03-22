import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, User, LayoutGrid, List, Eye, Upload, Image as ImageIcon, Star, Trash2, ArrowLeft, X, ShoppingBag, Check, Flame, Trophy } from "lucide-react";
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

/* ================= ADDRESS FORMATTER ================= */
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

const PageSpinner = () => (
  <PremiumSpinner text="Fetching your orders..." />
);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

  /* ================= FETCH ================= */
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
      productImages;
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
    doc.text(formatAddress(order.shippingAddress), 14, 113);
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

  if (loading) return <div className="bg-[#f9fdf7] min-h-screen"><PageSpinner /></div>;

  return (
    <div className="bg-[#f9fdf7] min-h-screen">
      
      {/* STICKY HEADER - UNIFIED WITH CART/CHECKOUT */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-green-50 px-6 py-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-none">
              My <span className="text-green-600">Orders</span>
            </h1>
            <p className="text-xs sm:text-base text-gray-500 font-medium mt-3 max-w-2xl leading-relaxed">
              Order history & status • {orders.length} Munchz Moments
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-gray-50 hover:bg-green-50 rounded-2xl transition-all border border-gray-100 hover:border-green-200 text-gray-400 hover:text-green-600"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* USER SUMMARY CARD */}
        <div className="bg-white rounded-[2rem] border border-green-50 shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none"><User size={110} /></div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-black">{profile?.firstName?.[0]}</div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-none">{profile?.firstName} {profile?.lastName}</h2>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 mt-1">
              <Mail size={12} className="text-green-600" /> {profile?.email}
            </p>
          </div>

          <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 h-fit">
            <button
              onClick={() => setGridView(true)}
              className={`p-3 rounded-xl transition-all ${gridView ? "bg-white text-green-600 shadow-md" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`p-3 rounded-xl transition-all ${!gridView ? "bg-white text-green-600 shadow-md" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "All Orders", value: "ALL" },
            { label: "Today", value: 1 },
            { label: "7 Days", value: 7 },
            { label: "30 Days", value: 30 },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => setFilterDays(f.value as any)}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                filterDays === f.value ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-100" : "bg-white border-gray-100 text-gray-400 hover:border-green-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ORDERS LIST */}
        <div className={gridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-8"}>
          {filteredOrders.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-green-50 shadow-sm">
                <ShoppingBag size={50} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest">No Munchz Found for this period</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-[2rem] border-2 border-green-50/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden group">
                {/* CARD HEADER */}
                <div className="bg-[#ecfdf5] px-8 py-4 flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><ShoppingBag size={40} /></div>
                  <div>
                    <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest leading-none mb-1">Order Placed On</p>
                    <p className="font-bold text-gray-900 tracking-tight leading-none">{new Date(order.placedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                    ${order.orderStatus === "DELIVERED" ? "bg-green-600 text-white" : order.orderStatus === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="p-8 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center group/item hover:bg-green-50/50 p-2 rounded-2xl transition-all">
                      <img
                        src={productImages[item.productId] || "/placeholder.png"}
                        className="w-16 h-16 object-contain bg-white rounded-xl border border-transparent group-hover/item:border-green-100 transition-all cursor-pointer shadow-sm"
                        onClick={() => navigate(`/product/${item.productId}`)}
                        alt={item.productName}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm tracking-tight line-clamp-1 truncate cursor-pointer hover:text-green-600 transition-colors" onClick={() => navigate(`/product/${item.productId}`)}>{item.productName}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">₹{item.unitPrice} × {item.quantity}</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button onClick={() => navigate(`/product/${item.productId}`)} className="text-[10px] font-bold bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-all">Reorder</button>
                        {reviewedItems.has(`${order.orderId}:${item.productId}`) ? (
                          <span className="text-[9px] font-bold text-green-600 text-center flex items-center gap-1 justify-center"><Check size={8} /> Review Posted</span>
                        ) : (
                          <button onClick={() => { setSelectedOrder(order); setReviewItem(item); }} className="text-[10px] font-bold border-2 border-green-600 text-green-600 px-3 py-1.5 rounded-xl hover:bg-green-50 transition-all">Review</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 pt-4 border-t border-gray-50 flex justify-between items-center mt-auto">
                   <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Total</p>
                      <p className="text-2xl font-bold text-gray-900 tracking-tighter leading-none">₹{order.totalAmount}</p>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => setSelectedOrder(order)} className="p-3 bg-white text-gray-400 hover:text-green-600 hover:bg-green-50 border border-gray-100 rounded-xl transition-all"><Eye size={18} /></button>
                      <button onClick={() => downloadInvoice(order)} className="p-3 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-black transition-all group">
                         <span className="sr-only">Invoice</span>
                         <ArrowLeft size={16} className="rotate-[225deg] group-hover:scale-110 transition-transform" />
                      </button>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh] animate-slideUp border border-green-50">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-6 right-6 p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-gray-100 hover:border-red-100"><X size={20} /></button>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight flex items-center gap-3"><div className="w-1.5 h-8 bg-green-600 rounded-full"></div> Order Details</h2>
            
            <div className="grid sm:grid-cols-2 gap-8 bg-[#f9fdf7] p-6 rounded-[2rem] border border-green-100 mb-8">
               <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Order ID</p>
                    <p className="font-bold text-gray-900 tracking-tight">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Tracking Status</p>
                    {(selectedOrder as any).shiprocketOrderId ? (
                      <button onClick={() => navigate(`/track/${(selectedOrder as any).shiprocketShipmentId}`)} className="text-green-600 font-black uppercase text-[10px] tracking-[0.1em] flex items-center gap-2 hover:bg-white px-3 py-1.5 rounded-lg border border-transparent hover:border-green-100 transition-all">Track Packet 🔥</button>
                    ) : (
                      <span className="text-gray-900 font-bold tracking-tight">{selectedOrder.orderStatus}</span>
                    )}
                  </div>
               </div>
               <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Shipping Address</p>
                    <div className="text-sm text-gray-700 font-medium leading-relaxed">
                      {formatAddress(selectedOrder.shippingAddress).map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                  </div>
               </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Ordered Items</h3>
            <div className="space-y-4">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b border-gray-50 py-4 items-center group">
                  <img src={productImages[item.productId] || "/placeholder.png"} className="w-16 h-16 object-contain bg-[#ecfdf5] rounded-2xl border border-transparent group-hover:border-green-100 transition-all shadow-sm" alt={item.productName} />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 tracking-tight">{item.productName}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Qty: {item.quantity} • Rs. {item.unitPrice}</p>
                  </div>
                  <button onClick={() => setReviewItem(item)} className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold tracking-tight hover:bg-green-700 shadow-md transition-all">REVIEW</button>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-gray-900">
               <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Grand Total</p>
               <p className="text-3xl font-bold tracking-tighter leading-none">₹{selectedOrder.totalAmount}</p>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW PRODUCT MODAL */}
      {reviewItem && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white w-full max-h-[92vh] sm:max-w-lg rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto animate-slideUp border border-green-50 relative">
            <button onClick={() => setReviewItem(null)} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all z-10"><X size={20} /></button>
            
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <div className="w-1.5 h-8 bg-green-600 rounded-full"></div>
              Post a Review
            </h3>
            
            <div className="flex gap-6 items-center p-4 bg-[#f9fdf7] rounded-3xl border border-green-50">
               <img src={productImages[reviewItem.productId] || "/placeholder.png"} className="w-16 h-16 object-contain bg-white rounded-2xl border shadow-sm" alt={reviewItem.productName} />
               <p className="font-bold text-gray-900 text-lg tracking-tight leading-tight uppercase truncate">{reviewItem.productName}</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">Munch Rating <Star size={10} className="text-yellow-400 fill-yellow-400" /></label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`transition-all duration-300 transform hover:scale-125 ${rating >= r ? "text-yellow-400 fill-yellow-400" : "text-gray-100"}`}
                  >
                    <Star size={36} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Share your story</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Unreal flavor? Absolutely zero compromise? Tell us everything!"
                rows={4}
                className="w-full bg-gray-50/50 border-2 border-transparent border-gray-100 rounded-[1.5rem] p-4 font-bold text-gray-900 tracking-tight focus:border-green-600 focus:bg-white outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex justify-between">
                <span>Add a snap</span>
                <span className="font-bold italic normal-case text-green-600/50">Optional</span>
              </label>
              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-100 rounded-[1.5rem] cursor-pointer hover:border-green-400 hover:bg-green-50/20 transition-all group">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-200 mb-2 group-hover:text-green-500 transition-all" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-green-600 transition-all">Max size 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const f = e.target.files[0];
                        if (f.size > MAX_FILE_SIZE) {
                          alert("File size too large (Max 5MB). Please reduce image size to continue.");
                          e.target.value = "";
                          return;
                        }
                        setFile(f);
                        setPreview(URL.createObjectURL(f));
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="relative w-full h-40 rounded-[1.5rem] overflow-hidden border-2 border-green-100 shadow-inner group">
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-3 right-3 p-2.5 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-all backdrop-blur-sm shadow-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => setReviewItem(null)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">Back</button>
              <button
                disabled={submitting || !comment}
                onClick={async () => {
                  try {
                    setSubmitting(true);
                    const token = localStorage.getItem("token")!;
                    const payload: any = JSON.parse(atob(token.split(".")[1]));
                    const formData = new FormData();
                    formData.append("request", JSON.stringify({
                      orderId: selectedOrder.orderId,
                      productId: reviewItem.productId,
                      productName: reviewItem.productName,
                      userId: payload.sub,
                      userName: payload.name,
                      rating,
                      comment,
                    }));
                    if (file) formData.append("file", file);
                    await axios.post("/reviews/form", formData);
                    alert("Ayyy! Your review is live! 🚀");
                    const key = `${selectedOrder.orderId}:${reviewItem.productId}`;
                    setReviewedItems(prev => new Set(prev).add(key));
                    setReviewItem(null);
                    setComment("");
                    setRating(5);
                    setFile(null);
                    setPreview(null);
                  } catch (e: any) {
                    alert(e.response?.data?.message || "Oops! Review submission failed.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="flex-[2] py-4 bg-green-600 text-white rounded-2xl text-sm font-bold tracking-tight flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-green-700 transition-all shadow-md"
              >
                {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
