import { useState } from "react";
import { registerUser, googleRegister } from "../api/api";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const navigate = useNavigate(); 
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
      });

setSuccess(res.data.message || "Registered successfully 🎉");

setTimeout(() => {
  navigate("/login");
}, 1500);
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
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

 return (
<div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">

<div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-6 sm:px-8 py-8">

{/* LOGO */}
<div className="flex flex-col items-center mb-6">
<img
src="/munchz.png"
alt="GoMunchz logo"
className="w-20 sm:w-24 mb-2"
/>

<h2 className="text-base font-semibold text-gray-800">
Create Account
</h2>

<p className="text-sm text-gray-500">
Join GoMunchz and start shopping
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

{/* GOOGLE SIGNUP */}
<div className="flex justify-center mb-4">
<GoogleLogin
        onSuccess={async (res) => {
          try {
            const apiRes = await googleRegister(res.credential!);
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
