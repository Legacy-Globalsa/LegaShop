import { motion } from "framer-motion";
import { Star, Plus, Filter, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fiveSarProducts = [
  { name: "Lucky Me Pancit Canton x3", oldPrice: "8", emoji: "🍜", rating: 4.7, sold: 2840, discount: "-38%" },
  { name: "Silver Swan Soy Sauce 1L", oldPrice: "7", emoji: "🧴", rating: 4.6, sold: 1560, discount: "-29%" },
  { name: "Milo Sachet x10", oldPrice: "9", emoji: "☕", rating: 4.8, sold: 3120, discount: "-44%" },
  { name: "Argentina Corned Beef 260g", oldPrice: "8", emoji: "🥫", rating: 4.7, sold: 980, discount: "-38%" },
  { name: "Bear Brand Milk 300g", oldPrice: "8", emoji: "🥛", rating: 4.8, sold: 1580, discount: "-38%" },
  { name: "Nescafe 3in1 x10", oldPrice: "9", emoji: "☕", rating: 4.7, sold: 2340, discount: "-44%" },
  { name: "Purefoods Hotdog 500g", oldPrice: "8", emoji: "🌭", rating: 4.7, sold: 1120, discount: "-38%" },
  { name: "CDO Karne Norte 260g", oldPrice: "8", emoji: "🥩", rating: 4.5, sold: 890, discount: "-38%" },
  { name: "UFC Banana Ketchup 550g", oldPrice: "7", emoji: "🍌", rating: 4.4, sold: 760, discount: "-29%" },
  { name: "Del Monte Fruit Cocktail", oldPrice: "9", emoji: "🍑", rating: 4.6, sold: 670, discount: "-44%" },
  { name: "Coconut Cream 400ml x2", oldPrice: "8", emoji: "🥥", rating: 4.5, sold: 445, discount: "-38%" },
  { name: "Alaska Evaporada 370ml", oldPrice: "7", emoji: "🥛", rating: 4.6, sold: 1230, discount: "-29%" },
  { name: "Spam Luncheon Meat 200g", oldPrice: "9", emoji: "🍖", rating: 4.8, sold: 2560, discount: "-44%" },
  { name: "Kopiko Brown Coffee x10", oldPrice: "8", emoji: "☕", rating: 4.5, sold: 1890, discount: "-38%" },
  { name: "Jack n Jill Chippy x5", oldPrice: "7", emoji: "🌽", rating: 4.3, sold: 1340, discount: "-29%" },
  { name: "Tang Orange Juice 375g", oldPrice: "7.5", emoji: "🍊", rating: 4.4, sold: 920, discount: "-33%" },
  { name: "Mega Sardines 425g", oldPrice: "7", emoji: "🐟", rating: 4.5, sold: 1670, discount: "-29%" },
  { name: "Thai Jasmine Rice 2kg", oldPrice: "8", emoji: "🍚", rating: 4.9, sold: 4200, discount: "-38%" },
];

const FiveSarDeals = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary via-sky-400 to-cyan-500 py-10 md:py-16">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-5xl md:text-6xl mb-3 block">⭐</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              5 SAR Deals
            </h1>
            <p className="text-white/80 text-lg max-w-lg mx-auto">
              Premium value packs at just 5 Riyals (~₱75). Best deals for your kitchen!
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-bold text-white">
              🕐 New deals every day at 12:00 AM
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-card border-b border-border py-3">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">
            <span className="font-bold text-foreground">{fiveSarProducts.length}</span> products
          </p>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-foreground bg-slate-100 rounded-lg hover:bg-slate-200 transition">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-foreground bg-slate-100 rounded-lg hover:bg-slate-200 transition">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-8">
        <div className="container">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {fiveSarProducts.map((product, i) => (
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
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-destructive text-white">
                    {product.discount}
                  </span>
                  <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white">
                    5 SAR
                  </span>
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
                      <span className="font-extrabold text-lg text-destructive leading-none">
                        5 <span className="text-[10px] font-bold">SAR</span>
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

      <Footer />
    </div>
  );
};

export default FiveSarDeals;
