import React, { useEffect, useState } from "react";
import api from "../api/coupon";

interface Coupon {
  id?: number;
  code: string;
  minAmount: string;
  discountAmount: string;
  expiryDate: string;
  active: boolean;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState<Coupon>({
    code: "",
    minAmount: "",
    discountAmount: "",
    expiryDate: "",
    active: true,
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  /* ================= FETCH COUPONS ================= */
  const fetchCoupons = async () => {
    const res = await api.get("/coupon/api/coupons");
    setCoupons(res.data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const updateField = (field: keyof Coupon, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      minAmount: Number(form.minAmount),
      discountAmount: Number(form.discountAmount),
    };

    if (editingId) {
      await api.put(`/coupon/api/coupons/${editingId}`, payload);
    } else {
      await api.post("/coupon/api/coupons", payload);
    }

    resetForm();
    fetchCoupons();
  };

  /* ================= EDIT ================= */
  const handleEdit = (coupon: Coupon) => {
    setEditingId(coupon.id!);
    setForm({
      code: coupon.code,
      minAmount: String(coupon.minAmount),
      discountAmount: String(coupon.discountAmount),
      expiryDate: coupon.expiryDate,
      active: coupon.active,
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this coupon?")) return;
    await api.delete(`/coupon/api/coupons/${id}`);
    fetchCoupons();
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingId(null);
    setForm({
      code: "",
      minAmount: "",
      discountAmount: "",
      expiryDate: "",
      active: true,
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-3xl font-bold mb-6">Coupon Management</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-10">

        <input
          type="text"
          placeholder="Coupon Code"
          value={form.code}
          onChange={(e) => updateField("code", e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Minimum Amount"
          value={form.minAmount}
          onChange={(e) => updateField("minAmount", e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Discount Amount"
          value={form.discountAmount}
          onChange={(e) => updateField("discountAmount", e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          value={form.expiryDate}
          onChange={(e) => updateField("expiryDate", e.target.value)}
          className="border p-2 rounded"
          required
        />

        <label className="flex items-center gap-2 col-span-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => updateField("active", e.target.checked)}
          />
          Active
        </label>

        <div className="flex gap-3 col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            {editingId ? "Update Coupon" : "Create Coupon"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Min Amount</th>
            <th className="border p-2">Discount</th>
            <th className="border p-2">Expiry</th>
            <th className="border p-2">Active</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.code}</td>
              <td className="border p-2">{c.minAmount}</td>
              <td className="border p-2">{c.discountAmount}</td>
              <td className="border p-2">{c.expiryDate}</td>
              <td className="border p-2">
                {c.active ? "Yes" : "No"}
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id!)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
