import { useState, useEffect, useRef } from "react";
import { confirmLoginOtp, sendResendOtp } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

export default function OtpPage() {
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(50);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputsRef = useRef<HTMLInputElement[]>([]);
  const { setProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasteData.length === 6) {
      setOtp(pasteData.split(""));
      inputsRef.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) return;
    setLoading(true);
    try {
      const res = await confirmLoginOtp(email, enteredOtp);
      const profile = res.data.profile;
      const roles: string[] = res.data.roles;
      setProfile(profile);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("roles", JSON.stringify(roles));
      if (roles.includes("ADMIN")) navigate("/admin/dashboard", { replace: true });
      else navigate("/", { replace: true });
    } catch {
      alert("Invalid Authorization Key");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await sendResendOtp(email);
      setOtp(Array(6).fill(""));
      setTimer(50);
      inputsRef.current[0]?.focus();
    } catch {
      alert("Resend sequence failed");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 relative overflow-hidden bg-white">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-emerald-50 rounded-full blur-[150px] opacity-40"></div>
      </div>

      <div className="w-full max-w-md relative z-10 text-center">
        <div className="premium-card bg-white rounded-[3rem] p-10 lg:p-14 border border-gray-50 shadow-2xl shadow-emerald-900/5">
          
          <div className="mb-12">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <ShieldCheck size={40} strokeWidth={1.5} />
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-6 bg-emerald-600"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Authorization</p>
              <span className="h-px w-6 bg-emerald-600"></span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Enter <span className="text-emerald-600 italic">Signature</span></h1>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-4">Transmitted to {email}</p>
          </div>

          <div onPaste={handlePaste} className="flex justify-between gap-3 mb-10">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { if (el) inputsRef.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-16 border-2 border-gray-100 rounded-2xl text-center text-xl font-black text-gray-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all bg-gray-50/50 focus:bg-white sm:w-14"
              />
            ))}
          </div>

          <div className="space-y-8">
            <button
              onClick={handleVerify}
              disabled={loading || otp.join("").length !== 6}
              className="w-full h-18 bg-black text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-50 shadow-xl shadow-black/10 active:scale-95"
            >
              {loading ? <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Verify Signature <ArrowRight size={16} className="text-emerald-400 group-hover:translate-x-2 transition-transform" /></>}
            </button>

            <button
              onClick={handleResendOtp}
              disabled={timer > 0 || resendLoading}
              className={`flex items-center justify-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest transition-colors ${timer > 0 ? 'text-gray-300' : 'text-emerald-600 hover:text-emerald-800'}`}
            >
              <RefreshCw size={14} className={resendLoading ? "animate-spin" : ""} />
              {timer > 0 ? `Retry transmission in ${timer}s` : "Retry transmission"}
            </button>
          </div>
        </div>

        <p className="mt-10 text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">Signature Verification Required • Secure Session</p>
      </div>
    </div>
  );
}
