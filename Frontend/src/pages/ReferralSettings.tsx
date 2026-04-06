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
  AlertCircle
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
  const [config, setConfig] = useState<ReferralConfig>({
    rewardPercentage: 0,
    fixedAmount: 0,
    minimumOrderAmount: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await API.get("/auth/admin/referral-config", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setConfig(res.data);
    } catch (err) {
      toast.error("Failed to load referral settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put("/auth/admin/referral-config", config, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Referral configuration updated!", {
        icon: '🚀',
        style: {
          borderRadius: '15px',
          background: '#059669',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          textTransform: 'uppercase'
        }
      });
      fetchConfig();
    } catch (err) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ReferralConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-4xl text-black font-black tracking-tighter">Referral Program</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Configure user acquisition & loyalty rewards</p>
        </div>
        
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${config.isActive ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-400'} transition-all duration-500`}>
          {config.isActive ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-[11px] font-black uppercase tracking-wider">
            Program {config.isActive ? 'Active & Live' : 'Currently Paused'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* Main Settings Card */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
            
            <div className="flex items-center gap-4 mb-10 relative">
              <div className="w-14 h-14 bg-black text-white rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-black/20">
                <Settings size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black tracking-tight">Reward Architecture</h3>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Define standard earning benchmarks</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Percentage Reward</label>
                  <div className="relative group">
                    <input
                      type="number"
                      step="0.1"
                      value={config.rewardPercentage}
                      onChange={(e) => updateField("rewardPercentage", Number(e.target.value))}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-3xl pl-14 pr-6 py-5 text-lg font-black focus:bg-white focus:border-emerald-500 outline-none transition-all"
                      placeholder="5.0"
                    />
                    <Percent className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  </div>
                  <p className="text-[9px] text-gray-400 italic ml-2">* Calculated from referred user's total purchase</p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Fixed Reward (₹)</label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={config.fixedAmount}
                      onChange={(e) => updateField("fixedAmount", Number(e.target.value))}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-3xl pl-14 pr-6 py-5 text-lg font-black focus:bg-white focus:border-emerald-500 outline-none transition-all"
                      placeholder="100"
                    />
                    <CircleDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  </div>
                  <p className="text-[9px] text-gray-400 italic ml-2">* Bonus credit added directly to referrer</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Minimum Order Benchmark</label>
                <div className="relative group">
                  <input
                    type="number"
                    value={config.minimumOrderAmount}
                    onChange={(e) => updateField("minimumOrderAmount", Number(e.target.value))}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-3xl pl-14 pr-6 py-5 text-lg font-black focus:bg-white focus:border-emerald-500 outline-none transition-all"
                    placeholder="499"
                  />
                  <Target className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                </div>
                <p className="text-[10px] text-emerald-600 font-bold ml-2">Referrer only earns after referred user spends at least ₹{config.minimumOrderAmount}</p>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50/50 border border-gray-100 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${config.isActive ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-black">Program Status</h4>
                    <p className="text-[10px] text-gray-400">Enable or disable Refer & Earn platform-wide</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("isActive", !config.isActive)}
                  className={`w-16 h-8 rounded-full transition-all relative ${config.isActive ? 'bg-emerald-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${config.isActive ? 'left-9' : 'left-1'}`}></div>
                </button>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-black text-white py-6 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-black/20 hover:bg-emerald-600 hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:scale-100"
              >
                {saving ? "Deploying Changes..." : "Securely Update Configuration"}
              </button>
            </form>
          </div>
        </div>

        {/* Info / Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-emerald-600 text-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-emerald-600/20 relative overflow-hidden">
            <Share2 className="absolute -bottom-10 -right-10 text-white/10 w-48 h-48" />
            <h4 className="text-[10px] uppercase font-black tracking-widest mb-2 opacity-60">Program Summary</h4>
            <h3 className="text-2xl font-bold mb-6 tracking-tight">How it works for your users</h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">1</div>
                <p className="text-xs leading-relaxed opacity-90 font-medium">Existing user shares their unique referral code found in their profile.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">2</div>
                <p className="text-xs leading-relaxed opacity-90 font-medium">New user signs up using this code and completes their first purchase of at least <span className="font-bold underline decoration-white/30 underline-offset-4">₹{config.minimumOrderAmount}</span>.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">3</div>
                <p className="text-xs leading-relaxed opacity-90 font-medium">Referrer automatically earns <span className="font-bold text-yellow-300 underline decoration-yellow-300/30 underline-offset-4">{config.rewardPercentage}%</span> of order value PLUS a flat <span className="font-black text-yellow-300">₹{config.fixedAmount}</span> bonus.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <Activity className="text-emerald-500" size={18} />
               <h4 className="text-[11px] font-black uppercase text-black tracking-widest">Metadata</h4>
             </div>
             
             <div className="space-y-4">
               <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Last Synchronized</span>
                  <span className="text-[10px] text-black font-black">{config.updatedAt ? new Date(config.updatedAt).toLocaleString() : 'Never'}</span>
               </div>
               <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Configuration ID</span>
                  <span className="text-[10px] text-black font-black">REF_CFG_00{config.id || 1}</span>
               </div>
               <div className="flex items-center justify-between py-3">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Server Cache Status</span>
                  <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-tighter">Verified</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
