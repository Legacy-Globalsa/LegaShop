import { motion } from "framer-motion";

const categories = [
  { name: "Rice & Grains", emoji: "🍚", count: 45 },
  { name: "Canned Goods", emoji: "🥫", count: 120 },
  { name: "Noodles", emoji: "🍜", count: 38 },
  { name: "Snacks", emoji: "🍿", count: 85 },
  { name: "Beverages", emoji: "🧃", count: 60 },
  { name: "Condiments", emoji: "🧴", count: 55 },
  { name: "Frozen", emoji: "🧊", count: 30 },
  { name: "Personal Care", emoji: "🧼", count: 40 },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-16 bg-secondary/50">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-foreground mb-8"
        >
          📦 Browse Categories
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.08, y: -4 }}
              className="bg-card rounded-2xl p-4 text-center shadow-card hover:shadow-card-hover transition-all cursor-pointer border border-border"
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <p className="font-bold text-sm text-foreground">{cat.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{cat.count} items</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
