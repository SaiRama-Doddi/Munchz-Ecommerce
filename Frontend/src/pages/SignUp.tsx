import { useState } from "react";
import { registerUser, googleRegister, confirmLoginOtp, sendLoginOtp } from "../api/api";
import { GoogleLogin } from "@react-oauth/google";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate(); 
  const [searchParams] = useSearchParams();
  const referralFromUrl = searchParams.get("ref") || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState(referralFromUrl);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // ✅ Validators
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone: string) =>
    /^[6-9]\d{9}$/.test(phone); // Indian mobile numbers

  // ✅ NORMAL SIGNUP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName.trim()) return setError("First name is required");
    if (!lastName.trim()) return setError("Last name is required");
    if (!email.trim()) return setError("Email is required");
    if (!isValidEmail(email)) return setError("Enter a valid email address");
    if (!phone.trim()) return setError("Phone number is required");
    if (!isValidPhone(phone))
      return setError("Enter a valid 10-digit mobile number");

    try {
      setLoading(true);

      const res = await registerUser({
        firstName,
        lastName,
        email,
        phone,
        referralCode
      });

      // 🔥 Explicitly trigger OTP send since /register only sends welcome mail
      try {
        await sendLoginOtp(email);
        setSuccess("Account created! OTP sent to your email! 🎉");
      } catch (otpErr) {
        console.error("Failed to send OTP:", otpErr);
        setSuccess("Account created, but OTP failed to send. Please use Login to try again.");
      }
      
      setStep("otp");
    }
    catch (err: any) {
  console.log("Error:", err.response);

  if (err.response?.status === 409) {
    setError(err.response.data.message);
  } else if (err.response?.data?.message) {
    setError(err.response.data.message);
  } else {
    setError("Something went wrong. Please try again.");
  }
}


  finally {
    setLoading(false);
  }
};

const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length < 4) {
      return setError("Please enter a valid OTP");
    }

    try {
      setIsVerifying(true);
      const res = await confirmLoginOtp(email, otp);
      
      // Save tokens & profile
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("profile", JSON.stringify(res.data.profile));

      setSuccess("Verification successful! Redirecting...");
      
      setTimeout(() => {
        navigate("/");
        window.location.reload(); 
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f3f8f2] flex items-start justify-center px-4 py-4 md:py-8 font-sans">
      
      {/* SPLIT WRAPPER */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-6 transition-all duration-300">
        
        {/* Left Column: Premium Marketing Banner */}
        <div className="md:w-1/2 w-full flex items-center justify-center">
          <img 
            src="https://res.cloudinary.com/dxfdcmxze/image/upload/v1781106350/sign_in_page_f6ltoz.png" 
            alt="Munchz Premium Quality" 
            className="w-full h-auto rounded-[2rem] shadow-[0_20px_50px_rgba(22,101,52,0.03)] border border-green-100/30 object-contain"
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
              <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">
                {step === "form" ? "Create Account" : "Verify Email"}
              </h2>
              <p className="text-[11px] text-gray-500 font-semibold">
                {step === "form" ? "Join GoMunchz and start shopping" : `Enter the OTP sent to ${email}`}
              </p>
            </div>

            {/* ALERTS */}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-xl font-bold flex items-center gap-2">
                ⚠️ {error}
              </p>
            )}

            {success && (
              <p className="text-xs text-green-700 bg-green-50 border border-green-100 p-2.5 rounded-xl font-bold flex items-center gap-2">
                🎉 {success}
              </p>
            )}

            {step === "form" ? (
              <form className="space-y-3" onSubmit={handleSubmit}>
                
                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative group">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">👤</span>
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50/20 border border-gray-200 focus:bg-white rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-600/5 outline-none text-xs font-semibold text-gray-800 transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">👤</span>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50/20 border border-gray-200 focus:bg-white rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-600/5 outline-none text-xs font-semibold text-gray-800 transition-all"
                    />
                  </div>
                </div>

                {/* Email + Phone fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative group">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">✉️</span>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50/20 border border-gray-200 focus:bg-white rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-600/5 outline-none text-xs font-semibold text-gray-800 transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">📞</span>
                    <input
                      type="tel"
                      placeholder="Mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      maxLength={10}
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50/20 border border-gray-200 focus:bg-white rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-600/5 outline-none text-xs font-semibold text-gray-800 transition-all"
                    />
                  </div>
                </div>

                {/* Referral Code */}
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1">
                    Referral Code {referralFromUrl ? "(Applied)" : "(Optional)"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">🎁</span>
                    <input
                      type="text"
                      placeholder="Referral Code"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className={`w-full pl-8 pr-4 py-2.5 bg-gray-50/20 border border-gray-200 focus:bg-white rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-600/5 outline-none text-xs font-black tracking-widest transition-all
                      ${referralFromUrl ? 'bg-green-50/40 border-green-200' : ''}`}
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-600/10 hover:shadow-xl hover:shadow-green-600/20 transition-all duration-200 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing up...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign Up</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </>
                  )}
                </button>

              </form>
            ) : (
              <form className="space-y-4 animate-in fade-in duration-500" onSubmit={handleVerifyOtp}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Verification Code</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-2xl px-4 py-3 text-center text-xl font-black tracking-[0.5em] focus:border-green-600 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                >
                  {isVerifying ? "Verifying..." : "VERIFY & COMPLETE"}
                </button>

                <button 
                  type="button"
                  onClick={() => setStep("form")}
                  className="w-full text-xs font-bold text-gray-400 hover:text-green-600 transition-colors"
                >
                  ← Edit Registration Details
                </button>
              </form>
            )}

            {/* LOGIN LINK */}
            <p className="text-xs text-center text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-green-700 font-bold hover:underline cursor-pointer ml-1"
              >
                Login
              </span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
