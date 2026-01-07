import { X, LogOut, Save, User, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfileApi, listAddressesApi, addAddressApi } from "../api/api";
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
  mobile?: string;
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

  /* ---------- ADDRESSES ---------- */
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);

  /* ---------- NEW ADDRESS FORM ---------- */
  const [label, setLabel] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressMobile, setAddressMobile] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (profile && open) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setMobile(profile.mobile || "");
    }
  }, [profile, open]);

useEffect(() => {
  if (open && profile) {
    listAddressesApi()
      .then(res => setAddresses(res.data))
      .catch(err => {
        console.error("Address fetch failed", err);
        setAddresses([]);
      });
  }
}, [open, profile]);


  if (!open || !profile) return null;

  /* ================= HANDLERS ================= */

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const res = await updateProfileApi({
        firstName,
        lastName,
        mobile,
      });

      updateProfile({ ...profile, ...res.data });
      onClose();
    } catch {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      await addAddressApi({
        label,
        addressLine1,
        addressLine2,
        city,
        state: stateName,
        country: "India",
        pincode,
        mobile: addressMobile,
        isDefault,
      });

      const res = await listAddressesApi();
      setAddresses(res.data);

      setShowAddressForm(false);

      // reset form
      setLabel("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setStateName("");
      setPincode("");
      setAddressMobile("");
      setIsDefault(false);
    } catch {
      alert("Failed to add address");
    }
  };

  /* ================= UI ================= */

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-[380px] bg-white z-50 shadow-2xl
        transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">My Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center py-6 border-b">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <User className="text-green-600" size={28} />
          </div>
          <p className="mt-3 font-medium">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 px-6 py-5 space-y-4 overflow-y-auto">

          {/* Profile Fields */}
          <FloatingInput
            value={firstName}
            onChange={setFirstName}
            icon={<User size={18} />}
           
          />

          <FloatingInput
            value={lastName}
            onChange={setLastName}
            icon={<User size={18} />}
           
          />

          <FloatingInput
            value={mobile}
            onChange={setMobile}
            icon={<Phone size={18} />}
           
            helperText="Used for account recovery"
          />

          <FloatingInput
            value={profile.email || ""}
            icon={<Mail size={18} />}
            
            readOnly
            helperText="Email cannot be changed"
          />

          {/* ================= ADDRESSES ================= */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Saved Addresses</h3>

            {addresses.length === 0 && (
              <p className="text-sm text-gray-500">No addresses added yet</p>
            )}

            {addresses.map(addr => (
              <div
                key={addr.id}
                className={`border rounded-lg p-3 mb-2 ${
                  addr.isDefault ? "border-green-500 bg-green-50" : ""
                }`}
              >
                <p className="font-medium">{addr.label}</p>
                <p className="text-sm text-gray-600">
                  {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                {addr.mobile && (
                  <p className="text-sm text-gray-500">📞 {addr.mobile}</p>
                )}
                {addr.isDefault && (
                  <span className="text-xs text-green-600 font-medium">
                    Default Address
                  </span>
                )}
              </div>
            ))}

            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-green-600 text-sm mt-2"
            >
              {showAddressForm ? "Cancel" : "+ Add New Address"}
            </button>

            {showAddressForm && (
              <div className="mt-4 space-y-3 border rounded-lg p-4 bg-gray-50">
                <FloatingInput value={label} onChange={setLabel} label="Label (Home / Office)" />
                <FloatingInput value={addressLine1} onChange={setAddressLine1} label="Address Line 1" />
                <FloatingInput value={addressLine2} onChange={setAddressLine2} label="Address Line 2" />
                <FloatingInput value={city} onChange={setCity} label="City" />
                <FloatingInput value={stateName} onChange={setStateName} label="State" />
                <FloatingInput value={pincode} onChange={setPincode} label="Pincode" />
                <FloatingInput value={addressMobile} onChange={setAddressMobile} label="Mobile (optional)" />

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={e => setIsDefault(e.target.checked)}
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
            )}
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="border-t px-6 py-4 space-y-3">
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg font-medium transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
