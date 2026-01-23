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


function useAllProducts() {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await api.get("/product/api/products");
      return res.data as Product[];
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
      const res = await api.get(`/product/api/products/${id}`);
      return res.data as Product;
    },
  });
}

/* =========================
   COMPONENT
========================= */
// SAME IMPORTS & LOGIC ABOVE — UNCHANGED

export default function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(productId);
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);

  // REQUIRED HOOKS (must be here)
const { data: allProducts = [] } = useAllProducts();
const [showMobileZoom, setShowMobileZoom] = useState(false);
const [relQtyMap, setRelQtyMap] = useState<Record<number, number>>({});
const [relVariantMap, setRelVariantMap] = useState<Record<number, number>>({});




  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  if (isLoading) return <div className="p-10 text-lg text-center">Loading product...</div>;
  if (isError || !product) return <div className="p-10 text-red-600 text-center">Failed to load product.</div>;

  const images =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : [product.imageUrl];

  const base100g = product.variants.find((v) => v.weightInGrams === 100);
  const variants = product.variants.filter((v) => v.weightInGrams !== 100);
  const selectedVariant = variants[selectedVariantIndex] || base100g;

const relatedProducts = allProducts
  .filter((p: any) => p.id !== product.id)
  .slice(0, 4);


const incRelQty = (id: number) =>
  setRelQtyMap((p) => ({ ...p, [id]: (p[id] || 1) + 1 }));

