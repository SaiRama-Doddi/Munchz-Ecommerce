import { useState, useRef, useEffect } from "react";
import { Star, User, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Arjun Reddy",
    title: "CRISPY, SMOOTH, NOVEL!",
    content: "These snacks have the perfect balance of crunch and taste—light, crispy, and absolutely delicious. They’re a game-changer compared to any other healthy snack I've tried.",
    rating: 5,
  },
  {
    id: 2,
    name: "Meenakshi Iyer",
    title: "HELPS WITH STRESS EATING!",
    content: "I've noticed a huge reduction in my sugar cravings since I started snacking on GoMunchZ. It helps me make better food choices throughout the day.",
    rating: 5,
  },
  {
    id: 3,
    name: "Karthik Subramanian",
    title: "MORE ENERGY, LESS BURNOUT",
    content: "I used to feel exhausted by evening, but these premium nuts have helped me power through my day without feeling drained. Highly recommend!",
    rating: 5,
  },
  {
    id: 4,
    name: "Lakshmi Narayanan",
    title: "BEST QUALITY EVER",
    content: "The freshness of the almonds and cashews is unmatched. You can tell they source only the best. My whole family loves it!",
    rating: 5,
  },
  {
    id: 5,
    name: "Sai Prasad",
    title: "PERFECT OFFICE SNACK",
    content: "Great for munching during long meetings. It's healthy, filling, and doesn't leave you feeling sluggish. Great job GoMunchZ!",
    rating: 5,
  },
  {
    id: 6,
    name: "Ananya Hegde",
    title: "DELICIOUS & NUTRITIOUS",
    content: "Hard to believe something this tasty is also healthy. The dry fruit mix is my absolute favorite. Will definitely order more.",
    rating: 5,
  },
  {
    id: 7,
    name: "Venkatesh Rao",
    title: "PREMIUM PACKAGING",
    content: "The packaging keeps everything so fresh. It's clear that GoMunchZ cares about quality at every step. Very impressed.",
    rating: 5,
  },
  {
    id: 8,
    name: "Priyanka Balan",
    title: "GREAT TASTE, NO GUILT",
    content: "Finally a snack that I don't have to feel guilty about! Crisp, fresh, and perfectly seasoned. Best healthy find this year.",
    rating: 5,
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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HEADER SECTION WITH NAVIGATION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-sm uppercase tracking-[4px] text-green-700 mb-2 font-medium">
              Real Reviews
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              What Our <span className="text-green-600">Customers Say</span>
            </h2>
            <div className="w-16 h-[3px] bg-green-600 mt-4"></div>
          </div>

          {/* CUSTOM CIRCULAR NAVIGATION BUTTONS AS PER USER REQUEST */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                canScrollLeft 
                ? "border-gray-200 text-gray-900 hover:border-green-600 hover:text-green-600 shadow-sm" 
                : "border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                canScrollRight 
                ? "border-gray-200 text-gray-900 hover:border-green-600 hover:text-green-600 shadow-sm" 
                : "border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Next testimonials"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTAINER (ONE ROW) */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 pt-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="flex-shrink-0 w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] snap-start"
            >
              <div className="bg-white border border-gray-100 rounded-3xl p-8 h-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col items-center text-center group">
                {/* STARS */}
                <div className="flex gap-1 mb-6 text-yellow-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight uppercase group-hover:text-green-700 transition-colors">
                  {item.title}
                </h3>

                {/* CONTENT */}
                <p className="text-gray-600 leading-relaxed mb-8 italic text-sm md:text-base">
                  "{item.content}"
                </p>

                {/* AVATAR & NAME */}
                <div className="mt-auto">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 border-2 border-green-50 group-hover:border-green-300 transition-all duration-500 overflow-hidden shadow-inner">
                    <User size={30} className="text-gray-300" />
                  </div>
                  <p className="font-bold text-gray-900 tracking-wide">{item.name}</p>
                  <p className="text-xs text-green-600 font-medium uppercase tracking-widest mt-1">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
