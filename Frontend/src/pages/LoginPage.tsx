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
    <div className="bg-[#f3f8f2] flex items-center justify-center px-4 py-6 md:py-10 font-sans">
      
      {/* SPLIT WRAPPER */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-6 transition-all duration-300">
        
        {/* Left Column: Premium Marketing Banner */}
        <div className="md:w-1/2 w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(22,101,52,0.05)] border border-green-100/30 overflow-hidden flex items-stretch">
          <img 
            src="https://res.cloudinary.com/dxfdcmxze/image/upload/v1781106349/login_page_nw50ib.png" 
            alt="Munchz Premium Quality" 
            className="w-full h-auto aspect-[1308/1203] md:aspect-auto md:h-full object-cover"
          />
        </div>

        {/* Right Column: Form Card */}
        <div className="md:w-1/2 w-full p-6 sm:p-10 flex flex-col justify-center bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(22,101,52,0.05)] border border-green-100/30">
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