const decRelQty = (id: number) =>
  setRelQtyMap((p) => ({ ...p, [id]: Math.max(1, (p[id] || 1) - 1) }));

  return (
    <section>
      <TopHeader />
      <Header />

      <div className="bg-[#f6fff4] min-h-screen py-10">

        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow border border-green-100 text-green-700 font-medium hover:bg-green-50"
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-700 text-white">
              ←
            </span>
            Back
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* LEFT IMAGE */}
{/* LEFT IMAGE */}
<div className="relative flex flex-col items-center">

  <div className="relative w-full max-w-md">

    {/* SAVE BADGE */}
    {selectedVariant &&
      selectedVariant.mrp > selectedVariant.offerPrice && (
        <span className="absolute top-3 right-3 z-30 bg-green-700 text-white text-xs px-3 py-1 rounded shadow">
          Save{" "}
          {Math.round(
            ((selectedVariant.mrp - selectedVariant.offerPrice) /
              selectedVariant.mrp) *
              100
          )}
          %
        </span>
      )}

    {/* MAIN IMAGE */}
    <div
      className="w-full h-80 sm:h-96 bg-[#eaffea] rounded-xl flex items-center justify-center cursor-crosshair"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => setShowMobileZoom(true)}
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
  </div>


            {/* ZOOM BOX */}
            {isHovering && (
              <div className="absolute top-0 left-full ml-6 w-[450px] h-[450px] bg-white border rounded-xl shadow-xl z-50 hidden lg:block">
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

            {/* MOBILE ZOOM OVERLAY */}
{showMobileZoom && (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center lg:hidden">
    <div className="relative w-[90%] h-[70%] bg-white rounded-lg overflow-hidden">
      <img
        src={selectedImage || images[0]}
        alt="zoom"
        className="w-full h-full object-contain"
      />
      <button
        onClick={() => setShowMobileZoom(false)}
        className="absolute top-2 right-2 bg-green-700 text-white px-3 py-1 rounded"
      >
        Close
      </button>
    </div>
  </div>
)}


            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-4 flex-wrap justify-center">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded cursor-pointer border ${
                    selectedImage === img ? "border-green-700" : ""
                  }`}
                  alt="thumb"
                />
              ))}
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div>
            {selectedVariant && (
              <span className="inline-block bg-green-700 text-white text-xs px-3 py-1 rounded mb-3">
                {selectedVariant.weightLabel}
              </span>
            )}

            <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>

            {selectedVariant && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
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

            {/* QTY */}
            <div className="mt-5">
              <p className="text-sm mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="border px-3 py-1 rounded">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="border px-3 py-1 rounded">+</button>
              </div>
            </div>

            {/* VARIANTS */}
            <div className="mt-5 flex gap-3 flex-wrap">
              {variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedVariantIndex(i)}
                  className={`px-3 py-1 border rounded text-sm ${
                    selectedVariantIndex === i ? "bg-green-700 text-white" : ""
                  }`}
                >
                  {v.weightLabel}
                </button>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() =>
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    variants,
                    selectedVariantIndex,
                    base100gPrice: base100g?.offerPrice,
                    qty,
                  })
                }
                className="flex-1 bg-green-700 text-white py-2 rounded hover:bg-green-800"
              >
                Add to carts
              </button>

              <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">
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
{/* ================= RELATED PRODUCTS LIKE FEATURED ================= */}
<div className="max-w-7xl mx-auto px-4 mt-20 mb-20">
  <h2 className="text-3xl font-semibold mb-10 text-center">
    Related Products
  </h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
    {relatedProducts.map((p: any) => {
      const base100g = p.variants.find(
        (v: any) => v.weightInGrams === 100
      );
      const sellVariants = p.variants.filter(
        (v: any) => v.weightInGrams !== 100
      );

      const selectedVariantIndex = relVariantMap[p.id] ?? 0;
      const selectedVariant = sellVariants[selectedVariantIndex];
      const qty = relQtyMap[p.id] || 1;

      if (!selectedVariant) return null;

      const discount =
        selectedVariant.mrp > selectedVariant.offerPrice
          ? Math.round(
              ((selectedVariant.mrp -
                selectedVariant.offerPrice) /
                selectedVariant.mrp) *
                100
            )
          : 0;

      return (
        <div
          key={p.id}
          onClick={() => navigate(`/product/${p.id}`)}
          className="bg-[#eaffea] rounded-xl shadow hover:shadow-lg transition p-3 sm:p-4 relative cursor-pointer flex flex-col"
        >
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
              Save {discount}%
            </span>
          )}

          <img
            src={p.imageUrl}
            alt={p.name}
            className="w-full h-32 sm:h-40 object-contain mb-3"
          />

          <span className="inline-block bg-green-700 text-white text-xs px-2 py-1 rounded mb-2 w-fit">
            {selectedVariant.weightLabel}
          </span>

          <h3 className="font-semibold text-sm sm:text-base">
            {p.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-lg">
              ₹{selectedVariant.offerPrice * qty}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ₹{selectedVariant.mrp * qty}
            </span>
            {base100g && (
              <span className="text-xs text-gray-700">
                (₹{base100g.offerPrice} / 100 g)
              </span>
            )}
          </div>

          <div className="mt-1 h-[40px] overflow-hidden">
            <p className="text-sm text-gray-600 line-clamp-2">
              {p.description}
            </p>
          </div>

          {/* VARIANTS */}
          <div
            className="flex flex-wrap gap-2 mt-3"
            onClick={(e) => e.stopPropagation()}
          >
            {sellVariants.map((v: any, i: number) => (
              <button
                key={i}
                onClick={() =>
                  setRelVariantMap((prev) => ({
                    ...prev,
                    [p.id]: i,
                  }))
                }
                className={`px-2 py-1 border rounded text-[10px] sm:text-xs ${
                  selectedVariantIndex === i
                    ? "bg-green-700 text-white"
                    : ""
                }`}
              >
                {v.weightLabel}
              </button>
            ))}
          </div>

          {/* QTY */}
          <div
            className="flex items-center gap-3 mt-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => decRelQty(p.id)}
              className="border px-2 sm:px-3 rounded"
            >
              −
            </button>
            <span>{qty}</span>
            <button
              onClick={() => incRelQty(p.id)}
              className="border px-2 sm:px-3 rounded"
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
