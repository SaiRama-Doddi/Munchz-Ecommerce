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
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Campaign Coupons</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Drive more sales with strategic discounts</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-white border border-gray-100 shadow-sm text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Ticket size={14} />
            <span>{coupons.length} STRATEGY ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* FORM SIDE */}
        <div className="xl:col-span-1">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 sticky top-8 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="p-2.5 bg-black text-white rounded-xl shadow-lg">
                {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
              </div>
              <h2 className="text-xl font-bold text-black font-inter">
                {editingId ? "Update Promo" : "New Promotion"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Unique Code</label>
                <div className="relative">
                  <input
                    value={form.code}
                    onChange={(e) => updateField("code", e.target.value)}
                    placeholder="e.g. SUMMER50"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-5 py-4 text-sm font-black tracking-widest uppercase placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14"
                    required
                  />
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Min Order</label>
                  <input
                    type="number"
                    value={form.minAmount}
                    onChange={(e) => updateField("minAmount", e.target.value)}
                    placeholder="999"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Discount</label>
                  <input
                    type="number"
                    value={form.discountAmount}
                    onChange={(e) => updateField("discountAmount", e.target.value)}
                    placeholder="100"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-black text-emerald-600 placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Expiry Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => updateField("expiryDate", e.target.value)}
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14 pr-12"
                    required
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => updateField("active", !form.active)}
                  className={`w-12 h-6 rounded-full transition-all relative ${form.active ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.active ? 'left-7' : 'left-1'}`}></div>
                </button>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enable Promotion</span>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/5 hover:bg-emerald-600 transition-all duration-300"
              >
                {editingId ? "Apply Changes" : "Launch Promotion"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all duration-300"
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
              <div key={c.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 group hover:border-emerald-100 transition-all duration-300 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-lg font-black tracking-widest border border-emerald-100">
                        {c.code}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${c.active ? 'text-emerald-500' : 'text-gray-300'}`}>
                      {c.active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {c.active ? 'Active Now' : 'Internal Disabled'}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(c)}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id!)}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-4">
                  <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Benefit</p>
                    <p className="text-xl font-black text-emerald-600">₹{c.discountAmount}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Spend Over</p>
                    <p className="text-xl font-black text-black">₹{c.minAmount}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                   <div className="flex items-center gap-1.5 font-black uppercase tracking-widest">
                    <Calendar size={12} />
                    <span>Expires {c.expiryDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-black/20 font-black">
                    <Activity size={12} />
                    <span>ID: #{c.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {coupons.length === 0 && !loading && (
             <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] py-24 flex flex-col items-center justify-center text-gray-300">
              <Ticket size={48} className="mb-4 opacity-10" />
              <p className="font-black uppercase tracking-widest text-[10px]">No promotions available</p>
           </div>
          )}
        </div>
      </div>
    </div>
  );
}