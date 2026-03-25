
import { useState, useEffect, useRef } from "react";
import { confirmLoginOtp, sendResendOtp } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

      setProfile(profile);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("roles", JSON.stringify(roles));

      alert("Login successful!");

      if (roles.includes("ADMIN")) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      alert("Invalid OTP");
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
    <div className="min-h-[10vh] bg-white px-4 pt-6 pb-20 flex justify-center">

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 sm:p-8 text-center">

        {/* Logo */}
        <img src="/logo.png" className="w-16 mx-auto mb-3" />

        <h2 className="text-lg font-semibold">Enter OTP</h2>

        {/* OTP INPUTS */}
        <div
          className="flex justify-between max-w-xs mx-auto mt-6"
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
              className="
                w-9 h-11
                sm:w-11 sm:h-12
                border rounded-md
                text-center text-lg
                focus:outline-none
                focus:border-green-600
              "
            />
          ))}
        </div>

        <p className="text-gray-500 text-sm mt-4">
          OTP sent to your registered email
        </p>

        {/* RESEND OTP */}
        <button
          onClick={handleResendOtp}
          disabled={timer > 0 || resendLoading}
          className={`mt-3 text-sm font-medium underline
          ${
            timer > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-green-700 cursor-pointer"
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
          className={`w-full py-2.5 rounded-md mt-6 font-medium
          flex items-center justify-center gap-2
          ${
            loading
              ? "bg-green-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 cursor-pointer"
          }
          text-white`}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            "Login"
          )}
        </button>

        <a
          href="/signup"
          className="text-green-600 text-sm block mt-4 underline cursor-pointer"
        >
          Sign up
        </a>

      </div>
    </div>
  );
}

