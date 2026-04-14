import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, ArrowUpDown, X, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useCategories, useProducts } from "@/hooks/use-api";
import type { Product } from "@/lib/api";

const gradients = [
  "from-amber-400 to-yellow-500",
  "from-red-400 to-rose-500",
  "from-yellow-400 to-orange-500",
  "from-orange-400 to-red-500",
  "from-green-400 to-emerald-500",
  "from-purple-400 to-violet-500",
  "from-cyan-400 to-blue-500",
  "from-pink-400 to-rose-500",
];

const CategoriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const [activeFilter, setActiveFilter] = useState<string | null>(filterParam);
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high">("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: categories = [], isLoading: catLoading } = useCategories();
  const { data: products = [], isLoading: prodLoading } = useProducts();

  const isLoading = catLoading || prodLoading;

  useEffect(() => {
    setActiveFilter(filterParam);
  }, [filterParam]);

  const handleFilterClick = (catName: string) => {
    if (activeFilter === catName) {
      setActiveFilter(null);
      setSearchParams({});
    } else {
      setActiveFilter(catName);
      setSearchParams({ filter: catName });
    }
  };

  const { requireAuth } = useRequireAuth();

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth()) return;
    addItem(product);
    toast({ title: "Added to cart", description: `1× ${product.name}` });
  };

  // Group products by category
  const categoryGroups = useMemo(() => {
    return categories.map((cat, idx) => {
      const catProducts = products.filter((p) => p.category === cat.id || p.category_name === cat.name);
      return { ...cat, bg: gradients[idx % gradients.length], products: catProducts };
    }).filter((g) => g.products.length > 0);
  }, [categories, products]);

  // Filter categories by active filter
  const filteredCategories = activeFilter
    ? categoryGroups.filter((cat) => cat.name === activeFilter)
    : categoryGroups;

  // Sort products
  const sortProducts = (items: Product[]) => {
    const sorted = [...items];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => parseFloat(a.sale_price ?? a.price) - parseFloat(b.sale_price ?? b.price));
      case "price-high":
        return sorted.sort((a, b) => parseFloat(b.sale_price ?? b.price) - parseFloat(a.sale_price ?? a.price));
      default:
        return sorted;
    }
  };
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

      {/* Filter Bar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border py-3">
        <div className="container">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
              <button
                onClick={() => { setActiveFilter(null); setSearchParams({}); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  !activeFilter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                All
              </button>
              {categoryGroups.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleFilterClick(cat.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeFilter === cat.name ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="relative shrink-0">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-foreground bg-slate-100 rounded-lg hover:bg-slate-200 transition"
              >
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort
              </button>
              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[180px]">
                    {([["default", "Default"], ["price-low", "Price: Low → High"], ["price-high", "Price: High → Low"]] as const).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => { setSortBy(value); setShowSortMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted transition ${
                          sortBy === value ? "text-primary bg-primary/5" : "text-foreground"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {activeFilter && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">Filtered:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {activeFilter}
                <button onClick={() => { setActiveFilter(null); setSearchParams({}); }}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Category Sections */}
      <section className="py-8">
        <div className="container space-y-10">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredCategories.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No categories found.</p>
          ) : (
          filteredCategories.map((cat, catIdx) => (
            <div key={cat.id}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.bg} flex items-center justify-center text-xl overflow-hidden`}>
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-sm">{cat.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-foreground">{cat.name}</h2>
                  <p className="text-xs text-muted-foreground">{cat.products.length} products</p>
                </div>
              </div>

              {/* Products */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {sortProducts(cat.products).map((product, i) => {
                  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
                  const originalPrice = parseFloat(product.price);
                  const discount = salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
                  return (
                  <Link to={`/products/${product.id}`} key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group bg-card flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/50 hover:border-primary/20"
                  >
                    <div className="relative">
                      <div className="w-full aspect-square bg-slate-50 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
                        <img src={product.image_url || ""} alt={product.name} className="w-full h-full object-contain p-4" />
                      </div>
                      {discount > 0 && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-destructive text-white">
                          -{discount}%
                        </span>
                      )}
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
                          <span className="font-extrabold text-base text-destructive leading-none">
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

              {catIdx < filteredCategories.length - 1 && (
                <div className="border-b border-border mt-8" />
              )}
            </div>
          ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoriesPage;
