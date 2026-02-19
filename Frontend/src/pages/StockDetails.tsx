import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import inventoryApi from "../api/inventoryApi";

/* ================= TYPES ================= */

interface StockEntry {
  id: number;
  productId: number;
  productName: string;
  categoryId: number;
  categoryName: string;
  supplierName: string;
  supplierGst: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  stockInDate: string;
  expiryDate: string;
}

/* ================= COMPONENT ================= */

export default function AdminStockDetails() {
  const [stocks, setStocks] = useState<StockEntry[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [productFilter, setProductFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();

  /* ===== LOAD FILTER DATA ===== */
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  /* ===== LOAD STOCK ===== */
  const loadStocks = async () => {
    const res = await inventoryApi.get("/inventory/entries");
    setStocks(res.data);
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const deleteStock = async (id: number) => {
    if (!window.confirm("Delete this entry?")) return;
    await inventoryApi.delete(`/inventory/entries/${id}`);
    loadStocks();
  };

  /* ===== FILTER ===== */
  const filteredStocks = useMemo(() => {
    return stocks.filter((s) => {
      return (
        (s.productName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
          s.supplierName
            .toLowerCase()
            .includes(search.toLowerCase())) &&
        (categoryFilter === "ALL" ||
          s.categoryId === Number(categoryFilter)) &&
        (productFilter === "ALL" ||
          s.productId === Number(productFilter)) &&
        (!dateFilter ||
          s.stockInDate.startsWith(dateFilter))
      );
    });
  }, [stocks, search, categoryFilter, productFilter, dateFilter]);

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Stock Inventory Details
          </h1>
          <p className="text-gray-500 text-sm">
            Track supplier, pricing, and stock entry records
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/stock-entry")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:scale-[1.02] transition"
        >
          + Add Entry
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-6 rounded-2xl shadow border grid md:grid-cols-4 gap-4">
        <Input
          placeholder="Search product / supplier..."
          value={search}
          onChange={setSearch}
        />

        <Select
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { label: "All Categories", value: "ALL" },
            ...categories.map((c) => ({
              label: c.name,
              value: c.id,
            })),
          ]}
        />

        <Select
          value={productFilter}
          onChange={setProductFilter}
          options={[
            { label: "All Products", value: "ALL" },
            ...products.map((p) => ({
              label: p.name,
              value: p.id,
            })),
          ]}
        />

        <Input
          type="date"
          value={dateFilter}
          onChange={setDateFilter}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Supplier</th>
              <th className="p-4 text-center">Qty</th>
              <th className="p-4">Purchase</th>
              <th className="p-4">Selling</th>
              <th className="p-4">Stock In</th>
              <th className="p-4">Expiry</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredStocks.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-4 font-semibold">
                  {s.productName}
                </td>
                <td className="p-4">{s.categoryName}</td>
                <td className="p-4">
                  <div>{s.supplierName}</div>
                  <div className="text-xs text-gray-400">
                    {s.supplierGst}
                  </div>
                </td>
                <td className="p-4 text-center text-emerald-600 font-bold">
                  {s.quantity}
                </td>
                <td className="p-4">
                  ₹{s.purchasePrice}
                </td>
                <td className="p-4">
                  ₹{s.sellingPrice}
                </td>
                <td className="p-4">
                  {s.stockInDate}
                </td>
                <td className="p-4">
                  {s.expiryDate}
                </td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() =>
                      navigate("/adminStockEntry", {
                        state: { stock: s },
                      })
                    }
                    className="bg-emerald-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteStock(s.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStocks.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No records found.
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= REUSABLE UI ================= */

function Input({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-xl px-4 py-3"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: any;
  onChange: (v: any) => void;
  options: { label: string; value: any }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-xl px-4 py-3"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}