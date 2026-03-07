import { motion } from "framer-motion";
import { Star, Flame } from "lucide-react";
import groceriesImg from "@/assets/filipino-groceries.jpg";

const deals = [
  { name: "Jasmine Rice 1kg", price: "1", oldPrice: "3", emoji: "🍚", tag: "1 SAR" },
  { name: "Lucky Me Noodles x3", price: "5", oldPrice: "8", emoji: "🍜", tag: "5 SAR" },
  { name: "Century Tuna 155g", price: "1", oldPrice: "2.5", emoji: "🐟", tag: "1 SAR" },
  { name: "Silver Swan Soy Sauce", price: "5", oldPrice: "7", emoji: "🧴", tag: "5 SAR" },
  { name: "Milo Sachet x10", price: "5", oldPrice: "9", emoji: "☕", tag: "5 SAR" },
  { name: "Skyflakes Crackers", price: "1", oldPrice: "2", emoji: "🍪", tag: "1 SAR" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const DealsSection = () => {
  return (
    <section id="deals" className="py-16 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <Flame className="w-7 h-7 text-tapang" />
          <h2 className="text-3xl font-extrabold text-foreground">Today's Deals</h2>
          <span className="deal-badge animate-pulse-glow">HOT</span>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {deals.map((deal) => (
            <motion.div
              key={deal.name}
              variants={item}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-card rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all cursor-pointer border border-border"
            >
              <div className="relative mb-3">
                <div className="w-full aspect-square rounded-xl bg-secondary flex items-center justify-center text-4xl">
                  {deal.emoji}
                </div>
                <span className={`absolute top-2 right-2 ${deal.tag === "1 SAR" ? "gold-badge" : "deal-badge"} text-xs`}>
                  {deal.tag}
                </span>
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {deal.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-extrabold text-lg text-primary">{deal.price} SAR</span>
                <span className="text-xs text-muted-foreground line-through">{deal.oldPrice} SAR</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-tala" fill="currentColor" />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-10 rounded-2xl overflow-hidden relative"
        >
          <img src={groceriesImg} alt="Filipino groceries" className="w-full h-48 md:h-64 object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div>
              <p className="text-primary-foreground font-extrabold text-2xl md:text-4xl mb-2">
                1 Riyal = ~₱15 Deals Every Day
              </p>
              <p className="text-primary-foreground/80 text-sm md:text-base">
                The most affordable Filipino essentials in Riyadh
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DealsSection;
