import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Plus, Star, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const flashDeals = [
  { name: "Jasmine Rice 1kg", price: "1", oldPrice: "3", image: "https://m.media-amazon.com/images/I/81x%2BQ20uX6L._AC_UL320_.jpg", tag: "1 SAR", discount: "-67%" },
  { name: "Lucky Me Pancit Canton x3", price: "5", oldPrice: "8", image: "https://luckyme.ph/static/uploads/products/product_12_4e90b3e9.webp", tag: "5 SAR", discount: "-38%" },
  { name: "Century Tuna 155g", price: "1", oldPrice: "2.5", image: "https://images.openfoodfacts.org/images/products/074/848/510/0401/front_en.54.400.jpg", tag: "1 SAR", discount: "-60%" },
  { name: "Silver Swan Soy Sauce", price: "5", oldPrice: "7", image: "https://kwalityphilfoodinc.com/wp-content/uploads/2023/12/Silver-Swan-Soy-Sauce.png", tag: "5 SAR", discount: "-29%" },
  { name: "Milo Sachet x10", price: "5", oldPrice: "9", image: "https://images.openfoodfacts.org/images/products/885/001/105/5375/front_en.3.400.jpg", tag: "5 SAR", discount: "-44%" },
  { name: "Skyflakes Crackers", price: "1", oldPrice: "2", image: "https://down-my.img.susercontent.com/file/f41385d87567b769131b8b1db3e25878", tag: "1 SAR", discount: "-50%" },
];

const useCountdown = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const getEndOfDay = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return end.getTime() - now.getTime();
    };

    const update = () => {
      const diff = getEndOfDay();
      setTime({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
};

const FlashDeals = () => {
  const countdown = useCountdown();

  return (
    <section className="py-8 bg-background">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-destructive" />
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Flash Sale</h2>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-xs text-muted-foreground font-medium">Ending in</span>
              <div className="flex items-center gap-1">
                {[
                  String(countdown.hours).padStart(2, "0"),
                  String(countdown.minutes).padStart(2, "0"),
                  String(countdown.seconds).padStart(2, "0"),
                ].map((val, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="bg-foreground text-white text-xs font-bold px-1.5 py-0.5 rounded min-w-[26px] text-center">
                      {val}
                    </span>
                    {i < 2 && <span className="text-foreground font-bold text-xs">:</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link
            to="/deals/1-sar"
            className="hidden md:flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product scroll */}
        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide md:grid md:grid-cols-6 md:overflow-visible">
          {flashDeals.map((deal, i) => (
            <motion.div
              key={deal.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="min-w-[160px] md:min-w-0 group bg-card flex flex-col h-full rounded-xl p-3 shadow-sm hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/60 hover:border-primary/30"
            >
              <div className="relative mb-3">
                <div className="w-full aspect-square rounded-lg bg-slate-50 overflow-hidden">
                  <img src={deal.image} alt={deal.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                </div>
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-destructive text-white">
                  {deal.discount}
                </span>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary z-10 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-200">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 flex-1 flex flex-col">
                <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {deal.name}
                </h3>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 text-accent" fill="currentColor" />
                  ))}
                </div>
                <div className="pt-1 mt-auto">
                  <span className="font-extrabold text-lg text-destructive leading-none">
                    {deal.price} <span className="text-xs font-bold">SAR</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground line-through font-medium ml-1.5">
                    {deal.oldPrice} SAR
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-1.5">
                  <div className="h-1.5 rounded-full bg-red-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-destructive"
                      style={{ width: `${60 + Math.random() * 30}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Selling fast!</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile see all */}
        <Link
          to="/deals/1-sar"
          className="md:hidden flex items-center justify-center gap-1 mt-4 text-sm text-primary font-semibold"
        >
          See All Deals <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default FlashDeals;
