import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, User, LayoutGrid, List, Eye, Upload, Image as ImageIcon, Star, Trash2 } from "lucide-react";
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
    const a =
      typeof address === "string" ? JSON.parse(address) : address;

    return [
      `${a.label || ""}`,                              // SagarNagar
      `${a.addressLine1 || ""}`,                       // Rushikonda123
      `${a.addressLine2 || ""}`,                       // SBI Bank
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
          const res = await axios.get(
            `/product/api/products/${item.productId}`
          );
          imageMap[item.productId] =
            res.data.imageUrls?.[0] || res.data.imageUrl || "/placeholder.png";
        }
      }
    }

    setProductImages(imageMap);
  };

  if (orders.length > 0) {
    fetchImages();
  }
}, [orders]);

/* ================= FETCH REVIEWS ================= */
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

  /* ================= FILTER ================= */
const filteredOrders = useMemo(() => {
  let filtered = orders;

  if (filterDays !== "ALL") {
    const limit = new Date();
    limit.setDate(limit.getDate() - filterDays);

    filtered = orders.filter(
      (o) => new Date(o.placedAt) >= limit
    );
  }

  // 🔥 SORT DESCENDING (Latest first)
  return [...filtered].sort(
    (a, b) =>
      new Date(b.placedAt).getTime() -
      new Date(a.placedAt).getTime()
  );
}, [orders, filterDays]);


  /* ================= PROFESSIONAL INVOICE ================= */

  const downloadInvoice = (order: Order) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // Logo
    doc.addImage("/munchz.png", "PNG", 14, 10, 30, 15);

    // Company
    doc.setFontSize(12);
    doc.text("GoMunchZ Foods Pvt Ltd", 150, 15, { align: "right" });
    doc.text("Hyderabad, India", 150, 22, { align: "right" });
    doc.text("support@gomunchz.com", 150, 29, { align: "right" });

    // Title
    doc.setFontSize(18);
    doc.text("INVOICE", 105, 50, { align: "center" });

    // Order info
    doc.setFontSize(11);
    doc.text(`Order ID: ${order.orderId}`, 14, 65);
    doc.text(
      `Date: ${new Date(order.placedAt).toLocaleDateString()}`,
      14,
      72
    );

    // Customer
    doc.text("Bill To:", 14, 85);
    doc.text(`${profile?.firstName} ${profile?.lastName}`, 14, 92);
    doc.text(`${profile?.email}`, 14, 99);

    // ✅ Multi-line Shipping Address (FIXED)
    doc.text("Shipping Address:", 14, 106);
    const addressLines = formatAddress(order.shippingAddress);
    doc.text(addressLines, 14, 113);

    // Table
    const rows = order.items.map((item, i) => [
      i + 1,
      item.productName,
      item.quantity,
      `Rs.
${item.unitPrice}`,
      `Rs.
${item.unitPrice * item.quantity}`,
    ]);

    autoTable(doc, {
      startY: 140,
      head: [["#", "Product", "Qty", "Unit Price", "Total"]],
      body: rows,
      theme: "grid",
      headStyles: { fillColor: [34, 139, 34] },
    });

    const y = (doc as any).lastAutoTable.finalY + 10;

    doc.text(
      `Grand Total: Rs.
${order.totalAmount}`,
      150,
      y,
      { align: "right" }
    );

    doc.text(
      "Thank you for shopping with GoMunchZ!",
      105,
      y + 20,
      { align: "center" }
    );

    doc.save(`Invoice-${order.orderId}.pdf`);
  };
  if (loading) {
    return (
      <div className="bg-[#f6fff4] min-h-screen">
        <PageSpinner />
      </div>
    );
  }


  return (
   <div className="bg-[#f9fdf7] min-h-screen py-10 md:py-20">

      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* USER PROFILE HEADER */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-green-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-lg">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#ecfdf5] rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
               <User size={32} />
            </div>
            <div>
              <p className="font-black text-xl text-gray-900 tracking-tighter uppercase italic leading-none">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                <Mail size={12} className="text-green-500" /> {profile?.email}
              </p>
            </div>
          </div>

          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <button
              onClick={() => setGridView(true)}
              className={`p-3 rounded-xl transition-all ${gridView ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-green-600"}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`p-3 rounded-xl transition-all ${!gridView ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-green-600 transition-all"}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* TIME FILTERS */}
        <div className="flex flex-wrap gap-2.5">
          {[
            { label: "All Orders", value: "ALL" },
            { label: "Today", value: 1 },
            { label: "Last 7 Days", value: 7 },
            { label: "Last 30 Days", value: 30 },
          ].map((f) => {
            const isActive = filterDays === f.value;
            return (
              <button
                key={f.label}
                onClick={() => setFilterDays(f.value as any)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isActive
                    ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-100"
                    : "bg-white text-gray-400 border-gray-100 hover:border-green-200"
                  }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* ORDERS GRID/LIST */}
        <div className={gridView ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-8"}>
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-[#ecfdf5]/40 rounded-[2.5rem] border border-green-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group"
            >
              {/* ORDER HEADER */}
              <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-green-50">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {new Date(order.placedAt).toLocaleDateString()}
                </span>
                <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest
                  ${order.orderStatus === "DELIVERED"
                    ? "bg-green-100 text-green-700"
                    : order.orderStatus === "PENDING"
                    ? "bg-amber-100 text-amber-700"
                    : order.orderStatus === "PAID"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                  }`}>
                  {order.orderStatus}
                </span>
              </div>

              {/* ITEMS LIST */}
              <div className="p-6 pb-2 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white/60 p-3 rounded-2xl border border-white hover:border-green-100 transition-all">
                    <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                       <img
                        src={productImages[item.productId] || "/placeholder.png"}
                        className="w-full h-full object-contain p-2"
                        alt={item.productName}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{item.productName}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">₹{item.unitPrice} × {item.quantity}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                       <button
                        onClick={() => navigate(`/product/${item.productId}`)}
                        className="p-1.5 bg-green-600 text-white rounded-lg text-[8px] font-black uppercase shadow-sm hover:bg-green-700 transition-all active:scale-95"
                      >
                        Reorder
                      </button>

                      {reviewedItems.has(`${order.orderId}:${item.productId}`) ? (
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase text-center border border-emerald-100">Reviewed</div>
                      ) : (
                        <button
                          onClick={() => { setSelectedOrder(order); setReviewItem(item); }}
                          className="p-1.5 bg-white border border-green-600 text-green-600 rounded-lg text-[8px] font-black uppercase hover:bg-green-50 transition-all active:scale-95"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER ACTION AREA */}
              <div className="p-6 pt-0 mt-4 flex justify-between items-center border-t border-green-50/50 bg-white/30 backdrop-blur-sm">
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                  <p className="text-xl font-black text-gray-900 tracking-tighter italic">₹{order.totalAmount}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-10 h-10 flex items-center justify-center bg-white text-green-600 rounded-xl border border-green-50 shadow-sm hover:shadow-md transition-all active:scale-90"
                    title="View Order Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="px-5 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-black transition-all active:scale-95"
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
       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
  <div className="relative bg-white w-full max-w-lg sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh] animate-slideUp">


            {/* Close */}
     <button
  onClick={() => setSelectedOrder(null)}
  className="
    absolute top-4 right-4
    w-9 h-9
    flex items-center justify-center
    rounded-full
    bg-green-400 hover:bg-red-600
    text-white hover:text-white
    transition
    shadow-sm
  "
>
    <FaTimes size={14} />
</button>


            <h2 className="text-xl font-semibold mb-4">Order Details</h2>

            <div className="text-sm space-y-2">
              <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.placedAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
              {(selectedOrder as any).shiprocketOrderId && (
                <p>
                  <strong>Tracking:</strong>{" "}
                  <button 
                    onClick={() => navigate(`/track/${(selectedOrder as any).shiprocketShipmentId}`)} 
                    className="text-green-700 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Track Shipment 🚚
                  </button>
                </p>
              )}
            </div>

            {/* Address */}
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Shipping Address</h3>
              {formatAddress(selectedOrder.shippingAddress).map((line, i) => (
                <p key={i} className="text-sm">{line}</p>
              ))}
            </div>

            {/* Items */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Items</h3>

              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b py-3 items-center">
              <img
  src={productImages[item.productId] || "/placeholder.png"}
  className="w-14 h-14 sm:w-16 sm:h-16 object-contain border rounded-lg cursor-pointer"
  onClick={() => navigate(`/product/${item.productId}`)}
/>

                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      Rs. {item.unitPrice} × {item.quantity}
                    </p>
                  </div>

                  <button
                    onClick={() => setReviewItem(item)}
                    className="px-3 py-1 bg-green-700 text-white rounded text-sm"
                  >
                    Write Review
                  </button>
                </div>
              ))}

            </div>

            <div className="mt-6 text-right font-semibold text-lg">
              Total: Rs.
              {selectedOrder.totalAmount}
            </div>
          </div>
        </div>
      )}

      {reviewItem && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6 animate-slideUp border border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Review Product</h3>
              <button onClick={() => setReviewItem(null)} className="text-gray-400 hover:text-gray-600 transition">
                <FaTimes size={18} />
              </button>
            </div>
            
            <div className="flex gap-4 items-center p-3 bg-gray-50 rounded-xl">
               <img
                src={productImages[reviewItem.productId] || "/placeholder.png"}
                className="w-12 h-12 object-contain bg-white rounded-lg border"
              />
              <p className="font-semibold text-gray-700 truncate">{reviewItem.productName}</p>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex gap-1">
                Rating <Star size={12} className="text-red-500 fill-red-500 mt-0.5" />
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`transition-all duration-200 transform hover:scale-110 ${rating >= r ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                      }`}
                  >
                    <Star size={32} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Your Experience <span className="text-red-500">*</span></label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this product?"
                rows={3}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex justify-between">
                <span>Add Photo</span>
                <span className="text-gray-400 font-normal text-xs italic">Optional</span>
              </label>
              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition group">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-5 h-5 text-gray-400 mb-1 group-hover:text-green-500 transition" />
                    <p className="text-xs text-gray-500">Tap to upload</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const f = e.target.files[0];
                        const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
                        if (f.size > MAX_SIZE) {
                           alert("File size exceeds 5MB limit. Please upload a smaller image.");
                           return;
                        }
                        setFile(f);
                        setPreview(URL.createObjectURL(f));
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border">
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition backdrop-blur-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setReviewItem(null)}
                className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                disabled={submitting || !comment}
                onClick={async () => {
                  try {
                    setSubmitting(true);
                    const token = localStorage.getItem("token")!;
                    const payload: any = JSON.parse(atob(token.split(".")[1]));
                    const formData = new FormData();
                    const reviewJson = {
                      orderId: selectedOrder.orderId,
                      productId: reviewItem.productId,
                      productName: reviewItem.productName,
                      userId: payload.sub,
                      userName: payload.name,
                      rating,
                      comment,
                    };
                    formData.append("request", JSON.stringify(reviewJson));
                    if (file) formData.append("file", file);

                    await axios.post("/reviews/form", formData);

                    alert("Review submitted!");
                    const key = `${selectedOrder.orderId}:${reviewItem.productId}`;
                    setReviewedItems(prev => new Set(prev).add(key));
                    setReviewItem(null);
                    setComment("");
                    setRating(5);
                    setFile(null);
                    setPreview(null);
                  } catch (e: any) {
                    alert(e.response?.data?.message || "Error submitting review");
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="flex-[2] py-3 bg-green-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-800 transition shadow-lg shadow-green-200"
              >
                {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
