import React from "react";
import { ChevronRight } from "lucide-react";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsAndConditions() {
  const sections = [
    {
      title: "Overview",
      content: [
        "This website is operated by Sri Venkateshwara Super Foods LLP, operating under the brand name GoMunchz (“we”, “us”, “our”). By accessing or using our website and purchasing products, you agree to be bound by the following Terms of Service (“Terms”).",
        "These Terms apply to all users of the website, including browsers, customers, merchants, and contributors of content."
      ]
    },
    {
      title: "1. Eligibility",
      content: [
        "You are at least 18 years of age, or using the site under supervision of a parent/guardian",
        "You are legally capable of entering into binding contracts under Indian law"
      ],
      isList: true
    },
    {
      title: "2. Use of Website",
      content: [
        "Not to use the website for any unlawful or fraudulent purpose",
        "Not to transmit viruses, malware, or harmful code",
        "Not to attempt unauthorized access to systems or data",
        "We reserve the right to terminate access if any violation is detected."
      ],
      isList: true
    },
    {
      title: "3. Product Information & Accuracy",
      content: [
        "We strive to ensure that all product descriptions, images, pricing, and nutritional information are accurate. However:",
        "Minor variations in color, packaging, or appearance may occur",
        "Information may contain typographical errors or inaccuracies",
        "We reserve the right to correct errors and update information at any time",
        "All products are offered on an “as is” and “as available” basis."
      ],
      isList: true
    },
    {
      title: "4. Pricing & Order Acceptance",
      content: [
        "Prices are subject to change without prior notice",
        "We reserve the right to refuse or cancel any order, including: Incorrect pricing, Suspected fraudulent transactions, Bulk/reseller misuse",
        "If an order is cancelled after payment, a full refund will be processed."
      ],
      isList: true
    },
    {
      title: "5. Payment Terms",
      content: [
        "Payments must be made through authorized payment gateways",
        "You agree to provide accurate billing and payment information",
        "GoMunchz does not store your card details; all transactions are handled by secure third-party gateways",
        "Any fraudulent use of payment methods will be the sole responsibility of the user."
      ],
      isList: true
    },
    {
      title: "6. Shipping & Delivery",
      content: [
        "Delivery timelines are indicative and may vary due to logistics constraints",
        "We are not liable for delays caused by third-party courier partners",
        "Risk of loss transfers to the customer upon delivery"
      ],
      isList: true
    },
    {
      title: "7. Returns & Refunds",
      content: [
        "Products are eligible for return/replacement only in case of: Damaged packaging, Incorrect product delivery, Quality issues reported within 7 days of delivery",
        "We reserve the right to validate claims before processing refunds or replacements."
      ],
      isList: true
    },
    {
      title: "8. Intellectual Property",
      content: [
        "All content on this website including: Logos, Product designs, Text, images, graphics are the property of Sri Venkateshwara Super Foods LLP (GoMunchz) and are protected under applicable intellectual property laws.",
        "Unauthorized use is strictly prohibited."
      ],
      isList: true
    },
    {
      title: "9. User Content & Feedback",
      content: [
        "If you submit reviews, feedback, or suggestions:",
        "You grant us the right to use, modify, publish, and distribute such content",
        "You confirm that your content does not violate any third-party rights",
        "We reserve the right to remove any content deemed inappropriate."
      ],
      isList: true
    },
    {
      title: "10. Third-Party Links",
      content: [
        "Our website may include links to third-party websites. We:",
        "Do not control these websites",
        "Are not responsible for their content, policies, or practices",
        "Accessing third-party links is at your own risk."
      ],
      isList: true
    },
    {
      title: "11. Disclaimer of Warranties",
      content: [
        "We do not guarantee that:",
        "The website will be uninterrupted or error-free",
        "Product results will meet your expectations",
        "All services and products are provided without warranties of any kind, express or implied."
      ],
      isList: true
    },
    {
      title: "12. Limitation of Liability",
      content: [
        "To the maximum extent permitted by law:",
        "GoMunchz shall not be liable for any indirect, incidental, or consequential damages",
        "Our total liability shall not exceed the value of the order placed"
      ],
      isList: true
    },
    {
      title: "13. Indemnification",
      content: [
        "You agree to indemnify and hold harmless GoMunchz, its partners, employees, and affiliates against any claims arising from:",
        "Your breach of these Terms",
        "Violation of applicable laws"
      ],
      isList: true
    },
    {
      title: "14. Termination",
      content: [
        "We reserve the right to:",
        "Suspend or terminate your access to the website",
        "Cancel orders if misuse or violation is detected"
      ],
      isList: true
    },
    {
      title: "15. Governing Law & Jurisdiction",
      content: [
        "These Terms shall be governed by the laws of India.",
        "All disputes shall be subject to the exclusive jurisdiction of courts in Hyderabad, Telangana."
      ],
      isList: true
    },
    {
      title: "16. Changes to Terms",
      content: [
        "We may update these Terms at any time. Continued use of the website constitutes acceptance of updated Terms."
      ],
      isList: true
    },
    {
      title: "17. Contact Information",
      content: [
        "Sri Venkateshwara Super Foods LLP (GoMunchz)",
        "Hyderabad, Telangana, India",
        "Email: gomunchz@gmail.com",
        "Phone: +918688547851"
      ],
      isList: true
    },
    {
      title: "18. Legal Compliance",
      content: [
        "This document is an electronic record under the Information Technology Act, 2000 and does not require physical or digital signatures.",
        "By using this website, you acknowledge that you have read, understood, and agreed to these Terms of Service."
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
            Terms of <span className="text-green-600">Service</span>
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
