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
  Trash2
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ReferralConfig {
  id?: number;
  rewardPercentage: number;
  fixedAmount: number;
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
    rewardPercentage: 0,
    fixedAmount: 0,
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
      rewardPercentage: rule.rewardPercentage,
      fixedAmount: rule.fixedAmount,
      minimumOrderAmount: rule.minimumOrderAmount,
      isActive: rule.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      rewardPercentage: 0,
      fixedAmount: 0,
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
    <div className="space-y-10 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-4xl text-black font-black tracking-tighter">Referral Campaigns</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Design tiered acquisition benchmarks</p>
        </div>
        
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <Activity className="text-emerald-500" size={18} />
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
            {configs.length} Active Configurations
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-4">
        {/* Form Layer */}
        <div className="xl:col-span-4">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm sticky top-8 overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
             
             <div className="flex items-center gap-4 mb-8 relative">
               <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl">
                 {editingId ? <Settings size={20} /> : <Share2 size={20} />}
               </div>
               <h3 className="text-lg font-bold text-black tracking-tight">
                 {editingId ? "Edit Rule" : "New Rule"}
               </h3>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Percentage Reward (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={form.rewardPercentage}
                      onChange={(e) => updateField("rewardPercentage", Number(e.target.value))}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:bg-white focus:border-emerald-500 outline-none transition-all"
                      placeholder="e.g. 10.0"
                    />
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Fixed Reward (₹)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.fixedAmount}
                      onChange={(e) => updateField("fixedAmount", Number(e.target.value))}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:bg-white focus:border-emerald-500 outline-none transition-all"
                      placeholder="e.g. 50"
                    />
                    <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Min Spend Threshold (₹)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.minimumOrderAmount}
                      onChange={(e) => updateField("minimumOrderAmount", Number(e.target.value))}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:bg-white focus:border-emerald-500 outline-none transition-all underline decoration-emerald-500/20 underline-offset-4"
                      placeholder="e.g. 1000"
                    />
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Campaign Active</span>
                  <button
                    type="button"
                    onClick={() => updateField("isActive", !form.isActive)}
                    className={`w-12 h-6 rounded-full transition-all relative ${form.isActive ? 'bg-emerald-600' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.isActive ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg"
                >
                  {saving ? "Deploying..." : (editingId ? "Save Changes" : "Launch Campaign")}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
             </form>
          </div>
        </div>

        {/* List Layer */}
        <div className="xl:col-span-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {configs.map((rule) => (
                <div key={rule.id} className="bg-white border border-gray-100 rounded-[2rem] p-8 group hover:border-emerald-100 transition-all shadow-sm relative overflow-hidden">
                   <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-6">
                     <div>
                       <h4 className="text-xs font-black uppercase text-black tracking-tight mb-1">Benchmark: ₹{rule.minimumOrderAmount}</h4>
                       <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter ${rule.isActive ? 'text-emerald-500' : 'text-gray-300'}`}>
                         <Activity size={12} />
                         {rule.isActive ? "Active Strategy" : "Inactive Strategy"}
                       </div>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(rule)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all"><Settings size={14}/></button>
                        <button onClick={() => handleDelete(rule.id!)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={14}/></button>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                        <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Percentage</p>
                        <p className="text-xl font-black text-emerald-600">{rule.rewardPercentage}%</p>
                     </div>
                     <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                        <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Cash Bonus</p>
                        <p className="text-xl font-black text-black">₹{rule.fixedAmount}</p>
                     </div>
                   </div>

                   <div className="mt-6 flex items-center justify-between">
                     <p className="text-[9px] text-gray-400 uppercase tracking-widest font-medium italic opacity-60">ID: REF-00{rule.id}</p>
                     <div className="flex items-center md:hidden gap-1.5 font-bold text-gray-400 text-[10px]">
                        <Settings size={12} onClick={() => handleEdit(rule)} />
                        <Trash2 size={12} onClick={() => handleDelete(rule.id!)} />
                     </div>
                   </div>
                </div>
             ))}

             {configs.length === 0 && (
               <div className="col-span-full py-32 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-300">
                  <Share2 size={48} className="mb-4 opacity-10" />
                  <p className="text-xs uppercase font-black tracking-widest">No Referral Rules Established</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
