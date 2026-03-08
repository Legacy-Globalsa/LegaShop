import { motion } from "framer-motion";
import { Store, Users, Zap, Coins } from "lucide-react";

const stats = [
  { value: "15,000+", label: "Baqalas in Riyadh", icon: Store, color: "text-primary", bg: "bg-primary/10" },
  { value: "800K+", label: "Filipinos in Riyadh", icon: Users, color: "text-secondary", bg: "bg-secondary/10" },
  { value: "15 min", label: "Avg. Delivery", icon: Zap, color: "text-accent", bg: "bg-accent/10" },
  { value: "1 SAR", label: "Deals Start At", icon: Coins, color: "text-destructive", bg: "bg-destructive/10" },
];

const StatsSection = () => {
  return (
    <section className="py-10 bg-card border-y border-border">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="flex items-center justify-center p-4 lg:p-6 gap-4"
            >
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
              </div>
              <div className="text-left">
                <div className="text-xl md:text-3xl font-extrabold text-foreground">{stat.value}</div>
                <div className="text-sm md:text-base text-muted-foreground mt-0.5 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
