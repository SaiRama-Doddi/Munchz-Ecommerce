export default function TopHeader() {
  const messages = [
    'Get 5% Discount on Purchase of 599 and Above With Code "SAVER0"',
    "Free Shipping on Orders Above ₹799",
    "100% Natural & Premium Quality Products",
    "Cash on Delivery Available Across India",
    "Freshly Packed & Delivered to Your Doorstep",
  ];

  return (
    <div className="w-full bg-green-200 overflow-hidden py-2">
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
