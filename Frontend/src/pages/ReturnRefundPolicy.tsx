import React from "react";
import { ChevronRight, RefreshCcw } from "lucide-react";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ReturnRefundPolicy() {
  const sections = [
    {
      title: "Overview",
      content: [
        "This policy applies to purchases from GoMunchz, operated by Sri Venkateshwara Super Foods LLP, Hyderabad, Telangana. No returns on 'change of mind' for perishable packaged foods (flavored nuts, powders, dehydrated fruits) to ensure hygiene and FSSAI compliance. Returns/refunds only for valid issues within 7 days of delivery, aligning with Consumer Protection (E-Commerce) Rules, 2020.",
        "Contact us at: gomunchz@gmail.com with order ID, photos (showing defect/batch/expiry), and invoice within 7 days."
      ]
    },
    {
      title: "Eligible Reasons for Return/Refund",
      content: [
        "Damaged packaging or product on arrival.",
        "Wrong item delivered.",
        "Defective, faulty, or expired product (expiry must exceed 30% shelf-life on delivery per FSSAI).",
        "No returns for taste dissatisfaction, tampering, or opened products."
      ],
      isList: true
    },
    {
      title: "Return Conditions",
      content: [
        "Products in original, unopened packaging with intact seals/labels/invoice.",
        "At least 75% weight/volume remaining (for quality check).",
        "Not tampered, used, or temperature-abused.",
        "We inspect returns; replacement subject to stock availability."
      ],
      isList: true
    },
    {
      title: "Process",
      content: [
        "Email us at: gomunchz@gmail.com",
        "Within 7 days with proof (photos of defect, batch ID, expiry).",
        "We verify (48 hours acknowledgment; 3-5 days decision).",
        "Approve: Arrange pickup (free for valid claims) or replacement/redelivery.",
        "Deny: Notify reason; no further action."
      ],
      isList: true
    },
    {
      title: "Cancellations",
      content: [
        "Pre-shipment: Possible via account (full refund).",
        "Post-processed: No cancellations; non-delivery qualifies for redelivery/refund."
      ],
      isList: true
    },
    {
      title: "Refunds",
      content: [
        "Processed to original payment (card/netbanking: 5-7 working days post-approval; COD: bank details required, 3-5 days).",
        "Full amount minus shipping (if customer fault).",
        "RBI-compliant timelines; track via email."
      ],
      isList: true
    },
    {
      title: "No Refunds/Replacements For",
      content: [
        "Incorrect address/recipient unavailability/refusal.",
        "Force majeure/delays by couriers.",
        "Third-party claims.",
        "After 7 days or opened/tampered items."
      ],
      isList: true
    },
    {
      title: "Non-Delivery",
      content: [
        "Redeliver or refund on proof (tracking screenshot)."
      ],
      isList: true
    },
    {
      title: "Grievance Redressal",
      content: [
        "Unresolved? Contact Grievance Officer: Jaya Bharati. Resolve within 30 days per law.",
        "Contact Email: inumulu.jaya@gmail.com"
      ],
      isList: true
    },
    {
      title: "Address",
      content: [
        "Sri Venkateshwara Super Foods LLP (GoMunchz), H NO-16-317/678, Symphony Park Homes, Beeramguda, Patancheru, Sangareddy, Hyderabad - 502319, Telangana."
      ]
    }
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      <TopHeader />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-12 md:pt-6 md:pb-20">
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Refunds & <span className="text-green-600">Returns</span>
          </h2>

        </div>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-3">
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
                    <p key={i} className="text-gray-700 text-xs leading-relaxed text-justify">
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
