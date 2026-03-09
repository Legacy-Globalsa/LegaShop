import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const categories = [
  { name: "Rice & Grains", emoji: "🍚", count: 45, slug: "rice-grains", bg: "bg-amber-50" },
  { name: "Canned Goods", emoji: "🥫", count: 120, slug: "canned-goods", bg: "bg-red-50" },
  { name: "Noodles", emoji: "🍜", count: 38, slug: "noodles", bg: "bg-yellow-50" },
  { name: "Snacks", emoji: "🍿", count: 85, slug: "snacks", bg: "bg-orange-50" },
  { name: "Beverages", emoji: "🧃", count: 60, slug: "beverages", bg: "bg-green-50" },
  { name: "Condiments", emoji: "🧴", count: 55, slug: "condiments", bg: "bg-purple-50" },
  { name: "Frozen Foods", emoji: "🧊", count: 30, slug: "frozen", bg: "bg-cyan-50" },
  { name: "Personal Care", emoji: "🧼", count: 40, slug: "personal-care", bg: "bg-pink-50" },
  { name: "Bread & Bakery", emoji: "🍞", count: 22, slug: "bread-bakery", bg: "bg-amber-50" },
  { name: "Dairy & Eggs", emoji: "🥛", count: 35, slug: "dairy-eggs", bg: "bg-blue-50" },
];

const CategoryGrid = () => {
  return (
    <section className="py-8 bg-card border-y border-border">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Categories</h2>
          <Link
            to="/categories"
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-x-2 gap-y-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <Link
                to={`/categories`}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg ${cat.bg} border border-border flex items-center justify-center text-2xl sm:text-3xl group-hover:shadow-md group-hover:border-primary/40 group-hover:scale-105 transition-all duration-200`}>
                  {cat.emoji}
                </div>
                <p className="font-medium text-[10px] sm:text-xs text-foreground/80 group-hover:text-primary transition-colors text-center leading-tight">
                  {cat.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
