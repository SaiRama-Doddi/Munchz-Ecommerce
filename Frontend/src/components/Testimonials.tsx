import { Star, User } from "lucide-react";

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
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* SECTION HEADER */}
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[4px] text-green-700 mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            What Our <span className="text-green-600">Customers Say</span>
          </h2>
          <div className="w-16 h-[3px] bg-green-600 mt-4"></div>
        </div>

        {/* TESTIMONIALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
            >
              {/* STARS */}
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight uppercase">
                {item.title}
              </h3>

              {/* CONTENT */}
              <p className="text-gray-600 leading-relaxed mb-8 italic">
                "{item.content}"
              </p>

              {/* AVATAR & NAME */}
              <div className="mt-auto">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 border-2 border-green-50">
                  <User size={32} className="text-gray-400" />
                </div>
                <p className="font-bold text-gray-900">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
