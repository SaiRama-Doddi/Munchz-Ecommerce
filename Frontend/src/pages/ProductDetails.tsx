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
   COMPONENT
========================= */
export default function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id);
const navigate = useNavigate();

  const { data: product, isLoading, isError } = useProduct(productId);
const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);

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
      <TopHeader/>
      <Header/>




    <div className="bg-[#f6fff4] min-h-screen py-12">

<button
            onClick={() => navigate(-1)}
            className="mt-0 mb-8 ml-[136px]
      inline-flex items-center gap-3
      bg-white px-4 py-2 rounded-full
      shadow-md border border-green-100
      text-green-700 font-medium
      hover:bg-green-50 hover:shadow-lg
      active:scale-95
      transition-all duration-200
      cursor-pointer
    "
          >
            <span className="
      flex items-center justify-center
      w-8 h-8 rounded-full
      bg-green-700 text-white
      text-lg
    ">
              ←
            </span>
            Back
          </button>

      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
 
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
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  selectedImage === img ? "border-green-700" : ""
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
                className="border px-3 py-1 rounded"
              >
                −
              </button>

              <span>{qty}</span>

              <button
                onClick={() => setQty(qty + 1)}
                className="border px-3 py-1 rounded"
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
                className={`px-4 py-1 rounded border ${
                  selectedVariantIndex === i
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
    <Footer/>
    </section>
  );
}