import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useCart } from "../state/CartContext";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { FiShoppingCart } from "react-icons/fi";
import { useSEO } from "../hooks/useSEO";


/* =========================
   TYPES
========================= */
interface Variant {
  id?: number;
  weightLabel: string;
  weightInGrams: number;
  mrp: number;
  offerPrice: number;
}

interface Product {
  id: number;
  categoryId: number;
  name: string;
  imageUrl: string;
  imageUrls: string[];
  description: string;
  variants: Variant[];
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  createdAt: string;
}

function useProductReviews(productId: number) {
  return useQuery({
    queryKey: ["product-reviews", productId],
    enabled: !!productId,
    queryFn: async () => {
      const res = await axios.get(
        `/reviews/product/${productId}`
      );
      return res.data as Review[];
    },
  });
}




/* =========================
   FETCH PRODUCT BY ID
========================= */
function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data as Product;
    },
  });
}


/* =========================
   FETCH RELATED PRODUCTS
========================= */
function useRelatedProducts(currentId: number, categoryId?: number) {
  return useQuery({
    queryKey: ["related-products", currentId, categoryId],
    enabled: !!currentId && !!categoryId,
    queryFn: async () => {
      const res = await api.get(`/products/category/${categoryId}`);
      return (res.data as Product[]).filter(p => p.id !== currentId);
    },
  });
}

function ProductReviewStats({ productId }: { productId: number }) {
  const { data: reviews = [] } = useQuery({
    queryKey: ["product-reviews", productId],
    enabled: !!productId,
    queryFn: async () => {
      const res = await axios.get(
        `/reviews/product/${productId}`
      );
      return res.data as { rating: number }[];
    },
  });

  const total = reviews.length;

  const avg =
    total > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / total
      : 0;

  const renderStars = (rating: number) =>
    [1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={
          s <= Math.round(rating)
            ? "text-yellow-500"
            : "text-gray-300"
        }
      >
        ★
      </span>
    ));

  return (
    <div className="flex items-center text-sm mt-1">
      <div className="flex">{renderStars(avg)}</div>
      <span className="text-gray-600 text-xs ml-2">
        {avg.toFixed(1)} ({total} reviews)
      </span>
    </div>
  );
}

