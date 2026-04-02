import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, Mail, ArrowRight, Lock } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SubAdminOtpVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      toast.error("Email is missing. Please check your link.");
    }
  }, [email]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const otpCode = otp.join("");
    
    try {
      await axios.post("/subadmin/verify-activation", { email, otp: otpCode });
      toast.success("Account activated! You can now log in.");
      navigate("/login?type=subadmin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-inter">
      <div className="w-full max-w-md animate-scaleIn">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-600/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-600/20 rotate-3">
                <ShieldCheck size={40} />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold text-black mb-2">Verify Your Account</h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Mail size={12} className="text-emerald-600" />
                OTP sent to {email}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-between gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    className="w-12 h-14 bg-gray-50 border border-gray-100 rounded-xl text-center text-xl font-bold text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                ))}
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 flex items-start gap-4">
                <Lock size={18} className="text-emerald-600 mt-1 shrink-0" />
                <p className="text-[10px] text-emerald-800 leading-relaxed uppercase tracking-wider">
                  For security, this code will expire in <span className="font-bold">5 minutes</span>. 
                  Check your spam folder if you don't see it.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length < 6}
                className="w-full bg-emerald-600 text-white flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] uppercase font-black shadow-xl shadow-emerald-600/20 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Verifying..." : (
                  <>
                    <span>Activate Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-10 text-center text-[10px] text-gray-400 uppercase tracking-widest">
              Didn't receive code? <button className="text-emerald-600 font-bold hover:underline">Resend OTP</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
