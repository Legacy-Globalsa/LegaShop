import { motion } from "framer-motion";
import { Star, Plus, Filter, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from "@/lib/mock-data";

const oneSarProducts = [
  { id: 1, name: "Jasmine Rice 1kg", oldPrice: "3", image: "https://m.media-amazon.com/images/I/81x%2BQ20uX6L._AC_UL320_.jpg", rating: 4.8, sold: 3240, discount: "-67%" },
  { id: 2, name: "Century Tuna 155g", oldPrice: "2.5", image: "https://images.openfoodfacts.org/images/products/074/848/510/0401/front_en.54.400.jpg", rating: 4.7, sold: 2180, discount: "-60%" },
  { id: 3, name: "Skyflakes Crackers", oldPrice: "2", image: "https://down-my.img.susercontent.com/file/f41385d87567b769131b8b1db3e25878", rating: 4.6, sold: 1890, discount: "-50%" },
  { id: 4, name: "Knorr Sinigang Mix", oldPrice: "2.5", image: "https://assets.unileversolutions.com/v1/1648400.png", rating: 4.9, sold: 2100, discount: "-60%" },
  { id: 5, name: "Oishi Prawn Crackers", oldPrice: "2", image: "https://kwalityphilfoodinc.com/wp-content/uploads/2023/12/Oishi-Prawn.png", rating: 4.3, sold: 670, discount: "-50%" },
  { id: 6, name: "Magic Sarap 8g x12", oldPrice: "3", image: "https://clt-enterprise.com/wp-content/uploads/2020/09/magic-sarap-scaled.jpg", rating: 4.9, sold: 3200, discount: "-67%" },
  { id: 7, name: "Boy Bawang Cornick", oldPrice: "2", image: "http://cdn.shopify.com/s/files/1/0620/7881/2340/products/boy-bawang-cornick-garlic-flavour-100g-snack-foods-745_grande.png?v=1662141671", rating: 4.5, sold: 1450, discount: "-50%" },
  { id: 8, name: "Ligo Sardines 155g", oldPrice: "2.5", image: "https://cf.shopee.ph/file/sg-11134201-22110-hdbgd983npjv83", rating: 4.4, sold: 980, discount: "-60%" },
];

const OneSarDeals = () => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent, productId: number, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      addItem(product);
      toast({ title: "Added to cart", description: `1× ${productName}` });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-accent via-yellow-300 to-orange-400 py-10 md:py-16">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-5xl md:text-6xl mb-3 block">🔥</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
              1 SAR Deals
            </h1>
            <p className="text-foreground/70 text-lg max-w-lg mx-auto">
              Groceries starting at just 1 Riyal (~₱15). Refresh daily for new deals!
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/10 text-sm font-bold text-foreground">
              🕐 New deals every day at 12:00 AM
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-card border-b border-border py-3">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">
            <span className="font-bold text-foreground">{oneSarProducts.length}</span> products
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
            {oneSarProducts.map((product, i) => (
              <Link to={`/products/${product.id}`} key={product.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group bg-card flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/50 hover:border-primary/20"
              >
                <div className="relative">
                  <div className="w-full aspect-square bg-slate-50 flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-105 transition-transform duration-300">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
                  </div>
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-destructive text-white">
                    {product.discount}
                  </span>
                  <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-accent text-foreground">
                    1 SAR
                  </span>
                  <button
                    onClick={(e) => handleQuickAdd(e, product.id, product.name)}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-primary z-10 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-200"
                  >
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
                        1 <span className="text-[10px] font-bold">SAR</span>
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OneSarDeals;
