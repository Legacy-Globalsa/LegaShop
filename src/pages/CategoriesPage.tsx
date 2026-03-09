import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allCategories = [
  {
    name: "Rice & Grains",
    emoji: "🍚",
    count: 45,
    bg: "from-amber-400 to-yellow-500",
    products: [
      { name: "Jasmine Rice 1kg", price: "1", emoji: "🍚", rating: 4.8, sold: 3240 },
      { name: "Thai Jasmine Rice 2kg", price: "5", emoji: "🍚", rating: 4.9, sold: 4200 },
      { name: "Sinandomeng Rice 5kg", price: "12", emoji: "🍚", rating: 4.7, sold: 1890 },
    ],
  },
  {
    name: "Canned Goods",
    emoji: "🥫",
    count: 120,
    bg: "from-red-400 to-rose-500",
    products: [
      { name: "Century Tuna 155g", price: "1", emoji: "🐟", rating: 4.7, sold: 2180 },
      { name: "Argentina Corned Beef", price: "5", emoji: "🥫", rating: 4.7, sold: 980 },
      { name: "Ligo Sardines 155g", price: "1", emoji: "🐟", rating: 4.4, sold: 980 },
    ],
  },
  {
    name: "Noodles",
    emoji: "🍜",
    count: 38,
    bg: "from-yellow-400 to-orange-500",
    products: [
      { name: "Lucky Me Pancit Canton x3", price: "5", emoji: "🍜", rating: 4.7, sold: 2840 },
      { name: "Pancit Canton Classic", price: "1", emoji: "🍜", rating: 4.7, sold: 2840 },
      { name: "Cup Noodles Mini", price: "1", emoji: "🍜", rating: 4.5, sold: 2010 },
    ],
  },
  {
    name: "Snacks",
    emoji: "🍿",
    count: 85,
    bg: "from-orange-400 to-red-500",
    products: [
      { name: "Oishi Prawn Crackers", price: "1", emoji: "🦐", rating: 4.3, sold: 670 },
      { name: "Boy Bawang Cornick", price: "1", emoji: "🌽", rating: 4.5, sold: 1450 },
      { name: "Piattos Cheese 85g", price: "1", emoji: "🥔", rating: 4.6, sold: 1340 },
    ],
  },
  {
    name: "Beverages",
    emoji: "🧃",
    count: 60,
    bg: "from-green-400 to-emerald-500",
    products: [
      { name: "Milo Sachet x10", price: "5", emoji: "☕", rating: 4.8, sold: 3120 },
      { name: "Nescafe 3in1 x10", price: "5", emoji: "☕", rating: 4.7, sold: 2340 },
      { name: "C2 Green Tea 500ml", price: "1", emoji: "🍵", rating: 4.3, sold: 1560 },
    ],
  },
  {
    name: "Condiments",
    emoji: "🧴",
    count: 55,
    bg: "from-purple-400 to-violet-500",
    products: [
      { name: "Silver Swan Soy Sauce", price: "5", emoji: "🧴", rating: 4.6, sold: 1560 },
      { name: "Datu Puti Vinegar", price: "1", emoji: "🧴", rating: 4.6, sold: 1120 },
      { name: "UFC Banana Ketchup", price: "3", emoji: "🍌", rating: 4.4, sold: 760 },
    ],
  },
  {
    name: "Frozen Foods",
    emoji: "🧊",
    count: 30,
    bg: "from-cyan-400 to-blue-500",
    products: [
      { name: "Purefoods Hotdog 500g", price: "5", emoji: "🌭", rating: 4.7, sold: 1120 },
      { name: "CDO Karne Norte 260g", price: "5", emoji: "🥩", rating: 4.5, sold: 890 },
      { name: "Tender Juicy Hotdog", price: "5", emoji: "🌭", rating: 4.6, sold: 2100 },
    ],
  },
  {
    name: "Personal Care",
    emoji: "🧼",
    count: 40,
    bg: "from-pink-400 to-rose-500",
    products: [
      { name: "Joy Dishwashing Liquid", price: "2", emoji: "🧴", rating: 4.4, sold: 1340 },
      { name: "Safeguard Soap", price: "1", emoji: "🧼", rating: 4.5, sold: 2230 },
      { name: "Palmolive Shampoo 15ml x6", price: "1", emoji: "🧴", rating: 4.3, sold: 890 },
    ],
  },
];

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-sky-500 to-cyan-600 py-10 md:py-14">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Browse All Categories
            </h1>
            <p className="text-white/80 text-base max-w-md mx-auto">
              Find your favorite Filipino products across all categories
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Sections */}
      <section className="py-8">
        <div className="container space-y-10">
          {allCategories.map((cat, catIdx) => (
            <div key={cat.name}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.bg} flex items-center justify-center text-xl`}>
                  {cat.emoji}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-foreground">{cat.name}</h2>
                  <p className="text-xs text-muted-foreground">{cat.count} products</p>
                </div>
              </div>

              {/* Products */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {cat.products.map((product, i) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group bg-card flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/50 hover:border-primary/20"
                  >
                    <div className="relative">
                      <div className="w-full aspect-square bg-slate-50 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
                        {product.emoji}
                      </div>
                      <button className="absolute bottom-2 right-2 w-8 h-8 bg-primary z-10 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-200">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3 space-y-1.5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <div className="pt-1 mt-auto">
                        <span className="font-extrabold text-base text-destructive leading-none">
                          {product.price} <span className="text-[10px] font-bold">SAR</span>
                        </span>
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

              {catIdx < allCategories.length - 1 && (
                <div className="border-b border-border mt-8" />
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoriesPage;
