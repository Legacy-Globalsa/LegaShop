import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpDown, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useDeals } from "@/hooks/use-api";
import type { Product } from "@/lib/api";

type SortOption = "default" | "price-low" | "price-high" | "name";

const FiveSarDeals = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { data: products = [], isLoading } = useDeals("FIVE_RIYAL");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category_name))], [products]);

  const filteredAndSorted = useMemo(() => {
    let items = [...products];
    if (categoryFilter) {
      items = items.filter((p) => p.category_name === categoryFilter);
    }
    switch (sortBy) {
      case "price-low": return items.sort((a, b) => parseFloat(a.sale_price ?? a.price) - parseFloat(b.sale_price ?? b.price));
      case "price-high": return items.sort((a, b) => parseFloat(b.sale_price ?? b.price) - parseFloat(a.sale_price ?? a.price));
      case "name": return items.sort((a, b) => a.name.localeCompare(b.name));
      default: return items;
    }
  }, [products, sortBy, categoryFilter]);

  const { requireAuth } = useRequireAuth();

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth()) return;
    addItem(product);
    toast({ title: "Added to cart", description: `1× ${product.name}` });
  };

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
        <div className="container flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">
              <span className="font-bold text-foreground">{filteredAndSorted.length}</span> products
            </p>
            <div className="relative">
              <button onClick={() => setShowSortMenu(!showSortMenu)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-foreground bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <ArrowUpDown className="w-3.5 h-3.5" /> {sortBy === "default" ? "Sort" : sortBy === "price-low" ? "Price: Low → High" : sortBy === "price-high" ? "Price: High → Low" : "Name A-Z"}
              </button>
              {showSortMenu && (
                <div className="absolute right-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-lg z-40">
                  {([["default","Default"],["price-low","Price: Low → High"],["price-high","Price: High → Low"],["name","Name A-Z"]] as [SortOption, string][]).map(([val, label]) => (
                    <button key={val} onClick={() => { setSortBy(val); setShowSortMenu(false); }} className={`block w-full text-left px-4 py-2 text-xs hover:bg-muted ${sortBy === val ? "font-bold text-primary" : ""}`}>{label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button onClick={() => setCategoryFilter(null)} className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${!categoryFilter ? "bg-primary text-white font-bold" : "bg-slate-100 text-foreground hover:bg-slate-200"}`}>All</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${categoryFilter === cat ? "bg-primary text-white font-bold" : "bg-slate-100 text-foreground hover:bg-slate-200"}`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-8">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No deals found.</p>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredAndSorted.map((product, i) => {
              const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
              const originalPrice = parseFloat(product.price);
              const discount = salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
              return (
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
                    <img src={product.image_url || ""} alt={product.name} className="w-full h-full object-contain p-4" />
                  </div>
                  {discount > 0 && (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-destructive text-white">
                    -{discount}%
                  </span>
                  )}
                  <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white">
                    5 SAR
                  </span>
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
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
                        {salePrice ?? originalPrice} <span className="text-[10px] font-bold">SAR</span>
                      </span>
                      {salePrice && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        {originalPrice} SAR
                      </span>
                      )}
                    </div>
                    {product.store_name && (
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      {product.store_name}
                    </p>
                    )}
                  </div>
                </div>
              </motion.div>
              </Link>
              );
            })}
          </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FiveSarDeals;
