import { useState } from "react";
import { registerUser, googleRegister } from "../api/api";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, ArrowRight } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName.trim()) return setError("First name is required");
    if (!lastName.trim()) return setError("Last name is required");
    if (!email.trim()) return setError("Email is required");
    if (!isValidEmail(email)) return setError("Invalid email architecture");
    if (!phone.trim()) return setError("Phone number is required");
    if (!isValidPhone(phone)) return setError("Invalid 10-digit mobile sequence");

    try {
      setLoading(true);
      const res = await registerUser({ firstName, lastName, email, phone });
      setSuccess("Account initialization successful! 🎉");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration sequence failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-white relative overflow-hidden">
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="premium-card bg-white rounded-[3rem] p-10 lg:p-14 border border-gray-50 shadow-2xl shadow-emerald-900/5">
          
          <div className="text-center mb-12">
            <img src="/munchz.png" alt="GoMunchZ" className="w-20 mx-auto mb-8 hover:scale-110 transition-transform duration-500" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-6 bg-emerald-600"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Protocol Initialization</p>
              <span className="h-px w-6 bg-emerald-600"></span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Create <span className="text-emerald-600 italic">Identity</span></h1>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="w-full shadow-premium-soft rounded-2xl overflow-hidden border border-gray-100 p-0.5 hover:border-emerald-200 transition-colors bg-white">
                <GoogleLogin
                  onSuccess={async (res) => {
                    try {
                      const apiRes = await googleRegister(res.credential!);
                      localStorage.setItem("token", apiRes.data.token);
                      setSuccess("Account identified! Proceeding...");
                      setTimeout(() => navigate("/login"), 1500);
                    } catch {
                      setError("Google Protocol Failure");
                    }
                  }}
                  onError={() => setError("Google Protocol Failure")}
                  width="100%"
                />
              </div>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-50"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Manual Entry Sequence</span>
              <div className="flex-grow border-t border-gray-50"></div>
            </div>

            {(error || success) && (
              <div className={`p-4 rounded-2xl border text-center animate-fadeIn ${error ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                <p className="text-[11px] font-black uppercase tracking-widest leading-loose">{error || success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors"><User size={18} /></div>
                  <input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-15 pl-14 pr-6 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none font-bold text-[13px] focus:bg-white focus:border-emerald-500 transition-all" />
                </div>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors"><User size={18} /></div>
                  <input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-15 pl-14 pr-6 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none font-bold text-[13px] focus:bg-white focus:border-emerald-500 transition-all" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors"><Mail size={18} /></div>
                  <input type="email" placeholder="Communication Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-16 pl-14 pr-6 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none font-bold text-[13px] focus:bg-white focus:border-emerald-500 transition-all" />
                </div>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors"><Phone size={18} /></div>
                  <input type="tel" placeholder="Mobile Sequence" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} maxLength={10} className="w-full h-16 pl-14 pr-6 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none font-bold text-[13px] focus:bg-white focus:border-emerald-500 transition-all" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full h-20 bg-black text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-50 shadow-xl shadow-black/10 mt-4 active:scale-95">
                {loading ? <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Finalize Registration <ArrowRight size={16} className="text-emerald-400 group-hover:translate-x-2 transition-transform" /></>}
              </button>
            </form>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Already familiar?</p>
            <button onClick={() => navigate("/login")} className="text-[11px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors">Access Vault</button>
          </div>
        </div>

        <p className="text-center mt-8 text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">Authorized Protocol • Encrypted Registration Flow</p>
      </div>
    </div>
  );
}
