import { useState } from "react";

export default function ContactForm() {
  const [orderType, setOrderType] = useState<"individual" | "bulk">("individual");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ orderType, ...formData });
    alert("Message sent successfully");
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 mt-10">
      <div className="max-w-6xl w-full bg-green-100 rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">

        {/* LEFT IMAGE */}
        <div className="hidden md:block">
          <img
            src="https://res.cloudinary.com/dd4oiwnep/image/upload/ingredients-healthy-dessert-chia-puddings-kitchen-wooden-table_1_fiakub.jpg"   // <-- use your provided image here
            alt="Healthy dry fruits"
            className="h-[600px] w-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="p-10">
          {/* ORDER TYPE */}
          <div className="flex items-center gap-6 mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="orderType"
                checked={orderType === "individual"}
                onChange={() => setOrderType("individual")}
                className="accent-green-600"
              />
              <span className="text-gray-700 font-medium">Individual orders</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="orderType"
                checked={orderType === "bulk"}
                onChange={() => setOrderType("bulk")}
                className="accent-green-600"
              />
              <span className="text-gray-700 font-medium">Bulk orders</span>
            </label>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Name
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-green-600 bg-green-50 outline-none focus:ring-2 focus:ring-green-200"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-green-600 bg-green-50 outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Email ID
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-green-600 bg-green-50 outline-none focus:ring-2 focus:ring-green-200"
                required
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Mobile number (optional)
              </label>
              <div className="flex">
                <select className="px-4 py-3 rounded-l-lg border border-green-600 bg-green-50 outline-none">
                  <option>+91</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-r-lg border border-l-0 border-green-600 bg-green-50 outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Write a message..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-green-600 bg-green-50 outline-none focus:ring-2 focus:ring-green-200 resize-none"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-10 py-3 rounded-lg transition"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
