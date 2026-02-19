import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, User, LayoutGrid, List, Eye } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaTimes } from "react-icons/fa";


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
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
  </div>
);



export default function UserOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);


  const [reviewItem, setReviewItem] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
 
  const [submitting, setSubmitting] = useState(false);
const [file, setFile] = useState<File | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState<number | "ALL">("ALL");
  const [gridView, setGridView] = useState(true);

  const { profile } = useAuth();
  const navigate = useNavigate();

  /* ================= FETCH ================= */
  useEffect(() => {
    axios
      .get("http://localhost:9090/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setOrders(res.data.content || []))
      .finally(() => setLoading(false));
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
    doc.text("Munchz Foods Pvt Ltd", 150, 15, { align: "right" });
    doc.text("Hyderabad, India", 150, 22, { align: "right" });
    doc.text("support@munchz.com", 150, 29, { align: "right" });

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
      "Thank you for shopping with Munchz!",
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
   <div className="bg-[#f6fff4] min-h-screen py-12">

      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* USER SUMMARY */}
        <div className="bg-white shadow rounded-xl p-6 flex flex-col md:flex-row md:justify-between gap-6">
          <div>
            <p className="font-semibold flex gap-2 items-center">
              <User size={16} />
              {profile?.firstName} {profile?.lastName}
            </p>
            <p className="text-sm text-gray-600 flex gap-2 items-center">
              <Mail size={14} />
              {profile?.email}
            </p>
          </div>

          <div className="flex gap-3 items-center ">
            <button
              onClick={() => setGridView(true)}
              className={`p-2 rounded ${gridView ? "bg-green-700 text-white cursor-pointer" : "bg-gray-100 cursor-pointer"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`p-2 rounded ${!gridView ? "bg-green-700 text-white cursor-pointer" : "bg-gray-100 cursor-pointer"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-3 ">
          {[
            { label: "All", value: "ALL" },
            { label: "Today", value: 1 },
            { label: "Last 7 days", value: 7 },
            { label: "Last 30 days", value: 30 },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => setFilterDays(f.value as any)}
              className={`px-4 py-1.5 rounded-full border text-sm cursor-pointer ${filterDays === f.value
                  ? "bg-green-700 text-white"
                  : "bg-white"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ORDERS */}
<div className={gridView ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>

          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
           className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100 p-6 space-y-5"

            >
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {new Date(order.placedAt).toLocaleDateString()}
                </span>
               <span className={`px-3 py-1 rounded-full text-xs font-medium
  ${
    order.orderStatus === "DELIVERED"
      ? "bg-green-100 text-green-700"
      : order.orderStatus === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700"
  }`}>
  {order.orderStatus}
</span>

              </div>

              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 items-center border-b pb-3"
                >
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    className="w-16 h-16 object-contain border rounded"
                    
                      onClick={() => navigate(`/product/${item.productId}`)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold" 
                      onClick={() => navigate(`/product/${item.productId}`)}>{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      Rs. {item.unitPrice} × {item.quantity}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/product/${item.productId}`)}
                      className="px-3 py-1 bg-green-700 text-white rounded text-sm"
                    >
                      Reorder
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setReviewItem(item);
                      }}
                      className="px-3 py-1 border border-green-700 text-green-700 rounded text-sm"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}


              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  Total: Rs.
                  {order.totalAmount}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 bg-white  rounded hover:bg-green-50 transition cursor-pointer"
                    title="View Order"
                  >
                    <Eye size={18} className="text-green-700" />
                  </button>


                  <button
                    onClick={() => downloadInvoice(order)}
                    className="px-4 py-2 bg-gray-800 text-white rounded text-sm cursor-pointer"
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
  <div className="relative bg-white w-full md:max-w-2xl rounded-t-2xl md:rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh] animate-slideUp">


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
                    src={item.imageUrl || "/placeholder.png"}
                    className="w-16 h-16 object-contain border rounded"
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
      )}{reviewItem && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 animate-slideUp">

            <h3 className="text-lg font-semibold">Review {reviewItem.productName}</h3>

            {/* Rating */}
        <div className="flex gap-2 text-2xl">
  {[1,2,3,4,5].map((r) => (
    <button
      key={r}
      onClick={() => setRating(r)}
      className={rating >= r ? "text-yellow-500" : "text-gray-300"}
    >
      ★
    </button>
  ))}
</div>


            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded p-2 text-sm"
            />

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }}
/>




            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReviewItem(null)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

         <button
  disabled={submitting}
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

      if (file) {
        formData.append("file", file);
      }

      await axios.post(
        "http://localhost:9095/reviews/form",
        formData
      );

      alert("Review submitted!");
      setReviewItem(null);
      setComment("");
      setRating(5);
      setFile(null);
    } catch (e: any) {
      alert(e.response?.data?.message || "Already reviewed");
    } finally {
      setSubmitting(false);
    }
  }}
  className="px-5 py-2 bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
>
  {submitting && (
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  )}
  {submitting ? "Submitting..." : "Submit Review"}
</button>

            </div>
          </div>
        </div>
      )}


    </div>
  );
}