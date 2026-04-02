import { useState, useEffect } from "react";
import API from "../api/api";
import { UserPlus, Shield, Mail, CheckCircle, XCircle, Settings, Trash2, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

interface SubAdmin {
  id: string;
  email: string;
  status: "PRE_VERIFIED" | "ACTIVE" | "DISABLED";
  permissions: string;
  createdAt: string;
}

const MODULES = ["CATEGORIES", "PRODUCTS", "ORDERS", "STOCKS", "COUPONS", "REVIEWS"];
const ACTIONS = ["CREATE", "READ", "UPDATE", "DELETE"];

export default function SubAdminManagement() {
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdmin | null>(null);
  const [permissions, setPermissions] = useState<any>({});

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      const res = await API.get("/subadmin/api/list", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (Array.isArray(res.data)) {
        setSubAdmins(res.data);
      } else {
        console.error("Invalid sub-admin data format:", res.data);
        setSubAdmins([]);
      }
    } catch (err) {
      toast.error("Failed to fetch sub-admins");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await API.post("/subadmin/api/create", { email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Sub-Admin created! Verification email sent.");
      setEmail("");
      fetchSubAdmins();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create sub-admin");
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenPermissions = (subAdmin: SubAdmin) => {
    setSelectedSubAdmin(subAdmin);
    try {
      setPermissions(JSON.parse(subAdmin.permissions || "{}"));
    } catch {
      setPermissions({});
    }
  };

  const togglePermission = (module: string, action: string) => {
    const newPerms = { ...permissions };
    if (!newPerms[module]) newPerms[module] = [];
    
    if (newPerms[module].includes(action)) {
      newPerms[module] = newPerms[module].filter((a: string) => a !== action);
    } else {
      newPerms[module].push(action);
    }
    setPermissions(newPerms);
  };

  const savePermissions = async () => {
    if (!selectedSubAdmin) return;
    try {
      await API.put(`/subadmin/api/${selectedSubAdmin.id}/permissions`, 
        { permissions: JSON.stringify(permissions) },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Permissions updated successfully");
      setSelectedSubAdmin(null);
      fetchSubAdmins();
    } catch (err) {
      toast.error("Failed to update permissions");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 className="text-4xl text-black font-medium tracking-tight">Access Control</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Manage Sub-Admin identities and granular permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Create Form */}
        <div className="xl:col-span-1">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm sticky top-24">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
              <UserPlus size={32} />
            </div>
            
            <h2 className="text-xl text-black mb-2">Create Authority</h2>
            <p className="text-xs text-gray-400 mb-8 leading-relaxed">Enter an email to register a new sub-admin. They will be automatically synced with the central identity system.</p>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Identity Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@munchz.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-4 text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all h-14"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-black text-white py-4 rounded-2xl text-[11px] uppercase font-bold shadow-xl hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                {isCreating ? "Synchronizing..." : "Register & Sync"}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="xl:col-span-3 space-y-4">
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : subAdmins.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-[2.5rem] p-16 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Shield className="text-gray-200" size={40} />
              </div>
              <p className="text-gray-400 text-sm">No secondary authorities established yet.</p>
            </div>
          ) : (
            (subAdmins || []).map((sa) => (
              <div key={sa.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-md transition-all group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      sa.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black">{sa.email}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] uppercase px-2 py-0.5 rounded-md ${
                          sa.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {sa.status.replace('_', ' ')}
                        </span>
                        <span className="text-[9px] text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> {new Date(sa.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenPermissions(sa)}
                      className="p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      title="Adjust Permissions"
                    >
                      <Settings size={18} />
                    </button>
                    <button className="p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Permissions Modal */}
      {selectedSubAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-emerald-600 text-white">
              <div>
                <h2 className="text-xl font-bold">Permissions Control</h2>
                <p className="text-[10px] uppercase tracking-widest opacity-80 mt-1">Managing access for {selectedSubAdmin.email}</p>
              </div>
              <button 
                onClick={() => setSelectedSubAdmin(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MODULES.map((module) => (
                  <div key={module} className="border border-gray-100 rounded-3xl p-6 bg-gray-50/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-emerald-600">
                        <CheckCircle size={16} />
                      </div>
                      <h3 className="text-xs font-black uppercase text-black italic tracking-widest">{module}</h3>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {ACTIONS.map((action) => {
                        const isActive = permissions[module]?.includes(action);
                        return (
                          <button
                            key={action}
                            onClick={() => togglePermission(module, action)}
                            className={`group flex items-center justify-center p-4 rounded-2xl text-[10px] uppercase font-black transition-all border-2 ${
                              isActive 
                                ? 'bg-black text-white border-black shadow-lg' 
                                : 'bg-white text-gray-300 border-gray-50 hover:border-black/10'
                            }`}
                          >
                            <span className={isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100 transition-opacity'}>{action.slice(0, 1)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-10 border-t border-gray-50 bg-white flex items-center justify-between">
              <div className="hidden md:block">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest italic">Permissions are applied instantly after saving</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedSubAdmin(null)}
                  className="px-8 py-4 rounded-2xl text-[11px] uppercase font-bold text-gray-400 hover:text-black transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={savePermissions}
                  className="px-12 py-4 rounded-2xl bg-emerald-600 text-white text-[11px] uppercase font-bold shadow-2xl shadow-emerald-600/20 hover:scale-[1.05] active:scale-[0.98] transition-all"
                >
                  Confirm Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
