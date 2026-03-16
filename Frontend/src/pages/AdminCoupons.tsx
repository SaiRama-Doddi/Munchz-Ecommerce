import React, { useEffect, useState } from "react";
import api from "../api/coupon";
import {
  Ticket,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  CircleDollarSign,
  Activity,
  Info,
  CheckCircle2,
  XCircle
} from "lucide-react";

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
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Coupon>({
    code: "",
    minAmount: "",
    discountAmount: "",
    expiryDate: "",
    active: true,
  });

  /* ================= FETCH ================= */

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
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

    try {
      if (editingId) {
        await api.put(`/coupons/${editingId}`, payload);
        alert("Coupon Updated");
      } else {
        await api.post("/coupons", payload);
        alert("Coupon Created");
      }
      resetForm();
      fetchCoupons();
    } catch (err) {
      alert("Action failed");
    }
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
    if (!window.confirm("Delete this coupon code permanently?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-10 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campaign Coupons</h1>
          <p className="text-slate-500 font-medium font-inter">Drive more sales with strategic discounts</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100/50 flex items-center gap-2">
            <Ticket size={14} />
            <span>{coupons.length} Strategy Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* FORM SIDE */}
        <div className="xl:col-span-1">
          <div className="glass-card rounded-[2.5rem] p-8 md:p-10 sticky top-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Update Promo" : "New Promotion"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Unique Code</label>
                <div className="relative">
                  <input
                    value={form.code}
                    onChange={(e) => updateField("code", e.target.value)}
                    placeholder="e.g. SUMMER50"
                    className="input h-14 uppercase font-black tracking-widest pl-12"
                    required
                  />
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Min Order</label>
                  <input
                    type="number"
                    value={form.minAmount}
                    onChange={(e) => updateField("minAmount", e.target.value)}
                    placeholder="999"
                    className="input h-14"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Discount</label>
                  <input
                    type="number"
                    value={form.discountAmount}
                    onChange={(e) => updateField("discountAmount", e.target.value)}
                    placeholder="100"
                    className="input h-14 text-emerald-600 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => updateField("expiryDate", e.target.value)}
                    className="input h-14 pr-4"
                    required
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => updateField("active", !form.active)}
                  className={`w-12 h-6 rounded-full transition-all relative ${form.active ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.active ? 'left-7' : 'left-1'}`}></div>
                </button>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enable Promotion</span>
              </div>

              <button
                type="submit"
                className="w-full bg-accent-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-300"
              >
                {editingId ? "Apply Changes" : "Launch Promotion"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all duration-300"
                >
                  Discard Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* LIST SIDE */}
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="glass-card rounded-[2rem] p-6 border border-slate-50 group hover:border-emerald-100 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-lg font-black tracking-widest border border-emerald-100">
                        {c.code}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${c.active ? 'text-emerald-500' : 'text-slate-300'}`}>
                      {c.active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {c.active ? 'Active Now' : 'Internal Disabled'}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id!)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50/50 mb-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Benefit</p>
                    <p className="text-xl font-black text-emerald-600">₹{c.discountAmount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Spend Over</p>
                    <p className="text-xl font-black text-slate-800">₹{c.minAmount}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                   <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>Expires {c.expiryDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-500">
                    <Activity size={12} />
                    <span>ID: #{c.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {coupons.length === 0 && !loading && (
             <div className="glass-card rounded-[2.5rem] py-24 flex flex-col items-center justify-center text-slate-300">
              <Ticket size={48} className="mb-4 opacity-10" />
              <p className="font-black uppercase tracking-widest text-xs">No promotions available</p>
           </div>
          )}
        </div>
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