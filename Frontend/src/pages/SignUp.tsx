import { useState } from "react";
import { registerUser, googleRegister } from "../api/api";
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

      setSuccess(res.data.message || "OTP sent to your email! 🎉");
      setStep("otp");
      // Don't reset form yet, we need email for OTP verification
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
      
      // Save tokens
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setSuccess("Verification successful! Redirecting...");
      
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // To refresh profile context
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

 return (
<div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">

<div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-6 sm:px-8 py-8">

{/* LOGO */}
<div className="flex flex-col items-center mb-6">
<img
src="https://res.cloudinary.com/dd4oiwnep/image/upload/v1774178657/gomunchz_logo_transparent_r8r0a8.png"
alt="GoMunchz logo"
className="w-20 sm:w-24 mb-2"
/>

<h2 className="text-xl font-bold text-gray-900 tracking-tight">
{step === "form" ? "Create Account" : "Verify Email"}
</h2>

<p className="text-sm text-gray-500 font-medium">
{step === "form" ? "Join GoMunchz and start shopping" : `Enter the OTP sent to ${email}`}
</p>
</div>

{/* ALERTS */}
{error && (
<p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
{error}
</p>
)}

{success && (
<p className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
{success}
</p>
)}

{step === "form" ? (
  <>
    {/* GOOGLE SIGNUP */}
    <div className="flex justify-center mb-4">
    <GoogleLogin
            onSuccess={async (res) => {
              try {
                const apiRes = await googleRegister(res.credential!, referralCode);
                localStorage.setItem("token", apiRes.data.token);
                localStorage.setItem("userId", apiRes.data.userId);

                setSuccess("Registered successfully 🎉");

                setTimeout(() => {
                  navigate("/");
                }, 1500);
              } catch {
                setError("Google signup failed");
              }
            }}
    onError={() => setError("Google signup failed")}
    />
    </div>

    <div className="my-5 text-center text-gray-400 text-sm">
    OR
    </div>

    {/* FORM */}
    <form className="space-y-4" onSubmit={handleSubmit}>

    {/* NAMES */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

    <input
    type="text"
    placeholder="First name"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    className="border border-gray-300 rounded-lg px-4 py-2.5
    focus:outline-none focus:ring-2 focus:ring-green-600"
    />

    <input
    type="text"
    placeholder="Last name"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    className="border border-gray-300 rounded-lg px-4 py-2.5
    focus:outline-none focus:ring-2 focus:ring-green-600"
    />

    </div>

    {/* EMAIL + PHONE */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

    <input
    type="email"
    placeholder="Email address"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="border border-gray-300 rounded-lg px-4 py-2.5
    focus:outline-none focus:ring-2 focus:ring-green-600"
    />

    <input
    type="tel"
    placeholder="Mobile number"
    value={phone}
    onChange={(e) =>
    setPhone(e.target.value.replace(/\D/g, ""))
    }
    maxLength={10}
    className="border border-gray-300 rounded-lg px-4 py-2.5
    focus:outline-none focus:ring-2 focus:ring-green-600"
    />

    </div>

    {/* REFERRAL CODE (Optional but auto-filled) */}
    <div className="space-y-1">
      <label className="text-[10px] text-gray-400 uppercase font-bold ml-1 italic">
        Referral Code {referralFromUrl ? "(Applied)" : "(Optional)"}
      </label>
      <input
        type="text"
        placeholder="Referral Code"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 
        focus:outline-none focus:ring-2 focus:ring-green-600 font-bold tracking-widest
        ${referralFromUrl ? 'bg-green-50 border-green-200' : ''}`}
      />
    </div>

    {/* SUBMIT */}
    <button
    type="submit"
    disabled={loading}
    className="w-full mt-4 bg-green-700 hover:bg-green-800
    text-white font-semibold py-2.5 rounded-lg transition
    disabled:opacity-60"
    >
    {loading ? "Signing up..." : "Sign Up"}
    </button>

    </form>
  </>
) : (
  <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" onSubmit={handleVerifyOtp}>
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Verification Code</label>
      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        maxLength={6}
        className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-xl px-4 py-4 text-center text-2xl font-black tracking-[0.5em] focus:border-green-600 focus:bg-white outline-none transition-all"
        required
      />
    </div>

    <button
      type="submit"
      disabled={isVerifying}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2"
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
<p className="text-sm text-center text-gray-500 mt-5">
Already have an account?{" "}
<span
onClick={() => navigate("/login")}
className="text-green-700 font-medium cursor-pointer"
>
Login
</span>
</p>

</div>

</div>
);
}
