import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

/* =========================
   FETCH CATEGORIES
========================= */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/product/api/categories");
      return res.data;
    },
  });
}

/* =========================
   FETCH PRODUCTS
========================= */
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/product/api/products");
      return res.data;
   },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data;
    },
  });
}
