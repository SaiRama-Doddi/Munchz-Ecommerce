import  { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Lorem ipsum dolor sit amet consectetur.",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, molestias.",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur.",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, molestias.",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur.",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, molestias.",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur.",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, molestias.",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur.",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, molestias.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-16 bg-white">
      <h2 className="text-2xl font-semibold text-center mb-10">FAQs</h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="bg-[#e3f0e8] rounded-md shadow-md px-6 py-4 cursor-pointer transition-all"   
            onClick={() => toggle(i)}
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-900 font-medium">{item.question}</p>
              <ChevronDown
                className={`transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </div>

            {openIndex === i && (
              <p className="mt-3 text-gray-800">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
