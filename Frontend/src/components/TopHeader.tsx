export default function TopHeader() {
  const messages = [
    'Get 5% Discount on Purchase of 599 and Above With Code "SAVER0"',
    "Free Shipping on Orders Above ₹799",
    "100% Natural & Premium Quality Products",
    "Cash on Delivery Available Across India",
    "Freshly Packed & Delivered to Your Doorstep",
  ];

  return (
    <div className="w-full bg-emerald-950 text-emerald-100/80 overflow-hidden py-2.5 border-b border-white/5">
      <div className="marquee">
        <div className="marquee-content gap-4">
          {messages.map((msg, i) => (
            <span key={i} className="mx-12 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              {msg}
            </span>
          ))}
        </div>

        {/* duplicate for seamless loop */}
        <div className="marquee-content gap-4">
          {messages.map((msg, i) => (
            <span key={i} className="mx-12 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
