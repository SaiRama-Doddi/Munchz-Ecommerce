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
  MapPin
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
    }
  }, [profile, open]);

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
        
        {/* PREMIUM HEADER WITH AVATAR */}
        <div className="relative h-44 bg-green-600 shrink-0">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
            <h2 className="text-white font-black text-xl tracking-tight uppercase">My Profile</h2>
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-md">
              <X size={20} />
            </button>
          </div>

          <div className="absolute -bottom-8 left-8 flex items-end gap-4 z-20">
            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex items-center justify-center border-4 border-white text-green-600 font-black text-2xl tracking-tighter shrink-0">
               {profile.firstName?.charAt(0).toUpperCase()}{profile.lastName?.charAt(0).toUpperCase()}
            </div>
            <div className="mb-3">
               <h3 className="text-white font-black text-xl tracking-tight leading-none drop-shadow-sm">{profile.firstName} {profile.lastName}</h3>
               <p className="text-green-50 text-[10px] font-bold uppercase tracking-widest opacity-90 mt-1.5 flex items-center gap-1.5">
                 <div className="w-1 h-1 bg-white rounded-full"></div> {profile.email}
               </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pt-16 pb-8 space-y-8 scrollbar-hide">
          
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
                  className={`group relative border-2 rounded-[2rem] p-5 transition-all duration-300 ${
                    editingId === addr.id
                      ? "border-green-600 bg-white shadow-2xl scale-[1.02]"
                      : addr.isDefault
                      ? "border-green-100 bg-green-50/30"
                      : "border-gray-50 bg-white hover:border-green-100"
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
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">{addr.label}</span>
                             {addr.isDefault && <span className="bg-green-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Primary</span>}
                           </div>
                           <p className="font-bold text-gray-900 text-sm leading-snug">{addr.addressLine1}</p>
                           <p className="text-gray-400 font-medium text-[11px]">{addr.city}, {addr.state} • {addr.pincode}</p>
                           {addr.phone && <p className="text-green-600/60 font-black text-[10px] pt-1 tracking-wider uppercase">📞 {addr.phone}</p>}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingId(addr.id); setForm(addr); }} className="p-2 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition-all"><Pencil size={14} /></button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"><Trash2 size={14} /></button>
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