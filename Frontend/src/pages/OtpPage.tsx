import { useState, useEffect, useRef } from "react";
import { confirmLoginOtp, sendResendOtp } from "../api/api";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getProfileApi } from "../api/api";

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
    alert("Session expired. Please login again.");
    window.location.replace("/login");
  }
}, [email]);



  /* Countdown timer */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* Handle OTP typing */
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  /* Handle backspace */
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* Handle paste */
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

 const handleVerify = async () => {
  const enteredOtp = otp.join("");
  if (enteredOtp.length !== 6) {
    alert("Enter full 6-digit OTP");
    return;
  }

  setLoading(true);
  try {
    const res = await confirmLoginOtp(email, enteredOtp);

    const token = res.data.token;
    const roles: string[] = res.data.roles;

    // ✅ Save token FIRST
    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));

    // ✅ NOW fetch profile
    const profileRes = await getProfileApi();
    const profile = profileRes.data;

    setProfile(profile);
    localStorage.setItem("profile", JSON.stringify(profile));

    alert("Login successful!");

    if (roles.includes("ADMIN")) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  } catch (err) {
    alert("Login failed");
  } finally {
    setLoading(false);
  }
};



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
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white w-[450px] rounded-lg shadow-xl p-10 text-center">

        <img src="/logo.png" className="w-20 mx-auto" />
      

        <h2 className="text-xl font-medium mt-4">Enter OTP</h2>

        {/* OTP Inputs */}
        <div
          className="flex justify-center gap-4 mt-8"
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                if (el) inputsRef.current[i] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="border-b-2 border-gray-500 w-10 text-center text-xl focus:outline-none"
            />
          ))}
        </div>

        <p className="text-gray-600 mt-4">
          OTP sent to your registered email or mobile number.
        </p>

<button
  onClick={handleResendOtp}
  disabled={timer > 0 || resendLoading}
  className={`mt-4 text-sm font-semibold underline
    ${
      timer > 0
        ? "text-gray-400 cursor-not-allowed"
        : "text-green-700"
    }
  `}
>
  {resendLoading
    ? "Resending..."
    : timer > 0
    ? `Resend OTP in ${timer}s`
    : "Resend OTP"}
</button>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-green-600 text-white w-full py-3 rounded-lg mt-8 font-semibold"
        >
          {loading ? "Verifying..." : "Login"}
        </button>

        <a href="/signup" className="text-green-600 block mt-4 underline">
          Sign up
        </a>
      </div>
    </div>
  );
}
