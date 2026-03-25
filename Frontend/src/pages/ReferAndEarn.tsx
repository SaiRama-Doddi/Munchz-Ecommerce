import React from "react";
import { ChevronRight, Gift } from "lucide-react";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ReferAndEarn() {
  const sections = [
    {
      title: "How It Works",
      content: [
        "Share Your Link: Generate and share your unique referral link via WhatsApp, SMS, or email.",
        "The Gift: Your friend clicks the link and receives a 15% discount on their first order above ₹999.",
        "Automatic Savings: The discount is automatically applied at their checkout, or they can manually paste the code.",
        "Earn Rewards: Once your friend’s order is successfully completed and delivered, you receive your reward."
      ],
      isList: true
    },
    {
      title: "Rewards Structure",
      content: [
        "For Your Friend: 15% OFF on their first order of ₹999 or more.",
        "For You: ₹200 cashback for every successful referral.",
        "Delivery: Your cashback is sent directly to you via the same channel used for sharing (WhatsApp, SMS, or email)."
      ],
      isList: true
    },
    {
      title: "What Defines a “Successful Referral”?",
      content: [
        "The referred friend must use your specific referral code at checkout.",
        "The friend’s order value must be ₹999 or higher after all discounts are applied.",
        "The order must be successfully delivered without being cancelled, returned, or marked as 'Return to Origin' (RTO)."
      ],
      isList: true
    },
    {
      title: "Redeeming Your Rewards",
      content: [
        "Notification: You will receive a message via WhatsApp, SMS, or email once your reward is ready.",
        "Simple Process: Follow the instructions within the reward message to claim your cashback.",
        "Consolidation: In some cases, multiple referral rewards may be grouped into a single reward card to make your redemption bigger and simpler."
      ],
      isList: true
    },
    {
      title: "Terms & Conditions",
      content: [
        "Program Ownership: This program is operated exclusively by Sri Venkateshwara Super Foods LLP. We reserve all rights regarding rewards, discounts, and program rules.",
        "Eligibility & Restrictions: Self-referrals are strictly prohibited. You cannot use your own referral code for your own orders; doing so will result in no cashback being issued.",
        "Referral rewards are non-transferable and can only be redeemed once.",
        "Payout Timeline: Cashback is typically processed within 48 hours following the successful delivery of the referred friend's order.",
        "Expiry: Rewards and cashback links may have an expiry date, which will be specified in your reward message. Expired rewards cannot be reissued.",
        "Fraud Prevention: Any attempt to manipulate the system through fake accounts or bulk self-referrals will lead to immediate disqualification and forfeiture of all rewards.",
        "Modifications: GoMunchz reserves the right to modify, suspend, or terminate the Refer & Earn program or change reward values at any time without prior notice.",
        "Liability: Sri Venkateshwara Super Foods LLP is not responsible for delays in reward credits caused by third-party payment services or banks. Our decision on any program-related dispute is final."
      ],
      isList: true
    }
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      <TopHeader />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Refer & <span className="text-green-600">Earn</span>
          </h2>
          <div className="w-16 h-[3px] bg-green-600 mt-4 md:mt-6"></div>
        </div>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-green-600 rounded-full"></div>
                {section.title}
              </h2>
              
              {section.isList ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white p-5 rounded-2xl shadow-sm border border-green-50 hover:border-green-200 transition-colors">
                      <div className="mt-1 bg-green-100 p-1 rounded-full text-green-700 flex-shrink-0">
                        <ChevronRight size={14} />
                      </div>
                      <span className="text-gray-700 font-medium leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-4">
                  {section.content.map((para, i) => (
                    <p key={i} className="text-gray-700 text-lg leading-relaxed text-justify">
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
