import { useState } from "react";
import { sendLoginOtp, googleLogin } from "../api/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

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
        setError("Failed to send OTP. Try again.");
      } else {
        setError("Email not exists. Please signup.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-[10vh] bg-gray-50 px-4 pt-6 pb-20 flex justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 sm:p-8">

        {/* Logo */}
        <img
          src="/munchz.png"
          className="w-16 mx-auto mb-4"
        />

        {/* GOOGLE LOGIN */}
        <GoogleLogin
          onSuccess={async (res) => {
            try {
              const apiRes = await googleLogin(res.credential!);
              localStorage.setItem("token", apiRes.data.token);
              localStorage.setItem("userId", apiRes.data.userId);
              navigate("/");
            } catch (err: any) {
              setError(err.response?.data?.message || "Google login failed");
            }
          }}
          onError={() => setError("Google login failed")}
        />

        <div className="my-4 text-gray-400 text-xs text-center">OR</div>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email address"
          className={`border w-full py-2.5 px-3 rounded-md outline-none text-sm
          ${error ? "border-red-500" : "border-green-600"}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Error message */}
        {error && (
          <p className="text-red-600 text-xs mt-2 text-left">
            {error}
            {error.includes("signup") && (
              <a href="/signup" className="text-green-600 underline ml-1">
                Signup
              </a>
            )}
          </p>
        )}

        {/* OTP Button */}
        <button
          onClick={handleSendOtp}
          disabled={loading}
          className="bg-green-600 text-white w-full py-2.5 rounded-md mt-4 font-medium
          flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending OTP
            </>
          ) : (
            "Send OTP"
          )}
        </button>

        <a
          href="/signup"
          className="text-green-600 text-sm block text-center mt-4 underline"
        >
          Sign up
        </a>
      </div>
    </div>
  );
}
