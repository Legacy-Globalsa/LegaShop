import { motion } from "framer-motion";
import { ArrowRight, Heart, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import familyImg from "@/assets/family-ph.jpg";

const puregoldProducts = [
  { name: "Puregold Rice 5kg", price: "15", pesos: "₱223", emoji: "🍚", rating: 4.9, sold: 5200 },
  { name: "Lucky Me Noodles x24", price: "12", pesos: "₱178", emoji: "🍜", rating: 4.8, sold: 3400 },
  { name: "Century Tuna x12", price: "10", pesos: "₱149", emoji: "🐟", rating: 4.7, sold: 2100 },
  { name: "Argentina Corned Beef x6", price: "18", pesos: "₱267", emoji: "🥫", rating: 4.6, sold: 1890 },
  { name: "Bear Brand Milk 1kg", price: "8", pesos: "₱119", emoji: "🥛", rating: 4.8, sold: 2780 },
  { name: "Nescafe 3in1 x30", price: "12", pesos: "₱178", emoji: "☕", rating: 4.7, sold: 3200 },
  { name: "Safeguard Soap x6", price: "5", pesos: "₱74", emoji: "🧼", rating: 4.5, sold: 1560 },
  { name: "Joy Dishwashing 500ml", price: "3", pesos: "₱45", emoji: "🧴", rating: 4.4, sold: 920 },
  { name: "Del Monte Ketchup 1L", price: "5", pesos: "₱74", emoji: "🍅", rating: 4.6, sold: 780 },
  { name: "Silver Swan Soy 1L", price: "5", pesos: "₱74", emoji: "🧴", rating: 4.5, sold: 1340 },
  { name: "CDO Ulam Burger x8", price: "8", pesos: "₱119", emoji: "🍔", rating: 4.5, sold: 670 },
  { name: "Purefoods TJ Hotdog 1kg", price: "10", pesos: "₱149", emoji: "🌭", rating: 4.7, sold: 1890 },
];

const RemittancePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <img
          src={familyImg}
          alt="Family in the Philippines"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/90 via-rose-500/85 to-pink-500/70" />
        <div className="container">
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-semibold text-white mb-4">
                <Heart className="w-4 h-4" fill="currentColor" />
                For Your Family Back Home
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Send groceries to your <span className="text-yellow-300">pamilya</span> in the Philippines 🇵🇭
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-lg mx-auto mb-6">
                Browse Puregold products, pay in SAR, and your family picks up fresh groceries — or gets them delivered.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className="px-4 py-2 rounded-full bg-white/20 text-sm font-bold text-white">
                  Today: 1 SAR = ₱14.85
                </span>
                <span className="px-4 py-2 rounded-full bg-white/20 text-sm font-bold text-white">
                  🕐 60-90 min pickup
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-10 bg-card border-b border-border">
        <div className="container">
          <h2 className="text-xl font-extrabold text-foreground text-center mb-8">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Browse Puregold Catalog", desc: "Prices shown in SAR with ₱ equivalent", emoji: "🛒", color: "bg-primary" },
              { step: "2", title: "Pay in SAR", desc: "Via Mada, Visa, or Apple Pay", emoji: "💳", color: "bg-primary" },
              { step: "3", title: "Family Receives", desc: "SMS notification → pickup or delivery", emoji: "📱", color: "bg-destructive" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white text-lg font-bold mx-auto mb-3`}>
                  {item.step}
                </div>
                <span className="text-2xl block mb-2">{item.emoji}</span>
                <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-foreground">Puregold Products</h2>
            <span className="text-xs text-muted-foreground bg-accent/20 px-3 py-1 rounded-full font-medium">
              Prices in SAR • ₱ equivalent shown
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {puregoldProducts.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group bg-card flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/50 hover:border-destructive/20"
              >
                <div className="relative">
                  <div className="w-full aspect-square bg-rose-50 flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-105 transition-transform duration-300">
                    {product.emoji}
                  </div>
                  <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-destructive text-white">
                    🇵🇭 PH
                  </span>
                </div>
                <div className="p-3 space-y-1.5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-xs text-foreground group-hover:text-destructive transition-colors line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <div className="pt-1 mt-auto">
                    <span className="font-extrabold text-base text-destructive leading-none">
                      {product.price} <span className="text-[10px] font-bold">SAR</span>
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      ≈ {product.pesos}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-2.5 h-2.5 text-accent" fill="currentColor" />
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {product.rating} | {product.sold.toLocaleString()} sent
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-destructive text-white font-bold shadow-deal hover:opacity-90 transition-opacity">
              Send Groceries Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RemittancePage;
