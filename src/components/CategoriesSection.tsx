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
    <section id="categories" className="py-16 bg-sky-50/50 border-b border-border">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-foreground mb-10 text-center"
        >
          Explore Categories
        </motion.h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-y-8 gap-x-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2, delay: 0 } }}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-sm border border-border flex items-center justify-center text-4xl sm:text-5xl group-hover:shadow-md group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300">
                {cat.emoji}
              </div>
              <div className="text-center">
                <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">{cat.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{cat.count} items</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
