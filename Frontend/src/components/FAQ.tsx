import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What defines the Munchz Premium distinction?",
    answer:
      "Munchz Premium represents a relentless pursuit of snacking excellence. We source only the highest grade of natural assets, processed in state-of-the-art facilities to ensure nutritional integrity and a superior sensory profile.",
  },
  {
    question: "Are these selections suitable for elite nutritional regimens?",
    answer:
      "Precisely. Each selection is curated to serve as a high-density nutritional asset. We use minimal processing and zero artificial enhancers to preserve the biological value of our nuts and botanical blends.",
  },
  {
    question: "What is the reach of your logistics network?",
    answer:
      "Our logistics grid covers the entirety of India. We utilize priority fulfillment channels to ensure that our premium selections reach your destination with maximum speed and preserved freshness.",
  },
  {
    question: "How should I maintain the integrity of my selections?",
    answer:
      "To preserve the premium profile, store in a temperature-controlled, dry environment. Once the security seal is breached, we recommend transfer to an airtight containment vessel.",
  },
  {
    question: "What protocol is followed for damaged transfers?",
    answer:
      "In the rare event of a logistics breach resulting in damage, our elite support concierge handles replacements with priority status. Simply initiate a claim through our digital interface.",
  },
  {
    question: "Is real-time tracking available for my acquisition?",
    answer:
      "Absolutely. Upon authorization of the transfer, you will receive encrypted tracking credentials. You can monitor the progress of your Munchz via our integrated logistics portal.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-24 lg:py-40 bg-white">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-emerald-600"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Intelligence Center</p>
            <span className="h-px w-8 bg-emerald-600"></span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter mb-6 underline decoration-emerald-600/20 decoration-8 underline-offset-8">
            Common <span className="text-emerald-600 italic">Inquiries</span>
          </h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
            Everything you need to know about navigating the premium Munchz ecosystem.
          </p>
        </div>

        {/* FAQ SEQUENCE */}
        <div className="space-y-6">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`group rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${isOpen ? 'bg-gray-50/50 border-emerald-100 shadow-xl shadow-emerald-900/5' : 'bg-white border-gray-50 hover:border-gray-200'}`}
              >
                <button 
                  onClick={() => toggle(i)}
                  className="w-full px-10 py-8 flex justify-between items-center text-left gap-6"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-600 text-white rotate-12' : 'bg-gray-50 text-gray-300 group-hover:text-emerald-600'}`}>
                       <HelpCircle size={16} />
                    </div>
                    <p className={`text-[13px] font-black uppercase tracking-widest transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.question}
                    </p>
                  </div>
                  <ChevronDown className={`shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-emerald-600' : 'text-gray-200'}`} size={18} />
                </button>

                <div className={`transition-all duration-700 ease-in-out px-10 ${isOpen ? 'max-h-[300px] opacity-100 pb-10' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <div className="pl-13 flex gap-6">
                    <span className="w-1 h-full bg-emerald-100 rounded-full shrink-0"></span>
                    <p className="text-[14px] font-bold text-gray-500 leading-relaxed tracking-wide italic italic-emerald">
                      "{item.answer}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SUPPORT CTAS */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-10 py-12 border-t border-gray-50">
           <div className="text-center sm:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-1">Still seeking intelligence?</p>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Consult our elite concierge</h4>
           </div>
           <button className="h-14 px-8 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-black/10 flex items-center gap-3">
              <MessageCircle size={16} />
              Priority Support
           </button>
        </div>

      </div>
    </section>
  );
}
