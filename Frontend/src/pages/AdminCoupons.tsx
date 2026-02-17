import React, { useEffect, useState } from "react";
import api from "../api/coupon";

/* ================= TYPES ================= */

interface Coupon {
  id?: number;
  code: string;
  minAmount: string;
  discountAmount: string;
  expiryDate: string;
  active: boolean;
}

/* ================= COMPONENT ================= */

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<Coupon>({
    code: "",
    minAmount: "",
    discountAmount: "",
    expiryDate: "",
    active: true,
  });

  /* ================= FETCH ================= */

  const fetchCoupons = async () => {
    const res = await api.get("/coupons");
    setCoupons(res.data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  /* ================= HANDLERS ================= */

  const updateField = (field: keyof Coupon, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      minAmount: Number(form.minAmount),
      discountAmount: Number(form.discountAmount),
    };

    if (editingId) {
      await api.put(`/coupons/${editingId}`, payload);
    } else {
      await api.post("/coupons", payload);
    }

    resetForm();
    fetchCoupons();
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingId(coupon.id!);
    setForm({
      code: coupon.code,
      minAmount: String(coupon.minAmount),
      discountAmount: String(coupon.discountAmount),
      expiryDate: coupon.expiryDate,
      active: coupon.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this coupon?")) return;
    await api.delete(`/coupons/${id}`);
    fetchCoupons();
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">Coupon Management</h1>

      {/* ===== FORM CARD ===== */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">
          {editingId ? "Update Coupon" : "Create New Coupon"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >
          <Input
            label="Coupon Code"
            value={form.code}
            onChange={(v) => updateField("code", v)}
          />

          <Input
            label="Minimum Amount"
            type="number"
            value={form.minAmount}
            onChange={(v) => updateField("minAmount", v)}
          />

          <Input
            label="Discount Amount"
            type="number"
            value={form.discountAmount}
            onChange={(v) =>
              updateField("discountAmount", v)
            }
          />

          <Input
            label="Expiry Date"
            type="date"
            value={form.expiryDate}
            onChange={(v) =>
              updateField("expiryDate", v)
            }
          />

          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                updateField("active", e.target.checked)
              }
            />
            <span className="text-sm font-medium">
              Active Coupon
            </span>
          </div>

          <div className="md:col-span-2 flex gap-4 mt-4">
            <button className="bg-green-600 text-white px-8 py-3 rounded-xl shadow hover:scale-[1.02] transition">
              {editingId
                ? "Update Coupon"
                : "Create Coupon"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-8 py-3 rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Code</th>
              <th className="p-4">Min</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4 font-semibold">
                  {c.code}
                </td>
                <td className="p-4 text-center">
                  ₹{c.minAmount}
                </td>
                <td className="p-4 text-center text-green-700 font-bold">
                  ₹{c.discountAmount}
                </td>
                <td className="p-4 text-center">
                  {c.expiryDate}
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(c.id!)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {coupons.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No coupons created yet.
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
        required
      />
    </div>
  );
}