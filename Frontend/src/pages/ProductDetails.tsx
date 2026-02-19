import React, { useState } from "react";
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
        `http://localhost:9095/reviews/product/${productId}`
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
function useRelatedProducts(currentId: number) {
  return useQuery({
    queryKey: ["related-products", currentId],
    enabled: !!currentId,
    queryFn: async () => {
      const res = await api.get("/products");
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
        `http://localhost:9095/reviews/product/${productId}`
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
  const productId = Number(id);
  const navigate = useNavigate();
const { data: reviews } = useProductReviews(productId);

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
  const { data: relatedProducts } = useRelatedProducts(productId);

  const { addToCart } = useCart();

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
  const images =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : [product.imageUrl];

     



  const base100g = product.variants.find(
    (v) => v.weightInGrams === 100
  );

  const variants = product.variants.filter(
    (v) => v.weightInGrams !== 100
  );

  const selectedVariant =
    variants[selectedVariantIndex] || base100g;










  return (
    <section>
      <TopHeader />
      <Header />




      <div className="bg-[#f6fff4]  py-10 ">

    <button
  onClick={() => navigate(-1)}
  className="
    mt-0 mb-8 ml-[136px]
    w-10 h-10
    flex items-center justify-center
    rounded-full
    bg-white
    shadow-md
    border border-green-100
    text-green-700
    hover:bg-green-50
    hover:shadow-lg
    active:scale-95
    transition-all duration-200
  "
>
  <ArrowLeft size={20} />
</button>



        <div className="max-w-7xl  mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ================= LEFT IMAGE (AMAZON OVERLAY ZOOM) ================= */}
          <div className="relative">

            {/* MAIN IMAGE */}
            <div
              className="w-[380px] h-[380px] bg-[#eaffea] rounded-xl flex items-center justify-center cursor-crosshair"
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
                className="w-full h-full object-contain"
              />
            </div>

            {/* ZOOM OVERLAY (OVER PRICE SECTION) */}
            {isHovering && (
              <div
                className="
                absolute top-0 left-[420px]
                w-[520px] h-[520px]
                bg-white border rounded-xl shadow-xl
                z-50 hidden lg:block
              "
              >
                <div
                  className="w-full h-full bg-no-repeat"
                  style={{
                    backgroundImage: `url(${selectedImage || images[0]})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: "200%",
                  }}
                />
              </div>
            )}

            {/* THUMBNAILS */}
            <div className="flex gap-4 mt-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${selectedImage === img ? "border-green-700" : ""
                    }`}
                  alt="thumb"
                />
              ))}
            </div>
          </div>

          {/* ================= RIGHT DETAILS ================= */}
          <div>
            {/* Variant badge */}
            {selectedVariant && (
              <span className="inline-block bg-green-700 text-white text-xs px-3 py-1 rounded mb-3">
                {selectedVariant.weightLabel}
              </span>
            )}

            {/* Product name */}
            <h1 className="text-2xl font-semibold mb-2">
              {product.name}
            </h1>
            <div className="flex items-center text-sm mt-2">
  <div className="flex">{renderStars(averageRating)}</div>
  <span className="text-gray-600 text-xs ml-2">
    {averageRating.toFixed(1)} ({totalReviews} reviews)
  </span>
</div>


            {/* PRICE (MAIN + 100G) */}
            {selectedVariant && (
              <div className="flex items-center flex-wrap gap-3 mt-3">
                <span className="text-2xl font-bold text-green-700">
                  ₹{selectedVariant.offerPrice}
                </span>

                <span className="text-gray-500 line-through">
                  ₹{selectedVariant.mrp}
                </span>

                {base100g && (
                  <span className="text-sm text-gray-600">
                    (₹{base100g.offerPrice} / 100 g)
                  </span>
                )}
              </div>
            )}

            {/* QUANTITY */}
            <div className="mt-5">
              <p className="text-sm mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="border px-3 py-1 rounded cursor-pointer"
                >
                  −
                </button>

                <span>{qty}</span>

                <button
                  onClick={() => setQty(qty + 1)}
                  className="border px-3 py-1 rounded cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* VARIANT SELECTOR */}
            <div className="mt-5 flex gap-3 flex-wrap">
              {variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedVariantIndex(i)}
                  className={`px-4 py-1 rounded border cursor-pointer ${selectedVariantIndex === i
                      ? "bg-green-700 text-white"
                      : ""
                    }`}
                >
                  {v.weightLabel}
                </button>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() =>
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,

                    variants, // 👈 ALL VARIANTS
                    selectedVariantIndex,

                    base100gPrice: base100g?.offerPrice,
                    qty
                  })

                }
                className="flex-1 bg-green-700 text-white py-2 rounded hover:bg-green-800 cursor-pointer"
              >
                Add to carts
              </button>

             <button
  onClick={() => {
    addToCart({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      variants,                 // all sell variants
      selectedVariantIndex,     // current selected
      base100gPrice: base100g?.offerPrice,
      qty,
    });

    navigate("/cart");
  }}
  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
>
  Buy now
</button>

            </div>

            {/* DESCRIPTION */}
            <div className="mt-8 border rounded-lg p-4 text-sm text-gray-700">
              <ul className="list-disc pl-4 space-y-2">
                {product.description
                  ?.split(".")
                  .filter(Boolean)
                  .map((line, i) => (
                    <li key={i}>{line.trim()}.</li>
                  ))}
              </ul>
            </div>



            
          </div>
        </div>
      </div>

{/* ================= REVIEWS SECTION ================= */}

{/* ================= REVIEWS SECTION ================= */}
<div className="max-w-7xl mx-auto px-6 mt-8">
  <h2 className="text-2xl font-semibold mb-10">
    Customer Reviews ({reviews?.length || 0})
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {reviews?.slice(0, visibleReviews).map((review) => (
      <div
        key={review.id}
        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-semibold text-gray-800">
              {review.userName}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-yellow-500 text-sm">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>
        </div>

        {/* COMMENT */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {review.comment}
        </p>

        {/* CUSTOMER IMAGE */}
        {review.imageUrl && (
          <div className="flex gap-3 flex-wrap">
            <img
              src={review.imageUrl}
              alt="review"
              className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
            />
          </div>
        )}
      </div>
    ))}
  </div>

  {/* VIEW MORE */}
  {reviews && visibleReviews < reviews.length && (
    <div className="flex justify-center mt-12">
      <button
        onClick={handleViewMoreReviews}
        className="px-10 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition"
      >
        View More Reviews
      </button>
    </div>
  )}
</div>


      {/* ================= RELATED PRODUCTS ================= */}
     <div className="max-w-7xl mx-auto px-6 mt-12 mb-10">
  <h2 className="text-2xl font-semibold mb-8">Related Products</h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
    {relatedProducts?.slice(0, 8).map((p) => {
      const base100g = p.variants.find((v) => v.weightInGrams === 100);
      const sellVariants = p.variants.filter(
        (v) => v.weightInGrams !== 100
      );

      const selectedVariantIndex = variantMap[p.id] ?? 0;
      const selectedVariant = sellVariants[selectedVariantIndex];
      const qty = qtyMap[p.id] || 1;

      if (!selectedVariant) return null;

      const discount =
        selectedVariant.mrp > selectedVariant.offerPrice
          ? Math.round(
              ((selectedVariant.mrp - selectedVariant.offerPrice) /
                selectedVariant.mrp) *
                100
            )
          : 0;

      return (
        <div
          key={p.id}
          onClick={() => navigate(`/product/${p.id}`)}
          className="bg-[#eaffea] rounded-xl shadow hover:shadow-lg transition p-4 relative cursor-pointer flex flex-col"
        >
          {/* SAVE BADGE */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
              Save {discount}%
            </span>
          )}

          {/* IMAGE */}
          <img
            src={p.imageUrl}
            alt={p.name}
            className="w-full h-44 object-contain mb-4"
          />

          {/* WEIGHT */}
          <span className="inline-block bg-green-700 text-white w-12 text-xs px-2 py-1 rounded mb-2">
            {selectedVariant.weightLabel}
          </span>

          {/* NAME */}
          <h3
            className="
              font-semibold
              text-sm md:text-base lg:text-lg
              leading-tight
              line-clamp-1 md:line-clamp-2
              min-h-[20px] md:min-h-[40px]
            "
          >
            {p.name}
          </h3>

          {/* REVIEWS */}
          <ProductReviewStats productId={p.id} />

          {/* PRICE */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-lg">
              ₹{selectedVariant.offerPrice * qty}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ₹{selectedVariant.mrp * qty}
            </span>
            {base100g && (
              <span className="text-sm text-gray-700">
                (₹{base100g.offerPrice} / 100 g)
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mt-1 overflow-hidden h-[22px] md:h-[36px] lg:h-[40px]">
            <p className="text-gray-600 text-xs md:text-sm leading-tight line-clamp-1 md:line-clamp-2">
              {p.description}
            </p>
          </div>

          {/* VARIANTS */}
          <div
            className="grid grid-cols-3 gap-1 mt-2 md:mt-3"
            onClick={(e) => e.stopPropagation()}
          >
            {sellVariants.map((v, i) => (
              <button
                key={i}
                onClick={() =>
                  setVariantMap((prev) => ({
                    ...prev,
                    [p.id]: i,
                  }))
                }
                className={`
                  border rounded
                  text-[10px] px-1 py-1 leading-none
                  md:text-xs md:px-2 md:py-1.5
                  ${
                    selectedVariantIndex === i
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white"
                  }
                `}
              >
                {v.weightLabel}
              </button>
            ))}
          </div>

          {/* QTY */}
          <div
            className="flex items-center gap-2 mt-2 md:mt-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => decQty(p.id)}
              className="border px-3 rounded"
            >
              −
            </button>
            <span>{qty}</span>
            <button
              onClick={() => incQty(p.id)}
              className="border px-3 rounded"
            >
              +
            </button>
          </div>

          {/* ADD TO CART */}
          <div className="mt-auto pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart({
                  productId: p.id,
                  name: p.name,
                  imageUrl: p.imageUrl,
                  variants: sellVariants,
                  selectedVariantIndex,
                  base100gPrice: base100g?.offerPrice,
                  qty,
                });
              }}
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
            >
              Add to cart
            </button>
          </div>
        </div>
      );
    })}
  </div>
</div>


      <Footer />
    </section>
  );
}