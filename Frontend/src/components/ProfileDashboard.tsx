import {
  X,
  LogOut,
  Save,
  User,
  Phone,
  Mail,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  updateProfileApi,
  listAddressesApi,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
} from "../api/api";
import FloatingInput from "../components/FloatingInput";

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
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-[380px] bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between px-6 py-4 border-b">
          <h2 className="font-semibold">My Profile</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

          {/* Profile */}
          <FloatingInput value={firstName} onChange={setFirstName} label="First Name" icon={<User size={16} />} />
          <FloatingInput value={lastName} onChange={setLastName} label="Last Name" icon={<User size={16} />} />
          <FloatingInput value={mobile

          } onChange={setMobile} label="Mobile" icon={<Phone size={16} />} />
          <FloatingInput value={profile.email || ""} readOnly label="Email" icon={<Mail size={16} />} />

          {/* Addresses */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Saved Addresses</h3>

            {addresses.length === 0 && (
              <p className="text-sm text-gray-500">No addresses added</p>
            )}

            {addresses.map(addr => (
              <div
                key={addr.id}
                className={`border rounded-lg p-3 mb-3 relative transition ${
  editingId === addr.id
    ? "border-green-600 bg-green-50 shadow-lg"
    : addr.isDefault
    ? "border-green-500 bg-green-50"
    : ""
}`}

              >
                {editingId === addr.id ? (
                  <>
                    {/* EDIT FORM */}
                    <div className="space-y-2">
                      <FloatingInput value={form.label || ""} onChange={v => setForm({ ...form, label: v })} label="Label" />
                      <FloatingInput value={form.addressLine1 || ""} onChange={v => setForm({ ...form, addressLine1: v })} label="Address Line 1" />
                      <FloatingInput value={form.addressLine2 || ""} onChange={v => setForm({ ...form, addressLine2: v })} label="Address Line 2" />

                      <div className="grid grid-cols-2 gap-2">
                        <FloatingInput value={form.city || ""} onChange={v => setForm({ ...form, city: v })} label="City" />
                        <FloatingInput value={form.state || ""} onChange={v => setForm({ ...form, state: v })} label="State" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <FloatingInput value={form.country || ""} onChange={v => setForm({ ...form, country: v })} label="Country" />
                        <FloatingInput value={form.pincode || ""} onChange={v => setForm({ ...form, pincode: v })} label="Pincode" />
                      </div>

                      <FloatingInput value={form.phone || ""} onChange={v => setForm({ ...form, phone: v })} label="Mobile (optional)" />

                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={form.isDefault || false}
                          onChange={e => setForm({ ...form, isDefault: e.target.checked })}
                        />
                        Set as default address
                      </label>

                      <div className="flex gap-2">
                        <button
  onClick={() => handleUpdateAddress(addr.id)}
  className="flex-1 bg-green-700 text-white py-2 rounded-lg font-medium shadow"
>
  Update Address
</button>

                        <button
                          onClick={() => {
                            setEditingId(null);
                            resetForm();
                          }}
                          className="flex-1 border py-1.5 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* VIEW MODE */}
                    <p className="font-medium flex items-center gap-2">
                      {addr.label}
                      {addr.isDefault && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </p>

                    <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>{addr.city}, {addr.state}</p>
                      <p>{addr.country} – {addr.pincode}</p>
                      {addr.phone && <p>📞 {addr.phone}</p>}
                    </div>

                    <div className="absolute top-3 right-3 flex gap-2">
                      <Pencil
                        size={16}
                        onClick={() => {
                          setEditingId(addr.id);
                        setForm({
  label: addr.label,
  addressLine1: addr.addressLine1,
  addressLine2: addr.addressLine2,
  city: addr.city,
  state: addr.state,
  country: addr.country,
  pincode: addr.pincode,
  phone: addr.phone ?? "",
  isDefault: addr.isDefault,
});

                        }}
                        className="cursor-pointer"
                      />
                      <Trash2
                        size={16}
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="cursor-pointer text-red-600"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* ADD ADDRESS */}
            {showAddForm ? (
              <div className="mt-3 space-y-2 border rounded-lg p-4 bg-gray-50">
                <FloatingInput value={form.label || ""} onChange={v => setForm({ ...form, label: v })} label="Label" />
                <FloatingInput value={form.addressLine1 || ""} onChange={v => setForm({ ...form, addressLine1: v })} label="Address Line 1" />
                <FloatingInput value={form.addressLine2 || ""} onChange={v => setForm({ ...form, addressLine2: v })} label="Address Line 2" />

                <div className="grid grid-cols-2 gap-2">
                  <FloatingInput value={form.city || ""} onChange={v => setForm({ ...form, city: v })} label="City" />
                  <FloatingInput value={form.state || ""} onChange={v => setForm({ ...form, state: v })} label="State" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FloatingInput value={form.country || ""} onChange={v => setForm({ ...form, country: v })} label="Country" />
                  <FloatingInput value={form.pincode || ""} onChange={v => setForm({ ...form, pincode: v })} label="Pincode" />
                </div>

                <FloatingInput value={form.phone || ""} onChange={v => setForm({ ...form, phone: v })} label="Mobile (optional)" />

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isDefault || false}
                    onChange={e => setForm({ ...form, isDefault: e.target.checked })}
                  />
                  Set as default address
                </label>

                <button
                  onClick={handleAddAddress}
                  className="w-full bg-green-600 text-white py-2 rounded-lg"
                >
                  Save Address
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="text-green-600 text-sm mt-2"
              >
                + Add New Address
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
       {/* Footer */}
{!editingId && (
  <div className="border-t px-6 py-4 space-y-2">
    <button
      onClick={handleSaveProfile}
      disabled={loading}
      className="w-full bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
    >
      <Save size={18} />
      Save Changes
    </button>

    <button
      onClick={logout}
      className="w-full flex items-center justify-center gap-2 text-red-600 py-2 rounded-lg"
    >
      <LogOut size={18} />
      Logout
    </button>
  </div>
)}

      </div>
    </>
  );
}