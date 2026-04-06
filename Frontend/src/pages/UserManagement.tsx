import { useState, useEffect } from "react";
import API from "../api/api";
import { Users, Shield, Mail, Trash2, UserPlus, Phone, Star, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";

interface Address {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

interface UserResponse {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  referralCode: string;
  roles: string[];
  provider: string;
  addresses: Address[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/auth/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to promote ${email} to Sub-Admin?`)) return;
    try {
      await API.post(`/auth/admin/users/${userId}/promote`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success(`${email} is now a Sub-Admin`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to promote user");
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!window.confirm(`WARNING: This will PERMANENTLY delete the account and profile for ${email}. Proceed?`)) return;
    try {
      await API.delete(`/auth/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const formatAddress = (addr: Address) => {
    return `${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === "ALL" || 
      (roleFilter === "ADMIN" && user.roles.includes("ADMIN")) ||
      (roleFilter === "SUB_ADMIN" && user.roles.includes("SUB_ADMIN")) ||
      (roleFilter === "USER" && !user.roles.includes("ADMIN") && !user.roles.includes("SUB_ADMIN"));

    const searchStr = (user.firstName + " " + user.lastName + " " + user.email).toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl text-black font-medium tracking-tight">User Directory</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Manage global user identities and delivery profiles</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border border-gray-200 text-xs rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all min-w-[200px]"
          />
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-gray-200 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
          >
            <option value="ALL">All Accounts</option>
            <option value="ADMIN">Super Admins</option>
            <option value="SUB_ADMIN">Sub-Admins</option>
            <option value="USER">Customers / Users</option>
          </select>

          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
             <Users className="text-emerald-500" size={20} />
             <span className="text-sm font-bold whitespace-nowrap">{filteredUsers.length} Users</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none">Identity</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none">Contact Info</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none">Referral</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none">Delivery Address</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none">Role Status</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-black font-bold text-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">
                          {user.firstName ? user.firstName[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black">{user.firstName} {user.lastName}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Mail size={12} className="text-gray-400" />
                            <span className="text-[11px] text-gray-500">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-emerald-500" />
                          <span className="text-xs text-black font-bold tracking-tight">{user.phone || "No Phone"}</span>
                        </div>
                        <span className="text-[9px] uppercase font-black text-gray-300 tracking-widest px-2 py-0.5 border border-gray-100 rounded bg-gray-50/50 w-fit block">{user.provider} IDENTITY</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {user.referralCode ? (
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100 w-fit">
                          <Star size={12} className="fill-emerald-700" />
                          <span className="text-[11px] font-black tracking-wider">{user.referralCode}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] italic text-gray-300">No code</span>
                      )}
                    </td>
                    <td className="px-8 py-6 max-w-xs">
                      {user.addresses && user.addresses.length > 0 ? (
                        <div className="space-y-2">
                          {user.addresses.map((addr) => (
                            <div key={addr.id} className={`p-3 rounded-2xl border text-[10px] leading-relaxed ${
                              addr.isDefault ? 'bg-emerald-50/30 border-emerald-100 text-emerald-800' : 'bg-gray-50/50 border-gray-100 text-gray-500'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold uppercase tracking-widest">{addr.label}</span>
                                {addr.isDefault && <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-black">DEFAULT</span>}
                              </div>
                              <p className="font-medium line-clamp-2">{formatAddress(addr)}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] italic text-gray-300">No addresses on profile</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((role) => (
                          <span key={role} className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg tracking-tighter ${
                            role === 'ADMIN' ? 'bg-black text-white' :
                            role === 'SUB_ADMIN' ? 'bg-orange-100 text-orange-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                             {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!user.roles.includes("ADMIN") && !user.roles.includes("SUB_ADMIN") && (
                          <button 
                            onClick={() => handlePromote(user.id, user.email)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all text-[10px] font-bold uppercase"
                          >
                             <Shield size={14} /> Promote
                          </button>
                        )}
                        
                        {!user.roles.includes("ADMIN") && (
                          <button 
                            onClick={() => handleDelete(user.id, user.email)}
                            className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-500/20"
                            title="Delete Account"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}

                        {user.roles.includes("ADMIN") && (
                          <span className="text-[10px] font-bold text-gray-300 italic uppercase">Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
