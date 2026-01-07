import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/client";


export function useSubcategories() {
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const query = useQuery({
    queryKey: ["subcategories", categoryId],
    enabled: categoryId !== null,
    queryFn: async () => {
      const res = await api.get(
        `/subcategories/by-category/${categoryId}`
      );
      return res.data;
    },
  });

  return {
    subcategories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    fetchSubcats: (id: number) => setCategoryId(id),
  };
}