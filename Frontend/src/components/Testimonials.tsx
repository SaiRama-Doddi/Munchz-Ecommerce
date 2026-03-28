import { useState, useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
  image: string;
}

import pman1 from "../assets/profiles/profile_man_1.png";
import pman2 from "../assets/profiles/profile_man_2.png";
import pman3 from "../assets/profiles/profile_man_3.png";
import pman4 from "../assets/profiles/profile_man_4.png";
import pwoman1 from "../assets/profiles/profile_woman_1.png";
import pwoman2 from "../assets/profiles/profile_woman_2.png";
import pwoman3 from "../assets/profiles/profile_woman_3.png";
import pwoman4 from "../assets/profiles/profile_woman_4.png";

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Arjun Reddy",
    title: "CRISPY, SMOOTH, NOVEL!",
    content: "These snacks have the perfect balance of crunch and taste—light, crispy, and absolutely delicious. They’re a game-changer compared to any other healthy snack I've tried.",
    rating: 5,
    image: pman1,
  },
  {
    id: 2,
    name: "Meenakshi Iyer",
    title: "HELPS WITH STRESS EATING!",
    content: "I've noticed a huge reduction in my sugar cravings since I started snacking on GoMunchz. It helps me make better food choices throughout the day.",
    rating: 5,
    image: pwoman1,
  },
  {
    id: 3,
    name: "Karthik Subramanian",
    title: "MORE ENERGY, LESS BURNOUT",
    content: "I used to feel exhausted by evening, but these premium nuts have helped me power through my day without feeling drained. Highly recommend!",
    rating: 5,
    image: pman2,
  },
  {
    id: 4,
    name: "Lakshmi Narayanan",
    title: "BEST QUALITY EVER",
    content: "The freshness of the almonds and cashews is unmatched. You can tell they source only the best. My whole family loves it!",
    rating: 5,
    image: pwoman2,
  },
  {
    id: 5,
    name: "Sai Prasad",
    title: "PERFECT OFFICE SNACK",
    content: "Great for munching during long meetings. It's healthy, filling, and doesn't leave you feeling sluggish. Great job GoMunchz!",
    rating: 5,
    image: pman3,
  },
  {
    id: 6,
    name: "Ananya Hegde",
    title: "DELICIOUS & NUTRITIOUS",
    content: "Hard to believe something this tasty is also healthy. The dry fruit mix is my absolute favorite. Will definitely order more.",
    rating: 5,
    image: pwoman3,
  },
  {
    id: 7,
    name: "Venkatesh Rao",
    title: "PREMIUM PACKAGING",
    content: "The packaging keeps everything so fresh. It's clear that GoMunchz cares about quality at every step. Very impressed.",
    rating: 5,
    image: pman4,
  },
  {
    id: 8,
    name: "Priyanka Balan",
    title: "GREAT TASTE, NO GUILT",
    content: "Finally a snack that I don't have to feel guilty about! Crisp, fresh, and perfectly seasoned. Best healthy find this year.",
    rating: 5,
    image: pwoman4,
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 500);
    }
  };

  return (
    <section className="pt-16 pb-2 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER SECTION WITH NAVIGATION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              What Our <span className="text-green-600">Customers Say</span>
            </h2>
            <div className="w-16 h-[3px] bg-green-600 mt-4"></div>
          </div>

          {/* CUSTOM CIRCULAR NAVIGATION BUTTONS AS PER USER REQUEST */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all ${canScrollLeft
                  ? "border-gray-200 text-gray-900 hover:border-green-600 hover:text-green-600 shadow-sm"
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all ${canScrollRight
                  ? "border-gray-200 text-gray-900 hover:border-green-600 hover:text-green-600 shadow-sm"
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              aria-label="Next testimonials"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTAINER (ONE ROW) */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 pt-4 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[85%] md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] snap-center md:snap-start"
            >
              <div className="bg-[#ecfdf5] border border-green-100 rounded-3xl p-5 md:p-6 h-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col items-center text-center group">
                {/* STARS */}
                <div className="flex gap-1 mb-3 text-yellow-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                {/* TITLE */}
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 tracking-tight uppercase group-hover:text-green-700 transition-colors">
                  {item.title}
                </h3>

                {/* CONTENT */}
                <p className="text-gray-600 leading-relaxed mb-5 italic text-xs md:text-sm">
                  "{item.content}"
                </p>

                {/* AVATAR & NAME */}
                <div className="mt-auto">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-3 border-2 border-green-50 group-hover:border-green-300 transition-all duration-500 overflow-hidden shadow-inner">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-bold text-gray-900 tracking-wide text-sm md:text-base">{item.name}</p>
                  <p className="text-[10px] md:text-xs text-green-600 font-medium uppercase tracking-widest mt-1">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