/* =========================
   COMPONENT
========================= */
export default function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id?.split("-")[0]);
  const navigate = useNavigate();
  const { data: reviews } = useProductReviews(productId);
  const [cartClicked, setCartClicked] =
    useState<{ [key: number]: boolean }>({});
  const totalReviews = reviews?.length || 0;

  const averageRating =
    totalReviews > 0
      ? reviews!.reduce((s, r) => s + r.rating, 0) / totalReviews
      : 0;

  const renderStars = (rating: number) =>
    [1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={
          s <= Math.round(rating)
            ? "text-yellow-500"
            : "text-gray-300"
        }
      >
        ★
      </span>
    ));


  // ===== RELATED PRODUCTS STATE (same as FeaturedProducts) =====
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [variantMap, setVariantMap] = useState<Record<number, number>>({});

  const incQty = (id: number) =>
    setQtyMap((p) => ({ ...p, [id]: (p[id] || 1) + 1 }));

  const decQty = (id: number) =>
    setQtyMap((p) => ({ ...p, [id]: Math.max(1, (p[id] || 1) - 1) }));


  const { data: product, isLoading, isError } = useProduct(productId);

  useSEO({
    title: product?.name || "Product Details",
    description: product?.description || "Quality product from GoMunchZ",
  });
  const { data: relatedProducts } = useRelatedProducts(productId, product?.categoryId);

  const { addToCart, items: cartItems } = useCart();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  // REVIEWS VIEW MORE STATE
  const [visibleReviews, setVisibleReviews] = useState(5);

  const handleViewMoreReviews = () => {
    setVisibleReviews((prev) => prev + 5);
  };

  // Zoom state
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(null);
    setQty(1);
  }, [productId]);

  if (isLoading) {
    return <div className="p-10 text-lg text-center">Loading product...</div>;
  }

  if (isError || !product) {
    return (
      <div className="p-10 text-red-600 text-center">
        Failed to load product.
      </div>
    );
  }

  /* =========================
     IMAGE + VARIANT LOGIC
  ========================= */
  const images = Array.from(new Set([
    product.imageUrl,
    ...(product.imageUrls || [])
  ])).filter(Boolean);





  const base100g = product.variants.find(
    (v) => v.weightInGrams === 100
  );

  const variants = product.variants.filter(
    (v) => v.weightInGrams !== 100
  );

  const selectedVariant =
    variants[selectedVariantIndex] || base100g;










  const discount =
    selectedVariant && selectedVariant.mrp > selectedVariant.offerPrice
      ? Math.round(
        ((selectedVariant.mrp - selectedVariant.offerPrice) /
          selectedVariant.mrp) *
        100
      )
      : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <TopHeader />
      <Header />

      <main className="flex-grow bg-[#f9fdf7]">
        <div className="py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4">

            {/* BACK BUTTON */}


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

              {/* ================= LEFT: IMAGES ================= */}
              <div className="flex flex-col gap-6">
                <div
                  className="relative w-full aspect-square bg-white rounded-[2rem] border border-green-50 shadow-sm flex items-center justify-center overflow-hidden cursor-crosshair group/main"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setZoomPos({ x, y });
                  }}
                >
                  <img
                    src={selectedImage || images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover/main:scale-105"
                  />
                  {isHovering && (
                    <div
                      className="absolute inset-0 z-50 pointer-events-none hidden lg:block"
                      style={{
                        backgroundImage: `url(${selectedImage || images[0]})`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundSize: "250%",
                      }}
                    />
                  )}
                </div>

                {/* THUMBNAILS */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all p-1.5 flex-shrink-0 ${selectedImage === img || (!selectedImage && i === 0)
                        ? "border-green-600 bg-green-50"
                        : "border-gray-100 bg-white hover:border-green-200"
                        }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-contain rounded-xl" />
                    </button>
                  ))}
                </div>
              </div>

              {/* ================= RIGHT: INFO ================= */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                      <div className="flex text-yellow-500 mr-2">{renderStars(averageRating)}</div>
                      <span className="text-sm font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-400 font-bold text-sm tracking-tight">
                      {totalReviews} Verified Reviews
                    </span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="bg-white border border-green-50 rounded-2xl p-6 mb-8 shadow-sm">
                  <p className="text-[13px] font-bold text-green-700 uppercase tracking-widest mb-3">
                    Key Highlights
                  </p>
                  <ul className="space-y-2.5">
                    {product.description?.split(".").filter(Boolean).map((line, i) => (
                      <li key={i} className="flex gap-3 text-gray-600 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></span>
                        {line.trim()}.
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PRICE */}
                <div className="mb-10">
                  <div className="flex items-baseline gap-4 mb-1">
                    {discount > 0 && (
                      <span className="text-3xl font-light text-red-500">-{discount}%</span>
                    )}
                    <div className="flex items-start">
                      <span className="text-xl font-bold mt-2 mr-0.5">₹</span>
                      <span className="text-5xl font-black text-gray-900 tracking-tighter">
                        {selectedVariant.offerPrice}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ml-1">
                    {base100g && (
                      <span className="text-gray-500 font-bold text-sm">
                        (₹{base100g.offerPrice} / 100 g)
                      </span>
                    )}
                    <div className="text-gray-400 text-sm font-medium">
                      M.R.P.: <span className="line-through">₹{selectedVariant.mrp}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">Inclusive of all taxes</div>
                  </div>
                </div>

                {/* VARIANT SELECTOR */}
                <div className="mb-8">
                  <p className="text-[13px] font-bold text-gray-900 mb-4 ml-1">Select Quantity (Pack Size)</p>
                  <div className="flex gap-3 flex-wrap">
                    {variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariantIndex(i)}
                        className={`px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${selectedVariantIndex === i
                          ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                          : "border-gray-100 bg-white text-gray-500 hover:border-green-200"
                          }`}
                      >
                        {v.weightLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QTY & ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch mb-10">
                  <div className="flex items-center bg-white rounded-2xl border border-gray-100 p-1.5 shadow-sm min-w-[140px] h-14">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all font-bold text-2xl">−</button>
                    <span className="flex-1 text-center font-black text-lg text-gray-900">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all font-bold text-2xl">+</button>
                  </div>
                  <div className="flex-1 flex gap-3">
                    <button onClick={() => addToCart({ productId: product.id, name: product.name, imageUrl: product.imageUrl, variants, selectedVariantIndex, base100gPrice: base100g?.offerPrice, qty })} className="flex-grow bg-green-600 text-white rounded-2xl font-black text-[15px] uppercase tracking-wider hover:bg-green-700 transition shadow-lg active:scale-95">Add to cart</button>
                    <button onClick={() => { addToCart({ productId: product.id, name: product.name, imageUrl: product.imageUrl, variants, selectedVariantIndex, base100gPrice: base100g?.offerPrice, qty }); navigate("/cart"); }} className="flex-grow bg-green-600 text-white rounded-2xl font-black text-[15px] uppercase tracking-wider hover:bg-green-700 transition shadow-lg active:scale-95">Buy now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Customer <span className="text-green-600">Reviews</span>
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-lg">
              What our verified buyers say about this product
            </p>
            <div className="w-16 h-[3px] bg-green-600 mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews?.slice(0, visibleReviews).map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 border-b-2 border-b-green-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-bold text-gray-900">{review.userName}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-yellow-500 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>
                {review.imageUrl && (
                  <img src={review.imageUrl} alt="review" className="w-24 h-24 object-cover rounded-xl border border-gray-100 hover:scale-105 transition" />
                )}
              </div>
            ))}
          </div>
          {reviews && visibleReviews < reviews.length && (
            <div className="flex justify-center mt-12">
              <button onClick={handleViewMoreReviews} className="px-10 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition shadow-md">View More Reviews</button>
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        <div className="max-w-7xl mx-auto px-4 py-16 mb-10">
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Related <span className="text-green-600">Products</span>
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-lg">
              You might also like these handpicked selections
            </p>
            <div className="w-16 h-[3px] bg-green-600 mt-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts?.slice(0, 8).map((p) => {
              const base100g = p.variants.find((v) => v.weightInGrams === 100);
              const sellVariants = p.variants.filter((v) => v.weightInGrams !== 100);
              const selectedVariantIndex = variantMap[p.id] ?? 0;
              const selectedVariant = sellVariants[selectedVariantIndex];
              const qty = qtyMap[p.id] || 1;
              if (!selectedVariant) return null;
              const relDiscount = selectedVariant.mrp > selectedVariant.offerPrice ? Math.round(((selectedVariant.mrp - selectedVariant.offerPrice) / selectedVariant.mrp) * 100) : 0;

              const isInCart = cartItems.some(item =>
                item.productId === p.id &&
                item.selectedVariantIndex === selectedVariantIndex
              );

              return (
                <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="group bg-[#ecfdf5] rounded-3xl shadow-sm hover:shadow-xl border border-green-100 overflow-hidden cursor-pointer transition-all duration-500 flex flex-col hover:-translate-y-2">

                  <div className="relative bg-white aspect-square flex items-center justify-center m-1.5 rounded-2xl overflow-hidden shadow-inner border border-green-50 flex-shrink-0">
                    <img src={(p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls[0] : p.imageUrl} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                    {relDiscount > 0 && (
                      <div className="absolute top-2.5 right-2.5 bg-green-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-lg">{relDiscount}% OFF</div>
                    )}
                  </div>

                  {/* CONTENT AREA */}
                  <div className="px-4 pb-4 pt-1 flex flex-col flex-grow">
                    <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">{p.name}</h3>
                    <ProductReviewStats productId={p.id} />

                    <div className="mt-2 flex-grow flex flex-col justify-end">
                      {/* PRICE & WEIGHT */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex flex-col">
                          <span className="text-lg font-medium text-gray-900 tracking-tight">₹{selectedVariant.offerPrice * qty}</span>
                          {base100g && (
                            <span className="text-[9px] text-gray-500 font-medium tracking-tight">(₹{base100g.offerPrice}/100g)</span>
                          )}
                        </div>
                        <span className="px-2.5 py-1 bg-white border border-green-200 text-green-700 text-[10px] font-bold rounded-full shadow-sm uppercase tracking-wider">{selectedVariant.weightLabel}</span>
                      </div>

                      {/* ACTION ROW */}
                      <div className="flex items-center gap-1.5 mt-3.5" onClick={(e) => e.stopPropagation()}>
                        {/* QTY BOX */}
                        <div className="flex items-center bg-white rounded-xl border border-green-200 p-1 shadow-sm h-9">
                          <button onClick={() => setQtyMap(pvs => ({ ...pvs, [p.id]: Math.max(1, (pvs[p.id] || 1) - 1) }))} className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-l-lg transition-all font-bold text-base">-</button>
                          <span className="w-5 text-center text-[13px] font-bold text-gray-900">{qty}</span>
                          <button onClick={() => setQtyMap(pvs => ({ ...pvs, [p.id]: (pvs[p.id] || 1) + 1 }))} className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-r-lg transition-all font-bold text-base">+</button>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart({ productId: p.id, name: p.name, imageUrl: p.imageUrl, variants: sellVariants, selectedVariantIndex, base100gPrice: base100g?.offerPrice, qty });
                          }}
                          className={`flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl font-bold text-[12px] transition-all active:scale-95 shadow-md ${isInCart ? "bg-green-100 text-green-700 border-2 border-green-200" : "bg-green-600 text-white hover:bg-green-700 hover:shadow-xl"
                            }`}
                        >
                          <FiShoppingCart size={14} />
                          {isInCart ? "ADDED" : "ADD TO CART"}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

