import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

/* =========================
   FETCH CATEGORIES
========================= */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
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
      const res = await api.get("/products");
      return res.data;
   },
  });
}