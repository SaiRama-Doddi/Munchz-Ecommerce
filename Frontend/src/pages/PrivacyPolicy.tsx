import React from "react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Introduction",
      content: [
        "This Privacy Policy describes how Sri Venkateshwara Super Foods LLP, operating under the brand GoMunchz (“we”, “our”, “us”), collects, uses, stores, and protects your personal information when you use our website and services.",
        "By accessing or using our website, you agree to the terms of this Privacy Policy."
      ]
    },
    {
      title: "2. Information We Collect",
      content: [
        "Personal Information: Name, Email address, Mobile number, Shipping and billing address, Payment details (processed via secure third-party gateways)",
        "Non-Personal Information: IP address, Browser type and device details, Pages visited and browsing behavior, Referral URLs",
        "Transactional Data: Order history, Purchase preferences, Payment status"
      ],
      isList: true
    },
    {
      title: "3. How We Use Your Information",
      content: [
        "Process and fulfill orders",
        "Provide customer support",
        "Improve website experience and offerings",
        "Send order updates and service communications",
        "Prevent fraud and enhance platform security",
        "Conduct analytics and internal research",
        "With your consent, we may also send promotional offers and updates."
      ],
      isList: true
    },
    {
      title: "4. Cookies & Tracking Technologies",
      content: [
        "Understand user behavior",
        "Improve website performance",
        "Personalize user experience",
        "You may disable cookies through your browser settings, but some features of the website may not function properly."
      ],
      isList: true
    },
    {
      title: "5. Sharing of Information",
      content: [
        "Logistics partners (for delivery)",
        "Payment gateway providers",
        "Technology and analytics partners",
        "Legal authorities when required by law",
        "We do not sell your personal data to third parties."
      ],
      isList: true
    },
    {
      title: "6. Third-Party Services",
      content: [
        "Our website may contain links to third-party websites or services. We are not responsible for their privacy practices. Users are encouraged to review their policies before sharing information."
      ]
    },
    {
      title: "7. Data Security",
      content: [
        "We implement reasonable technical and organizational measures to protect your data, including:",
        "Secure servers",
        "Encrypted payment processing",
        "Restricted access controls",
        "However, no method of transmission over the internet is 100% secure."
      ],
      isList: true
    },
    {
      title: "8. Data Retention",
      content: [
        "As long as necessary to fulfill the purpose for which it was collected",
        "To comply with legal and regulatory requirements",
        "For fraud prevention and dispute resolution"
      ],
      isList: true
    },
    {
      title: "9. User Rights",
      content: [
        "Access your personal data",
        "Request correction or deletion",
        "Opt-out of marketing communications",
        "To exercise these rights, please contact us using the details below."
      ],
      isList: true
    },
    {
      title: "10. Marketing Communications",
      content: [
        "Email",
        "SMS",
        "WhatsApp or other messaging platforms",
        "You may opt-out at any time via unsubscribe links or by contacting us."
      ],
      isList: true
    },
    {
      title: "11. Children’s Privacy",
      content: [
        "Our website is not intended for individuals under the age of 18. We do not knowingly collect personal data from minors."
      ]
    },
    {
      title: "12. Changes to This Policy",
      content: [
        "We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page. Continued use of the website constitutes acceptance of updated terms."
      ]
    },
    {
      title: "13. Legal Compliance",
      content: [
        "This Privacy Policy complies with applicable Indian laws, including:",
        "Information Technology Act, 2000",
        "Applicable data protection and intermediary guidelines"
      ],
      isList: true
    },
    {
      title: "14. Consent",
      content: [
        "By using our website and providing your information, you consent to:",
        "Collection, Use, Storage, Processing of your data as described in this Policy"
      ],
      isList: true
    },
    {
      title: "15. Contact Information",
      content: [
        "Sri Venkateshwara Super Foods LLP (GoMunchz)",
        "Hyderabad, Telangana, India",
        "Email: gomunchz@gmail.com",
        "Phone: 8688547851"
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Privacy <span className="text-green-600">Policy</span>
          </h2>
          <div className="w-16 h-[3px] bg-green-600 mt-4 md:mt-6"></div>
        </div>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-base font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-3">
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
                    <p key={i} className="text-gray-700 text-base leading-relaxed text-justify">
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
