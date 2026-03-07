import { motion } from "framer-motion";

const stats = [
  { value: "15,000+", label: "Baqalas in Riyadh", emoji: "🏪" },
  { value: "800K+", label: "Filipinos in Riyadh", emoji: "🇵🇭" },
  { value: "15 min", label: "Avg. Delivery Time", emoji: "⚡" },
  { value: "1 SAR", label: "Deals Start At", emoji: "💰" },
];

const StatsSection = () => {
  return (
    <section className="py-12 gradient-hero">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <div className="text-2xl md:text-3xl font-extrabold text-primary-foreground">{stat.value}</div>
              <div className="text-sm text-primary-foreground/70 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
