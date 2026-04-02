import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, User, FileText, Activity, Layers, ShoppingBag, Package, Search, Filter } from "lucide-react";
import { toast } from "react-hot-toast";

interface AuditLog {
  id: string;
  subAdminId: string;
  subAdminEmail: string;
  action: string;
  module: string;
  targetId: string;
  details: string;
  timestamp: string;
}

const MODULE_ICONS: Record<string, any> = {
  CATEGORY: Layers,
  PRODUCT: ShoppingBag,
  ORDER: FileText,
  STOCK: Package,
  COUPON:Activity,
  REVIEW: Activity
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("/subadmin/activities");
      if (Array.isArray(res.data)) {
        setLogs(res.data);
      } else {
        console.error("Invalid activity logs data format:", res.data);
        setLogs([]);
      }
    } catch (err) {
      toast.error("Failed to fetch activity logs");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.subAdminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl text-black">System Audit Logs</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Real-time Sub-Admin activity tracking</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search logs (Email, Module, Action)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-inter"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-gray-400">
            <Activity className="opacity-10 mb-4" size={64} />
            <p>No activity logs found for the search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-600/5">
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-emerald-800/60 tracking-widest italic border-b border-emerald-600/10">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-emerald-800/60 tracking-widest italic border-b border-emerald-600/10">Sub-Admin</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-emerald-800/60 tracking-widest italic border-b border-emerald-600/10">Module</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-emerald-800/60 tracking-widest italic border-b border-emerald-600/10">Action</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-emerald-800/60 tracking-widest italic border-b border-emerald-600/10">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(filteredLogs || []).map((log) => {
                  const Icon = MODULE_ICONS[log.module] || FileText;
                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Clock size={14} className="text-gray-300" />
                          <span className="text-[11px] font-bold text-gray-600 tabular-nums">
                            {new Date(log.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-emerald-600 shadow-sm">
                            <User size={14} />
                          </div>
                          <span className="text-xs font-bold text-black">{log.subAdminEmail}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-emerald-600" />
                          <span className="text-[10px] uppercase tracking-widest font-black text-emerald-900/40 italic">{log.module}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] px-3 py-1 rounded-lg uppercase font-black tracking-widest ${
                          log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-700' :
                          log.action === 'UPDATE' ? 'bg-orange-50 text-orange-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs text-black font-medium">{log.details}</span>
                          <span className="text-[9px] text-gray-400 mt-1 uppercase">ID: #{log.targetId?.slice(0, 8)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
