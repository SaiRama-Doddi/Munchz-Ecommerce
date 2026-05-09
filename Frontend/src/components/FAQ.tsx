import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What makes GoMunchz snacks different from others?",
    answer:
      "GoMunchz focuses on real ingredients and premium sourcing. Our snacks are prepared using carefully selected dry fruits and natural ingredients to ensure both taste and nutritional value.",
  },
  {
    question: "Are GoMunchz products healthy?",
    answer:
      "Yes. Our products are made from high-quality nuts, dry fruits, and natural ingredients. We aim to provide snacks that are both delicious and nutritious for everyday consumption.",
  },
  {
    question: "Do you deliver across India?",
    answer:
      "Yes, we offer fast and reliable shipping across India. Orders are processed quickly and delivered safely to ensure freshness.",
  },
  {
    question: "How should I store dry fruits and snacks?",
    answer:
      "For best freshness, store the products in a cool and dry place. After opening, keep them in an airtight container to maintain flavor and quality.",
  },
  {
    question: "What if I receive a damaged product?",
    answer:
      "Customer satisfaction is our priority. If you receive a damaged product, please contact our support team and we will assist you with a replacement or refund according to our return policy.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes. Once your order is shipped, you will receive a tracking link so you can monitor the delivery status of your order in real time.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="pt-2 pb-2 md:pt-3 md:pb-3 bg-white">

      <div className="max-w-7xl mx-auto px-4">

        {/* SECTION HEADER */}
        <div className="mb-8">


          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Frequently Asked <span className="text-green-600">Questions</span>
          </h2>


        </div>


        {/* FAQ LIST */}

        <div className="space-y-4">

          {faqs.map((item, i) => (
            <div
              key={i}
              className="
              bg-white
              border
              border-gray-200
              rounded-xl
              shadow-sm
              hover:shadow-md
              transition
              "
            >

              <button
                onClick={() => toggle(i)}
                className="w-full px-6 py-5 flex justify-between items-center text-left"
              >

                <p className="text-gray-900 font-medium text-xs">
                  {item.question}
                </p>

                <ChevronDown
                  size={22}
                  className={`transition-transform duration-300 ${openIndex === i ? "rotate-180 text-green-700" : "text-gray-500"
                    }`}
                />

              </button>


              {/* ANSWER */}

              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-40 pb-5" : "max-h-0"
                  }`}
              >
                <p className="text-gray-600 leading-relaxed text-xs">
                  {item.answer}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
