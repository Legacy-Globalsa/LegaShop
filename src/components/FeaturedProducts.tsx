import { motion } from "framer-motion";
import { Star, Plus, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  { name: "CDO Karne Norte 150g", price: "3", oldPrice: "5", emoji: "🥩", rating: 4.8, sold: 1240, tag: "Best Seller" },
  { name: "Argentina Corned Beef 260g", price: "5", oldPrice: "8", emoji: "🥫", rating: 4.7, sold: 980, tag: "Popular" },
  { name: "Knorr Sinigang Mix", price: "1", oldPrice: "2.5", emoji: "🍲", rating: 4.9, sold: 2100, tag: "Top Pick" },
  { name: "Del Monte Tomato Sauce", price: "3", oldPrice: "4.5", emoji: "🍅", rating: 4.6, sold: 756, tag: "" },
  { name: "Bear Brand Milk 300g", price: "5", oldPrice: "8", emoji: "🥛", rating: 4.8, sold: 1580, tag: "Popular" },
  { name: "UFC Banana Ketchup", price: "3", oldPrice: "5", emoji: "🍌", rating: 4.5, sold: 892, tag: "" },
  { name: "Joy Dishwashing Liquid", price: "2", oldPrice: "3.5", emoji: "🧴", rating: 4.4, sold: 1340, tag: "" },
  { name: "Nescafe 3-in-1 x10", price: "5", oldPrice: "9", emoji: "☕", rating: 4.7, sold: 2340, tag: "Best Seller" },
  { name: "Magic Sarap 8g x12", price: "2", oldPrice: "3", emoji: "✨", rating: 4.9, sold: 3200, tag: "Top Pick" },
  { name: "Oishi Prawn Crackers", price: "1", oldPrice: "2", emoji: "🦐", rating: 4.3, sold: 670, tag: "" },
  { name: "Coconut Cream 400ml", price: "3", oldPrice: "5", emoji: "🥥", rating: 4.6, sold: 445, tag: "" },
  { name: "Purefoods Hotdog 500g", price: "5", oldPrice: "8", emoji: "🌭", rating: 4.7, sold: 1120, tag: "Popular" },
];

const FeaturedProducts = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Filipino Favorites</h2>
          <Link
            to="/categories"
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="group bg-card flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/50 hover:border-primary/20"
            >
              <div className="relative">
                <div className="w-full aspect-square bg-slate-50 flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-105 transition-transform duration-300">
                  {product.emoji}
                </div>
                {product.tag && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-destructive text-white">
                    {product.tag}
                  </span>
                )}
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-primary z-10 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-200">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 space-y-1.5 flex-1 flex flex-col">
                <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {product.name}
                </h3>
                <div className="pt-1 mt-auto">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-extrabold text-base text-destructive leading-none">
                      {product.price} <span className="text-[10px] font-bold">SAR</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground line-through">
                      {product.oldPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-2.5 h-2.5 text-accent" fill="currentColor" />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {product.rating} | {product.sold.toLocaleString()} sold
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
