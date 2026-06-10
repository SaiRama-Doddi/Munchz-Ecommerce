
import { useState, useEffect, useRef } from "react";
import { confirmLoginOtp, sendResendOtp } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

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

  /* redirect if email missing */
  useEffect(() => {
    if (!email) {
      alert("Session expired. Please login again.");
      window.location.replace("/login");
    }
  }, [email]);

  /* countdown timer */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* OTP typing */
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  /* backspace navigation */
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* paste OTP */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pasteData.length === 6) {
      setOtp(pasteData.split(""));
      inputsRef.current[5]?.focus();
    }
  };

  /* verify OTP */
  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Enter full 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await confirmLoginOtp(email, enteredOtp);

      const profile = res.data.profile;
      const roles: string[] = res.data.roles;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("roles", JSON.stringify(roles));

      // Decode JWT and store permissions if present
      let userPermissions: any = {};
      try {
        const payload = JSON.parse(atob(res.data.token.split('.')[1]));
        if (payload.permissions) {
          localStorage.setItem("permissions", payload.permissions);
          userPermissions = JSON.parse(payload.permissions);
        }
      } catch (e) {
        console.error("Token decoding failed", e);
      }

      setProfile(profile);
      alert("Login successful!");

      if (roles.includes("ADMIN")) {
        navigate("/admin/dashboard", { replace: true });
      } else if (roles.includes("SUB_ADMIN")) {
        // Dynamic Redirect for Sub-Admins based on permissions
        const firstModule = Object.keys(userPermissions).find(m => userPermissions[m]?.length > 0);
        
        if (firstModule === "DASHBOARD") navigate("/admin/dashboard", { replace: true });
        else if (firstModule === "CATEGORIES") navigate("/admin/category", { replace: true });
        else if (firstModule === "PRODUCTS") navigate("/admin/products", { replace: true });
        else if (firstModule === "ORDERS") navigate("/admin/orders", { replace: true });
        else if (firstModule === "PAYMENTS") navigate("/admin/payments", { replace: true });
        else if (firstModule === "STOCKS") navigate("/admin/inventory", { replace: true });
        else if (firstModule === "COUPONS") navigate("/admin/coupons", { replace: true });
        else if (firstModule === "REVIEWS") navigate("/admin/reviews", { replace: true });
        else if (firstModule === "USER_MANAGEMENT") navigate("/admin/sub-admins", { replace: true });
        else navigate("/", { replace: true }); // Fallback to Storefront if NO admin access
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      alert("Invalid OTP or server error");
    } finally {
      setLoading(false);
    }
  };

  /* resend OTP */
  const handleResendOtp = async () => {
    setResendLoading(true);

    try {
      await sendResendOtp(email);

      alert("OTP resent successfully");

      setOtp(Array(6).fill(""));
      setTimer(50);
      inputsRef.current[0]?.focus();
    } catch {
      alert("Failed to resend OTP");
    }

    setResendLoading(false);
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

        {/* Right Column: OTP Card */}
        <div className="md:w-1/2 w-full p-6 sm:p-8 flex flex-col justify-center bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(22,101,52,0.05)] border border-green-100/30 md:h-[620px] overflow-y-auto scrollbar-hide">
          <div className="max-w-md mx-auto w-full space-y-4 text-center">
            
            {/* Logo */}
            <img 
              src="https://res.cloudinary.com/dd4oiwnep/image/upload/f_auto,q_auto/v1774178657/gomunchz_logo_transparent_r8r0a8.png" 
              className="w-16 mx-auto mb-1 cursor-pointer object-contain" 
              onClick={() => navigate("/")}
            />

            <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">Enter OTP</h2>
            <p className="text-[11px] text-gray-500 font-semibold mb-6">
              OTP sent to {email}
            </p>

            {/* OTP INPUTS */}
            <div
              className="flex justify-between gap-2 max-w-xs mx-auto mt-4"
              onPaste={handlePaste}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    if (el) inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-10 h-12 border border-gray-200 rounded-xl text-center text-lg font-black focus:outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/5 transition-all"
                />
              ))}
            </div>

            <p className="text-gray-400 text-[10px] font-bold mt-4">
              OTP sent to your registered email
            </p>

            {/* RESEND OTP */}
            <button
              onClick={handleResendOtp}
              disabled={timer > 0 || resendLoading}
              className={`mt-2 text-xs font-bold transition-colors block mx-auto
              ${
                timer > 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-green-700 hover:text-green-800 cursor-pointer"
              }`}
            >
              {resendLoading
                ? "Resending..."
                : timer > 0
                ? `Resend OTP in ${timer}s`
                : "Resend OTP"}
            </button>

            {/* LOGIN BUTTON */}
            <button
              onClick={handleVerify}
              disabled={loading}
              className={`w-full py-3.5 rounded-xl mt-6 font-bold text-xs uppercase tracking-wider
              flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg
              ${
                loading
                  ? "bg-green-500 cursor-not-allowed opacity-60 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-green-600/10 hover:shadow-xl hover:shadow-green-600/20"
              }`}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                "Login"
              )}
            </button>

            <span
              onClick={() => navigate("/signup")}
              className="text-green-700 text-xs font-bold block mt-4 hover:underline cursor-pointer"
            >
              Sign up
            </span>

          </div>
        </div>

      </div>
    </div>
  );
}

