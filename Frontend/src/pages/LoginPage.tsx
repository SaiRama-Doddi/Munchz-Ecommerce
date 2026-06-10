import { useState } from "react";
import { sendLoginOtp, googleLogin } from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

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
      if (err.response?.status === 404) {
        setError("Email not exists. Please signup.");
      } else {
        setError(err.response?.data?.message || "Failed to send OTP. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f8f2] flex items-center justify-center px-4 py-8 md:py-16 font-sans">
      
      {/* SPLIT WRAPPER */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-stretch justify-center gap-6 transition-all duration-300">
        
        {/* Left Column: Image and Marketing Banner */}
        <div className="md:w-1/2 w-full relative rounded-[2rem] overflow-hidden bg-[#e4edd4] border border-green-100/30 shadow-[0_20px_50px_rgba(22,101,52,0.03)] flex flex-col justify-between p-8 min-h-[360px] md:h-[620px]">
          <img 
            src="/images/auth_banner.png" 
            alt="Munchz Premium Quality" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#eaf2e8]/20 via-transparent to-black/35" />
          
          <div className="absolute inset-0 p-8 flex flex-col justify-between text-left select-none z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-green-700 text-[10px] font-black uppercase tracking-wider shadow-sm mb-4">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> 100% Natural & Premium Quality
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-none mb-3">
                Good Food <br />
                Good Health <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Good Life</span>
              </h1>
              <p className="text-gray-500 text-[11px] font-semibold leading-relaxed max-w-xs">
                100% natural and premium quality products delivered to your doorstep.
              </p>
            </div>

            <div className="space-y-3 hidden sm:block">
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xs p-2.5 rounded-2xl border border-white/50 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-green-600 shrink-0">
                  <span className="text-xs font-black">🍃</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider leading-none mb-0.5">100% Natural</h4>
                  <p className="text-[10px] text-gray-400 font-bold">No artificial ingredients</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xs p-2.5 rounded-2xl border border-white/50 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-green-600 shrink-0">
                  <span className="text-xs font-black">⭐</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider leading-none mb-0.5">Premium Quality</h4>
                  <p className="text-[10px] text-gray-400 font-bold">Carefully sourced products</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xs p-2.5 rounded-2xl border border-white/50 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-green-600 shrink-0">
                  <span className="text-xs font-black">🚚</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider leading-none mb-0.5">Fast Delivery</h4>
                  <p className="text-[10px] text-gray-400 font-bold">Free shipping on orders above Rs 799</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Card */}
        <div className="md:w-1/2 w-full p-6 sm:p-8 flex flex-col justify-center bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(22,101,52,0.05)] border border-green-100/30 md:h-[620px] overflow-y-auto scrollbar-hide">
          <div className="max-w-md mx-auto w-full space-y-4">
            
            {/* LOGO & HEADER */}
            <div className="flex flex-col items-center text-center">
              <img
                src="https://res.cloudinary.com/dd4oiwnep/image/upload/f_auto,q_auto/v1774178657/gomunchz_logo_transparent_r8r0a8.png"
                alt="GoMunchz"
                className="w-16 mb-1 cursor-pointer object-contain"
                onClick={() => navigate("/")}
              />
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
                Welcome Back!
              </h2>
              <p className="text-[11px] text-gray-500 font-semibold">
                Login to your GoMunchz account
              </p>
            </div>

            {/* Email Input */}
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">✉️</span>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-8 pr-4 py-2.5 bg-gray-50/20 border rounded-xl focus:bg-white focus:ring-4 focus:ring-green-600/5 outline-none text-xs font-semibold text-gray-800 transition-all
                ${error ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-green-600"}`}
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-xl font-bold flex flex-wrap items-center gap-1">
                <span>⚠️ {error}</span>
                {error.includes("signup") && (
                  <span
                    onClick={() => navigate("/signup")}
                    className="text-green-700 font-bold hover:underline cursor-pointer ml-1"
                  >
                    Signup
                  </span>
                )}
              </p>
            )}

            {/* OTP Button */}
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-600/10 hover:shadow-xl hover:shadow-green-600/20 transition-all duration-200 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                "Send OTP"
              )}
            </button>

            {/* SIGN UP LINK */}
            <p className="text-xs text-center text-gray-500 pt-2">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-green-700 font-bold hover:underline cursor-pointer ml-1"
              >
                Sign up
              </span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
