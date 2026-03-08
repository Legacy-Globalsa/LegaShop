import { motion } from "framer-motion";
import { Star, Flame, Plus } from "lucide-react";
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
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
              className="group bg-card flex flex-col h-full rounded-2xl p-4 shadow-sm hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/60 hover:border-primary/20"
            >
              <div className="relative mb-4">
                <div className="w-full aspect-square rounded-xl bg-slate-50 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
                  {deal.emoji}
                </div>
                <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-md font-bold ${deal.tag === "1 SAR" ? "bg-accent text-accent-foreground" : "bg-destructive text-white"} text-[10px] shadow-sm tracking-wider uppercase`}>
                  {deal.tag}
                </span>
                <button className="absolute -bottom-3 -right-3 w-10 h-10 bg-primary z-10 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1.5 flex-1 flex flex-col">
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug h-10">
                  {deal.name}
                </h3>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-accent" fill="currentColor" />
                  ))}
                  <span className="text-[10px] text-muted-foreground font-medium ml-1">(128)</span>
                </div>
                <div className="pt-2 flex items-baseline gap-2 mt-auto">
                  <span className="font-extrabold text-xl text-primary leading-none">{deal.price} <span className="text-sm font-bold">SAR</span></span>
                  <span className="text-xs text-muted-foreground line-through font-medium">{deal.oldPrice}</span>
                </div>
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
