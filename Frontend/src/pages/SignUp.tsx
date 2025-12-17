// src/pages/Signup.tsx
import { useState } from "react";
import { registerUser } from "../api/api";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Validators
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone: string) =>
    /^[6-9]\d{9}$/.test(phone); // Indian mobile numbers

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
      });

      setSuccess(res.data.message || "Registered successfully 🎉");

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl px-8 py-10 animate-fade-in-up">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/munchz.png" alt="Munchz logo" className="w-24 mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">
            Create Account
          </h2>
        </div>

        {/* Alerts */}
        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 text-sm text-green-700 bg-green-50 p-2 rounded">
            {success}
          </p>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* First + Last name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-green-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-green-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-green-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <input
              type="tel"
              placeholder="Mobile number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "")) // numbers only
              }
              maxLength={10}
              className="w-full border border-green-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
