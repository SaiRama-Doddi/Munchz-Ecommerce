import { X, LogOut, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfileApi } from "../api/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDashboard({ open, onClose }: Props) {
  const { profile, updateProfile, logout } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ SYNC PROFILE → FORM
  useEffect(() => {
    if (profile && open) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setMobile(profile.mobile || "");
    }
  }, [profile, open]);

  if (!open || !profile) return null;
const handleSave = async () => {
  try {
    setLoading(true);

    const res = await updateProfileApi({
      firstName,
      lastName,
      mobile,
    });

    updateProfile({
      ...profile!,        //  keep email + phone
      ...res.data,        //  update names
    });

    onClose();
  } catch {
    alert("Failed to update profile");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-[360px] bg-white z-50 shadow-xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">My Profile</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600">First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Mobile</label>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* READ-ONLY EMAIL */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              value={profile.email || ""}
              disabled
              className="w-full bg-gray-100 border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Logout at bottom */}
        <div className="border-t p-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-red-600 font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
