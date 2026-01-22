import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/client";


export function useSubcategories() {
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const query = useQuery({
    queryKey: ["subcategories", categoryId],
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get(
        `/product/api/subcategories/by-category/${categoryId}`
      );
      return res.data?.data ?? res.data;
    },
  });

  return {
    subcategories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    fetchSubcats: setCategoryId,
  };
}
