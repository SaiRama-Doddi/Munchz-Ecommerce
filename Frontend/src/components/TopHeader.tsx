export default function TopHeader({ theme = "light" }: { theme?: "light" | "dark" }) {
  const messages = [
    "Free shipping on orders above Rs 799",
    "100% natural and premium quality products",
    "Healthy Snacking",
    "Add GoMunchz credit with every purchase",
  ];

  const bgColor = theme === "dark" ? "bg-[#064e3b]" : "bg-[#dcfce7]"; // Dark Green vs Light Green
  const textColor = theme === "dark" ? "text-white" : "text-green-800";

  return (
    <div className={`w-full ${bgColor} ${textColor} overflow-hidden py-2`}>
      <div className="marquee">
        <div className="marquee-content font-medium text-sm">
          {messages.map((msg, i) => (
            <span key={i} className="mx-8">
              ✦ {msg}
            </span>
          ))}
        </div>

        {/* duplicate for seamless loop */}
        <div className="marquee-content font-medium text-sm">
          {messages.map((msg, i) => (
            <span key={i} className="mx-8">
              ✦ {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
