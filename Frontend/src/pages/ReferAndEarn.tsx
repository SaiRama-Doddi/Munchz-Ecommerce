import React, { useState, useEffect } from "react";
import { ChevronRight, Gift, Copy, Share2, MessageCircle, Mail, CheckCircle2, Coins, Percent, Zap } from "lucide-react";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getProfileApi, getActiveReferralConfigApi } from "../api/api";
import PremiumSpinner from "../components/PremiumSpinner";

export default function ReferAndEarn() {
  const [profile, setProfile] = useState<any>(null);
  const [activeConfig, setActiveConfig] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, configRes] = await Promise.all([
          getProfileApi(),
          getActiveReferralConfigApi()
        ]);
        setProfile(profRes.data);
        // Take the first active config
        if (configRes.data && configRes.data.length > 0) {
          setActiveConfig(configRes.data[0]);
        }
      } catch (err) {
        console.error("Error fetching referral data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PremiumSpinner text="Loading Referral Details..." />;

  const referralCode = profile?.referralCode || "LOGIN_TO_SEE";
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Hey! Check out GoMunchz - Premium nuts and dry fruits. Use my link to get ${activeConfig?.friendDiscountPercentage || 15}% OFF on your first order! 🥜✨\n\nLink: ${referralLink}`;

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareEmail = () => {
    window.location.href = `mailto:?subject=Gift from GoMunchz!&body=${encodeURIComponent(shareText)}`;
  };

  const sections = [
    {
      title: "How It Works",
      content: [
        "Share Your Link: Copy your unique link below and share it with friends via WhatsApp or Email.",
        `The Gift: Your friend clicks the link and receives a ${activeConfig?.friendDiscountPercentage || 15}% discount on their first order above ₹${activeConfig?.minimumOrderAmount || 999}.`,
        "Automatic Savings: The discount is automatically applied at their checkout when they register via your link.",
        "Earn Rewards: Once your friend’s order is successfully delivered, you receive your reward credited to your account."
      ],
      isList: true
    },
    {
      title: "Rewards Structure",
      content: [
        `For Your Friend: ${activeConfig?.friendDiscountPercentage || 15}% OFF on their first order of ₹${activeConfig?.minimumOrderAmount || 999} or more.`,
        `For You: ₹${activeConfig?.referrerCashbackAmount || 200} cashback for every successful referral.`,
        "Balance: Your earnings are visible in your Profile and can be used for future Munching!"
      ],
      isList: true
    },
    {
      title: "What Defines a “Successful Referral”?",
      content: [
        "The referred friend must register using your specific referral link.",
        `The friend’s order value must be ₹${activeConfig?.minimumOrderAmount || 999} or higher.`,
        "The order must be successfully delivered (not cancelled or returned)."
      ],
      isList: true
    }
  ];

  return (
    <div className="w-full bg-[#fcfcfc] min-h-screen">
      <TopHeader />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-12">
        {/* HERO HEADER & STATS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-2xl font-bold uppercase tracking-wider mb-4 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                Program Live
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              Refer & <span className="text-emerald-600">Earn</span>
            </h1>
            <p className="text-gray-500 text-xs max-w-xl font-medium">
              Share the goodness of Munchz. Get rewarded for every friend who joins.
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
             <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm flex flex-col items-center sm:items-start min-w-[180px]">
                <div className="text-gray-400 mb-4 bg-gray-50 p-2 rounded-xl group-hover:bg-emerald-50 transition-colors">
                    <Coins size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-1">Total Earned</p>
                <p className="text-2xl font-black text-emerald-600 leading-none">₹{profile?.referralCredits?.toFixed(0) || 0}</p>
             </div>
             <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm flex flex-col items-center sm:items-start min-w-[180px]">
                <div className="text-gray-400 mb-4 bg-gray-50 p-2 rounded-xl">
                    <Zap size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-1">You Get</p>
                <p className="text-2xl font-black text-gray-900 leading-none">₹{activeConfig?.referrerCashbackAmount || 200}</p>
             </div>
             <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm flex flex-col items-center sm:items-start min-w-[180px]">
                <div className="text-gray-400 mb-4 bg-gray-50 p-2 rounded-xl">
                    <Percent size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-1">They Get</p>
                <p className="text-2xl font-black text-gray-900 leading-none">{activeConfig?.friendDiscountPercentage || 15}%</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: SHARE INTERFACE */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-50 p-8 sticky top-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <Gift size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-gray-900">Your Invite</h3>
                  <p className="text-emerald-600 font-medium">Ready to share</p>
                </div>
              </div>

              {/* REFERRAL CODE DISPLAY */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 text-center">
                <p className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-2">My Unique Code</p>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">{referralCode}</p>
              </div>

              {/* LINK & COPY */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                     <Share2 size={16} />
                  </div>
                  <input 
                    readOnly
                    value={referralLink}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-xs font-medium text-gray-600 focus:outline-none"
                  />
                  <button 
                    onClick={handleCopy}
                    className={`absolute right-2 top-1.5 px-4 py-2 rounded-lg text-2xl font-bold transition-all flex items-center gap-2
                      ${copied ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'}`}
                  >
                    {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={shareWhatsApp}
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </button>
                  <button 
                    onClick={shareEmail}
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                  >
                    <Mail size={18} />
                    Email
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500 font-medium italic">
                  "Give {activeConfig?.friendDiscountPercentage || 15}% OFF, Get ₹{activeConfig?.referrerCashbackAmount || 200} Cashback"
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: HOW IT WORKS & INFO */}
          <div className="lg:col-span-2 space-y-12">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
                  {section.title}
                </h2>
                
                <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-50/50 hover:shadow-md transition-all">
                      <div className="mt-1 bg-emerald-600 p-1.5 rounded-lg text-white flex-shrink-0">
                        <ChevronRight size={14} strokeWidth={3} />
                      </div>
                      <span className="text-gray-700 font-semibold leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* TERMS PREVIEW */}
            <div className="bg-emerald-50/30 rounded-3xl p-8 border border-emerald-100">
               <h2 className="text-2xl font-bold text-emerald-900 mb-4">A Mutual Win</h2>
               <p className="text-emerald-800/80 font-medium leading-relaxed mb-6">
                 We believe in the power of shared health and happiness. By referring your friends, you're not just earning cashback—you're helping your community munch smarter with premium quality nuts and dry fruits.
               </p>
               <button className="text-emerald-700 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  Read Full Terms & Conditions <ChevronRight size={18} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
