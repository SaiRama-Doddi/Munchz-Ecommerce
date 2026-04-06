import React, { useEffect, useState } from "react";
import API from "../api/api";
import { 
  Share2, 
  Percent, 
  CircleDollarSign, 
  Target, 
  Activity, 
  Settings,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ReferralConfig {
  id?: number;
  friendDiscountPercentage: number;
  referrerCashbackAmount: number;
  minimumOrderAmount: number;
  isActive: boolean;
  updatedAt?: string;
}

export default function ReferralSettings() {
  const [configs, setConfigs] = useState<ReferralConfig[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ReferralConfig>({
    friendDiscountPercentage: 0,
    referrerCashbackAmount: 0,
    minimumOrderAmount: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await API.get("/auth/admin/referral-config", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setConfigs(res.data);
    } catch (err) {
      toast.error("Failed to load referral rules");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await API.put(`/auth/admin/referral-config/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("Rule Updated");
      } else {
        await API.post("/auth/admin/referral-config", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("New Rule Launched");
      }
      resetForm();
      fetchConfigs();
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this referral rule?")) return;
    try {
      await API.delete(`/auth/admin/referral-config/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Rule Deleted");
      fetchConfigs();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (rule: ReferralConfig) => {
    setEditingId(rule.id!);
    setForm({
      friendDiscountPercentage: rule.friendDiscountPercentage,
      referrerCashbackAmount: rule.referrerCashbackAmount,
      minimumOrderAmount: rule.minimumOrderAmount,
      isActive: rule.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      friendDiscountPercentage: 0,
      referrerCashbackAmount: 0,
      minimumOrderAmount: 0,
      isActive: true,
    });
  };

  const updateField = (field: keyof ReferralConfig, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-4xl text-black font-black tracking-tighter italic">Win-Win Referral</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Reward both the Referrer and their Friend</p>
        </div>
        
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <Activity className="text-emerald-500" size={18} />
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
            {configs.length} Optimized Strategies
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-4">
        {/* Form Layer */}
        <div className="xl:col-span-4">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm sticky top-8 overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
             
             <div className="flex items-center gap-4 mb-8 relative border-b border-gray-50 pb-6">
               <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl">
                 {editingId ? <Settings size={20} /> : <Plus size={20} />}
               </div>
               <div>
                 <h3 className="text-lg font-bold text-black tracking-tight leading-tight">
                   {editingId ? "Edit Strategy" : "New Strategy"}
                 </h3>
                 <p className="text-[9px] uppercase text-gray-400 font-bold">Campaign Builder</p>
               </div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6 relative">
                {/* FRIEND REWARD */}
                <div className="space-y-3 p-5 bg-emerald-50/30 rounded-3xl border border-emerald-100/50">
                  <label className="text-[10px] text-emerald-600 uppercase tracking-[0.2em] font-black ml-1">For Friend: Discount (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      value={form.friendDiscountPercentage}
                      onChange={(e) => updateField("friendDiscountPercentage", Number(e.target.value))}
                      className="w-full bg-white border-2 border-transparent rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:border-emerald-500 outline-none transition-all"
                      placeholder="e.g. 15"
                    />
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40" size={16} />
                  </div>
                  <p className="text-[8px] text-emerald-400 font-medium ml-1">Friend gets this OFF their first order</p>
                </div>

                {/* REFERRER REWARD */}
                <div className="space-y-3 p-5 bg-black/5 rounded-3xl border border-black/5">
                  <label className="text-[10px] text-black uppercase tracking-[0.2em] font-black ml-1">For You: Cashback (₹)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.referrerCashbackAmount}
                      onChange={(e) => updateField("referrerCashbackAmount", Number(e.target.value))}
                      className="w-full bg-white border-2 border-transparent rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:border-black outline-none transition-all"
                      placeholder="e.g. 200"
                    />
                    <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                  </div>
                  <p className="text-[8px] text-gray-400 font-medium ml-1">You get this flat for every success</p>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Minimum Spend Threshold (₹)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.minimumOrderAmount}
                      onChange={(e) => updateField("minimumOrderAmount", Number(e.target.value))}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:bg-white focus:border-emerald-500 outline-none transition-all"
                      placeholder="e.g. 999"
                    />
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Strategy Active</span>
                  <button
                    type="button"
                    onClick={() => updateField("isActive", !form.isActive)}
                    className={`w-12 h-6 rounded-full transition-all relative ${form.isActive ? 'bg-emerald-600' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${form.isActive ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-emerald-500/10"
                >
                  {saving ? "Deploying..." : (editingId ? "Update Strategy" : "Finalize Strategy")}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Discard Changes
                  </button>
                )}
             </form>
          </div>
        </div>

        {/* List Layer */}
        <div className="xl:col-span-8 space-y-6">
           {/* HOW IT WORKS PREVIEW */}
           <div className="bg-emerald-600 text-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-emerald-600/20 relative overflow-hidden group">
             <Share2 className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 group-hover:scale-110 transition-transform duration-700" />
             <div className="relative z-10">
               <h4 className="text-[10px] uppercase font-black tracking-widest mb-4 opacity-70">User Experience Preview</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-2">
                   <p className="text-[10px] uppercase font-black text-emerald-200">For Your Friend</p>
                   <p className="text-xl font-bold tracking-tight">
                     <span className="text-yellow-300 italic pr-2">{form.friendDiscountPercentage}% OFF</span> 
                     on their first order of ₹{form.minimumOrderAmount} or more.
                   </p>
                 </div>
                 <div className="space-y-2">
                   <p className="text-[10px] uppercase font-black text-emerald-200">For You</p>
                   <p className="text-xl font-bold tracking-tight">
                     <span className="text-white italic pr-2">₹{form.referrerCashbackAmount} Cashback</span> 
                     for every successful referral.
                   </p>
                 </div>
               </div>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {configs.map((rule) => (
                <div key={rule.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 group hover:border-emerald-100 transition-all shadow-sm relative overflow-hidden">
                   <div className="flex justify-between items-start mb-8 border-b border-gray-50 pb-6">
                     <div>
                       <h4 className="text-sm font-black text-black tracking-tight mb-1 italic underline decoration-emerald-500/20 underline-offset-4">ID: RE-00{rule.id}</h4>
                       <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter ${rule.isActive ? 'text-emerald-500' : 'text-gray-300'}`}>
                         <Activity size={12} />
                         {rule.isActive ? "Strategy Active & Live" : "Internal Disabled"}
                       </div>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(rule)} className="p-3 bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all shadow-sm"><Settings size={14}/></button>
                        <button onClick={() => handleDelete(rule.id!)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"><Trash2 size={14}/></button>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-4">
                     <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-50">
                        <p className="text-[9px] text-emerald-600/60 uppercase font-black mb-2">Friend Gets</p>
                        <p className="text-2xl font-black text-emerald-600">{rule.friendDiscountPercentage}% <span className="text-[10px] font-medium opacity-50 uppercase">OFF</span></p>
                     </div>
                     <div className="p-5 bg-gray-50/50 rounded-3xl border border-gray-50">
                        <p className="text-[9px] text-gray-400 uppercase font-black mb-2">You Get</p>
                        <p className="text-2xl font-black text-black">₹{rule.referrerCashbackAmount} <span className="text-[10px] font-medium opacity-30 uppercase">CASH</span></p>
                     </div>
                   </div>

                   <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/30 rounded-2xl border border-gray-50">
                     <Target size={12} className="text-gray-300" />
                     <p className="text-[10px] font-bold text-gray-400 uppercase italic">Minimum order required: <span className="text-black">₹{rule.minimumOrderAmount}</span></p>
                   </div>
                </div>
             ))}

             {configs.length === 0 && (
               <div className="col-span-full py-40 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-300">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <Share2 size={32} className="opacity-10" />
                  </div>
                  <p className="text-[11px] uppercase font-black tracking-widest opacity-60">No Win-Win Strategies Found</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
