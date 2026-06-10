import {
  X,
  LogOut,
  Save,
  User,
  Phone,
  Mail,
  Pencil,
  Trash2,
  LayoutDashboard,
  Navigation,
  MapPin,
  Wallet,
  ArrowRight,
  Gift
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import {
  updateProfileApi,
  listAddressesApi,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
  getProfileApi,
} from "../api/api";
import FloatingInput from "../components/FloatingInput";
import { getAddressFromPincode, getCurrentPosition, getAddressFromCoords } from "../utils/addressUtils";

/* ================= TYPES ================= */

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Address {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone?: string;
  isDefault: boolean;
}

/* ================= COMPONENT ================= */

export default function ProfileDashboard({ open, onClose }: Props) {
  const { profile, updateProfile, logout } = useAuth();
  const { isAdmin, isSubAdmin } = usePermissions();
  const navigate = useNavigate();

  /* ---------- PROFILE ---------- */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- ADDRESS ---------- */
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<any>({ country: "India", isDefault: false });

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (profile && open) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setMobile(profile.mobile || "");
      fetchAddresses();
      refreshProfile();
    }
  }, [open]);

  const refreshProfile = async () => {
    try {
      const res = await getProfileApi();
      updateProfile(res.data);
    } catch (err) {
      console.error("Failed to refresh profile", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await listAddressesApi();
      setAddresses(res.data);
    } catch {
      setAddresses([]);
    }
  };

  /* ================= HANDLERS ================= */

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const res = await updateProfileApi({ firstName, lastName, mobile });
      updateProfile({ ...profile, ...res.data });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () =>
    setForm({ country: "India", isDefault: false });

  const handlePincodeChange = async (val: string) => {
    setForm((prev: any) => ({ ...prev, pincode: val }));
    if (val.length === 6) {
      const data = await getAddressFromPincode(val);
      if (data) {
        setForm((prev: any) => ({
          ...prev,
          city: data.city,
          state: data.state,
          country: data.country
        }));
      }
    }
  };

  const handleLiveLocation = async () => {
    try {
      setLoading(true);
      const pos = await getCurrentPosition();
      const data = await getAddressFromCoords(pos.coords.latitude, pos.coords.longitude);
      if (data) {
        setForm((prev: any) => ({
          ...prev,
          addressLine1: data.addressLine1,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country
        }));
      }
    } catch (err) {
      alert("Could not get your location. Please check your browser permissions.");
    } finally {
      setLoading(false);
    }
  };


  const handleAddAddress = async () => {
      console.log("ADD ADDRESS PAYLOAD", form);
    await addAddressApi(form);
    setShowAddForm(false);
    resetForm();
    fetchAddresses();
  };

  const handleUpdateAddress = async (id: string) => {
      console.log("update ADDRESS PAYLOAD", form);
      const payload = {
  ...form,
  phone: form.phone?.trim() || null,
};
    await updateAddressApi(id,payload);
    setEditingId(null);
    resetForm();
    fetchAddresses();
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await deleteAddressApi(id);
    fetchAddresses();
  };

  if (!open || !profile) return null;

  /* ================= UI ================= */

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-[0_0_50px_rgba(0,0,0,0.15)] flex flex-col animate-in slide-in-from-right duration-500 ease-out border-l border-gray-100">
        
        {/* PREMIUM HEADER */}
        <div className="bg-[#ecfdf5] shrink-0 border-b border-green-100/40 p-6 space-y-4 relative overflow-hidden">
          {/* Subtle decoration in background */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-green-200/20 to-transparent rounded-br-full pointer-events-none" />
          
          {/* Top Row: Title and Close */}
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-gray-800 font-extrabold text-base tracking-tight uppercase">My Profile</h2>
            <button 
              onClick={onClose} 
              className="p-1.5 bg-white/80 hover:bg-white text-green-700 rounded-full transition-all duration-200 cursor-pointer shadow-sm"
            >
              <X size={18} />
            </button>
          </div>

          {/* User Info Row */}
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-2 border-white flex items-center justify-center text-green-600 font-extrabold text-lg shrink-0">
               {profile.firstName?.charAt(0).toUpperCase()}{profile.lastName?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
               <h3 className="text-gray-900 font-extrabold text-base tracking-tight leading-tight truncate">
                 {profile.firstName} {profile.lastName}
               </h3>
               <p className="text-gray-400 text-xs font-semibold truncate mt-1 flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> {profile.email}
               </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
          
          {/* WALLET SECTION - Premium White Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:shadow-[0_8px_40px_rgb(0,0,0,0.04)] transition-all duration-300">
             <div className="absolute top-0 right-0 p-8 opacity-5 text-green-750 group-hover:scale-105 transition-transform pointer-events-none">
               <Wallet size={80} />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                 <Gift size={16} className="text-green-600" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Rewards Wallet</span>
               </div>
               <div className="flex items-end justify-between">
                 <div>
                   <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-1.5">
                     ₹{profile.referralCredits?.toFixed(0) || 0}
                   </p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Available Balance</p>
                 </div>
                 <button 
                   onClick={() => { navigate("/refer-and-earn"); onClose(); }}
                   className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md shadow-green-600/10 hover:shadow-lg hover:shadow-green-600/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                 >
                   <span>Refer & Earn</span>
                   <ArrowRight size={12} />
                 </button>
               </div>
             </div>
          </div>

          {/* USER INFO SECTION */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Account Details</h3>
             </div>
             <div className="grid grid-cols-2 gap-3">
               <FloatingInput value={firstName} onChange={setFirstName} label="First Name" icon={<User size={14} className="text-green-600" />} />
               <FloatingInput value={lastName} onChange={setLastName} label="Last Name" icon={<User size={14} className="text-green-600" />} />
             </div>
             <FloatingInput value={mobile} onChange={setMobile} label="Phone Number" icon={<Phone size={14} className="text-green-600" />} />
          </div>

          {/* ADDRESSES SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Saved Addresses</h3>
              </div>
              <button 
                onClick={() => setShowAddForm(true)}
                className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 transition-colors"
              >
                + Add New
              </button>
            </div>

            {/* ADD ADDRESS FORM - REDESIGNED */}
            {showAddForm && (
              <div className="bg-gray-50/50 p-5 rounded-[2rem] border-2 border-dashed border-green-200 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <button
                  onClick={handleLiveLocation}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-white text-green-700 border-2 border-dashed border-green-200 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-green-50 transition-all"
                >
                  <Navigation size={14} className="animate-pulse" />
                  Use Live Location
                </button>

                <FloatingInput value={form.label || ""} onChange={v => setForm({ ...form, label: v })} label="Label (e.g. Home, Work)" />
                <FloatingInput value={form.addressLine1 || ""} onChange={v => setForm({ ...form, addressLine1: v })} label="Street Address" />
                
                <div className="grid grid-cols-2 gap-3">
                  <FloatingInput value={form.city || ""} onChange={v => setForm({ ...form, city: v })} label="City" />
                  <FloatingInput value={form.state || ""} onChange={v => setForm({ ...form, state: v })} label="State" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FloatingInput value={form.pincode || ""} onChange={handlePincodeChange} label="Pincode" />
                  <div className="flex items-center gap-2 px-3">
                    <input type="checkbox" checked={form.isDefault || false} onChange={e => setForm({ ...form, isDefault: e.target.checked })} className="accent-green-600" />
                    <span className="text-[10px] font-bold text-gray-500">Default</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={handleAddAddress} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-100">Save</button>
                  <button onClick={() => setShowAddForm(false)} className="px-6 bg-white border border-gray-200 text-gray-400 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {addresses.length === 0 && !showAddForm && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2rem] p-8 text-center">
                   <MapPin size={24} className="mx-auto text-gray-200 mb-2" />
                   <p className="text-xs font-bold text-gray-400">No addresses saved yet</p>
                </div>
              )}

              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className={`group relative border rounded-3xl p-5 transition-all duration-300 ${
                    editingId === addr.id
                      ? "border-green-600 bg-white shadow-xl scale-[1.01]"
                      : addr.isDefault
                      ? "border-green-100 bg-[#ecfdf5]/20"
                      : "border-gray-100 bg-white hover:border-green-100"
                  }`}
                >
                  {editingId === addr.id ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                       <FloatingInput value={form.label || ""} onChange={v => setForm({ ...form, label: v })} label="Label" />
                       <FloatingInput value={form.addressLine1 || ""} onChange={v => setForm({ ...form, addressLine1: v })} label="Address" />
                       <div className="grid grid-cols-2 gap-3">
                         <FloatingInput value={form.city || ""} onChange={v => setForm({ ...form, city: v })} label="City" />
                         <FloatingInput value={form.pincode || ""} onChange={handlePincodeChange} label="Pincode" />
                       </div>
                       <div className="flex gap-2">
                         <button onClick={() => handleUpdateAddress(addr.id)} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Update</button>
                         <button onClick={() => { setEditingId(null); resetForm(); }} className="px-6 bg-white border border-gray-200 text-gray-400 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-4 items-start">
                        {/* Map Pin Circle Icon */}
                        <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                          <MapPin size={18} />
                        </div>
                        
                        <div className="flex-1 space-y-1 min-w-0">
                           <div className="flex items-center gap-2 flex-wrap">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">{addr.label}</span>
                             {addr.isDefault && <span className="bg-green-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Primary</span>}
                           </div>
                           <p className="font-bold text-gray-900 text-sm leading-snug break-words">{addr.addressLine1}</p>
                           <p className="text-gray-400 font-medium text-[11px]">{addr.city}, {addr.state} • {addr.pincode}</p>
                           {addr.phone && <p className="text-green-600/60 font-black text-[10px] pt-1 tracking-wider uppercase flex items-center gap-1">📞 {addr.phone}</p>}
                        </div>
                        
                        <div className="flex flex-col gap-1 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingId(addr.id); setForm(addr); }} className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition-all cursor-pointer"><Pencil size={13} /></button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all cursor-pointer"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {!editingId && (
          <div className="p-6 border-t border-gray-100 space-y-3 bg-gray-50/50 backdrop-blur-md">
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-sm tracking-tight flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
              SAVE PROFILE CHANGES
            </button>

            <button
              onClick={logout}
              className="w-full bg-white border-2 border-red-50 text-red-500 py-4 rounded-2xl font-black text-sm tracking-tight flex items-center justify-center gap-3 hover:bg-red-50 hover:border-red-100 transition-all group active:scale-95"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              LOGOUT FROM ACCOUNT
            </button>
          </div>
        )}
      </div>
    </>
  );
}