import { useState } from "react";
import { sendLoginOtp } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Email regex (simple & safe)
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSendOtp = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

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
      setError("Email not exists. Please signup.");
    } else {
      setError("Failed to send OTP. Try again.");
    }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white w-[450px] rounded-lg shadow-xl p-10 text-center animate-fade-in-up">

        <img src="/munchz.png" className="w-20 mx-auto" />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email address"
          className={`border w-full mt-10 py-3 px-4 rounded-md outline-none
            ${error ? "border-red-500" : "border-green-600"}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Error message */}
       {error && (
  <p className="text-red-600 text-sm mt-2">
    {error}
    {error.includes("signup") && (
      <a href="/signup" className="text-green-600 underline ml-1">
        Signup
      </a>
    )}
  </p>
)}


        {/* Button */}
        <button
          onClick={handleSendOtp}
          disabled={loading}
          className="bg-green-600 text-white w-full py-3 rounded-lg mt-6 font-semibold
                     flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending OTP
            </>
          ) : (
            "Send OTP"
          )}
        </button>

        <a href="/signup" className="text-green-600 block mt-4 underline">
          Sign up
        </a>
      </div>
    </div>
  );
}
