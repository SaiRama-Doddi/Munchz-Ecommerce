import { useState } from "react";
import { sendLoginOtp, googleLogin } from "../api/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { ArrowRight, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSendOtp = async () => {
    if (!email) return setError("Email is required");
    if (!isValidEmail(email)) return setError("Please enter a valid email");

    setError("");
    setLoading(true);

    try {
      await sendLoginOtp(email);
      navigate("/otp", { state: { email } });
    } catch (err: any) {
      if (
        err.response?.status === 404 &&
        err.response?.data?.message?.includes("signup")
      ) {
        setError("Account not found. Please join our community.");
      } else {
        setError("Unable to process request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 relative overflow-hidden bg-white">
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="premium-card bg-white rounded-[2.5rem] p-10 lg:p-12 border border-gray-50 shadow-2xl shadow-emerald-900/5">
          
          {/* LOGO & WELCOME */}
          <div className="text-center mb-12">
            <img
              src="/munchz.png"
              alt="GoMunchZ"
              className="w-20 mx-auto mb-8 hover:scale-110 transition-transform duration-500"
            />
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-6 bg-emerald-600"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Welcome Back</p>
              <span className="h-px w-6 bg-emerald-600"></span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Access Your <span className="text-emerald-600 italic">Vault</span></h1>
          </div>

          <div className="space-y-8">
            {/* GOOGLE LOGIN */}
            <div className="flex justify-center">
              <div className="w-full shadow-premium-soft rounded-2xl overflow-hidden border border-gray-100 p-0.5 hover:border-emerald-200 transition-colors bg-white">
                <GoogleLogin
                  onSuccess={async (res) => {
                    try {
                      const apiRes = await googleLogin(res.credential!);
                      localStorage.setItem("token", apiRes.data.token);
                      localStorage.setItem("userId", apiRes.data.userId);
                      navigate("/");
                    } catch (err: any) {
                      setError(err.response?.data?.message || "Google Authentication Failed");
                    }
                  }}
                  onError={() => setError("Google Authentication Failed")}
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-50"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Secure Email Entry</span>
              <div className="flex-grow border-t border-gray-50"></div>
            </div>

            {/* EMAIL INPUT */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full h-16 pl-14 pr-6 rounded-2xl border ${error ? 'border-red-200' : 'border-gray-100'} bg-gray-50/50 outline-none font-bold text-[14px] focus:bg-white focus:border-emerald-500 transition-all shadow-inner`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl animate-fadeIn">
                  <p className="text-red-600 text-[11px] font-bold uppercase tracking-widest text-center">
                    {error}
                  </p>
                </div>
              )}

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full h-16 bg-black text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-50 shadow-xl shadow-black/10 active:scale-95"
              >
                {loading ? (
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Authorize Access
                    <ArrowRight size={16} className="text-emerald-400 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">New to GoMunchZ?</p>
            <button
              onClick={() => navigate("/signup")}
              className="text-[11px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              Initialize New Account
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">
          Authorized Access Only • Secure 256-Bit Encryption
        </p>
      </div>
    </div>
  );
}
