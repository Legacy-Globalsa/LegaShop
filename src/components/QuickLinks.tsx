import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const quickLinks = [
  { label: "1 SAR Deals", emoji: "🔥", link: "/deals/1-sar", bg: "bg-red-50", border: "border-red-200" },
  { label: "5 SAR Deals", emoji: "⭐", link: "/deals/5-sar", bg: "bg-yellow-50", border: "border-yellow-200" },
  { label: "Flash Sale", emoji: "⚡", link: "/deals/1-sar", bg: "bg-orange-50", border: "border-orange-200" },
  { label: "Filipino Favs", emoji: "🇵🇭", link: "/categories", bg: "bg-blue-50", border: "border-blue-200" },
  { label: "Free Shipping", emoji: "🚚", link: "/deals/5-sar", bg: "bg-green-50", border: "border-green-200" },
  { label: "Nearby Stores", emoji: "🏪", link: "/stores", bg: "bg-purple-50", border: "border-purple-200" },
  { label: "Send to PH", emoji: "💝", link: "/remittance", bg: "bg-pink-50", border: "border-pink-200" },
  { label: "New Arrivals", emoji: "✨", link: "/categories", bg: "bg-cyan-50", border: "border-cyan-200" },
];

const QuickLinks = () => {
  return (
    <section className="py-4 bg-card border-y border-border">
      <div className="container">
        <div className="flex overflow-x-auto gap-3 pb-1 scrollbar-hide md:grid md:grid-cols-8 md:overflow-visible">
          {quickLinks.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
            >
              <Link
                to={item.link}
                className={`flex flex-col items-center gap-2 min-w-[80px] py-3 px-2 rounded-xl ${item.bg} border ${item.border} hover:shadow-md transition-all group`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                <span className="text-[11px] font-semibold text-foreground/80 text-center leading-tight whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
