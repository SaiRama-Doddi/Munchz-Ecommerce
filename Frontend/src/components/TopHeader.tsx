export default function TopHeader() {
  const messages = [
    ".Free shipping on orders above Rs 799",
    "100% natural and premium quality products",
    ".Healthy Snacking",
    ".Add GoMunchz credit with every purchase",
  ];

  return (
    <div className="w-full bg-[#004d00] text-white overflow-hidden py-2">
      <div className="marquee">
        <div className="marquee-content">
          {messages.map((msg, i) => (
            <span key={i} className="mx-8">
              ✦ {msg}
            </span>
          ))}
        </div>

        {/* duplicate for seamless loop */}
        <div className="marquee-content">
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
