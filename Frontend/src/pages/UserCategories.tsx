
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

interface Category {
  id: number;
  name: string;
  thumbnailImage: string;
}

function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data as Category[];
    },
  });
}

export default function UserCategories() {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();

  return (
    <div className="bg-[#fafaf6] py-14">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Explore our categories
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10 px-6">
        {categories.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/category/${c.id}`)}
            className="flex flex-col items-center cursor-pointer group"
          >
            {/* Circle */}
        <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden transition group-hover:scale-105">
  <img
    src={c.thumbnailImage}
    alt={c.name}
    className="w-full h-full object-cover rounded-full"
  />
</div>

            {/* Label */}
            <p className="mt-4 text-lg font-medium text-center">
              {c.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}