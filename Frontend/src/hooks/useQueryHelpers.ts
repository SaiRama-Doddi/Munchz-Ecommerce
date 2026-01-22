import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

/* =========================
   FETCH CATEGORIES
========================= */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    queryFn: async () => {
      const res = await api.get("/product/api/categories");

      // 🔥 SAFE RETURN (supports wrapped & non-wrapped)
      return res.data?.data ?? res.data;
    },
  });
}


/* =========================
   FETCH PRODUCTS
========================= */
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get("/product/api/products");
      return res.data?.data ?? res.data;
    },
  });
}


export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/order/api/orders"); // ✅ verify this
      return res.data?.data ?? res.data;
    },
  });
}

