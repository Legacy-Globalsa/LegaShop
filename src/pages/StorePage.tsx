import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Phone, Plus, ArrowLeft, ArrowUpDown, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type Product } from "@/lib/api";
import { useStore, useStoreProducts, useStoreReviews } from "@/hooks/use-api";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/use-require-auth";

type SortOption = "relevance" | "price-low" | "price-high" | "deals";

const StorePage = () => {
  const { id } = useParams<{ id: string }>();
  const storeId = Number(id);
  const { data: store, isLoading: loading } = useStore(storeId);
  const { data: products = [] } = useStoreProducts(storeId);
  const { data: reviews = [] } = useStoreReviews(storeId);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const sortedProducts = (() => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => parseFloat(a.sale_price ?? a.price) - parseFloat(b.sale_price ?? b.price));
      case "price-high":
        return sorted.sort((a, b) => parseFloat(b.sale_price ?? b.price) - parseFloat(a.sale_price ?? a.price));
      case "deals":
        return sorted.sort((a, b) => (b.is_deal ? 1 : 0) - (a.is_deal ? 1 : 0));
      default:
        return sorted;
    }
  })();

  const { requireAuth } = useRequireAuth();

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth()) return;
    addItem(product);
    toast({ title: "Added to cart", description: `1× ${product.name}` });
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "relevance", label: "Default" },
    { value: "price-low", label: "Price: Low → High" },
    { value: "price-high", label: "Price: High → Low" },
    { value: "deals", label: "Deals First" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <div className="h-48 bg-muted animate-pulse rounded-2xl mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <span className="text-6xl block mb-4">🏪</span>
          <h1 className="text-2xl font-bold mb-2">Store not found</h1>
          <p className="text-muted-foreground mb-6">This store may have been removed or doesn't exist.</p>
          <Link to="/stores" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition">
            <ArrowLeft className="w-4 h-4" /> All Stores
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Store Header */}
      <section className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 py-10 md:py-14">
        <div className="container">
          <Link to="/stores" className="inline-flex items-center gap-1.5 text-white/70 text-sm font-medium hover:text-white transition mb-4">
            <ArrowLeft className="w-4 h-4" /> All Stores
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{store.name}</h1>
            {store.name_ar && (
              <p className="text-white/60 text-sm mb-3" dir="rtl">{store.name_ar}</p>
            )}
            <p className="text-white/80 text-base max-w-lg mb-4">{store.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {store.district}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                ~{store.avg_delivery_min} min delivery
              </span>
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Star className="w-4 h-4 text-accent" fill="currentColor" />
                {store.rating} ({reviews.length} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                {store.phone}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products toolbar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border py-3">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">
            <span className="font-bold text-foreground">{products.length}</span> products in this store
          </p>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-foreground bg-slate-100 rounded-lg hover:bg-slate-200 transition"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort
            </button>
            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[180px]">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted transition ${
                        sortBy === opt.value ? "text-primary bg-primary/5" : "text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-lg font-bold mb-2">No products yet</h2>
              <p className="text-muted-foreground text-sm">This store hasn't listed any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {sortedProducts.map((product, i) => {
                const displayPrice = product.sale_price ?? product.price;
                const hasDiscount = product.sale_price !== null;

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
                        <div className="w-full aspect-square bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <img src={product.image_url || ""} alt={product.name} className="w-full h-full object-contain p-4" />
                        </div>
                        {product.is_deal && product.deal_type && (
                          <span className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                            product.deal_type === "ONE_RIYAL" ? "bg-accent text-foreground" : "bg-primary text-white"
                          }`}>
                            {product.deal_type === "ONE_RIYAL" ? "1 SAR" : "5 SAR"}
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-destructive text-white">
                            -{Math.round((1 - parseFloat(product.sale_price!) / parseFloat(product.price)) * 100)}%
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
                        <span className="text-[10px] text-muted-foreground">{product.category_name}</span>
                        <div className="pt-1 mt-auto">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-extrabold text-base text-destructive leading-none">
                              {displayPrice} <span className="text-[10px] font-bold">SAR</span>
                            </span>
                            {hasDiscount && (
                              <span className="text-[10px] text-muted-foreground line-through">
                                {product.price}
                              </span>
                            )}
                          </div>
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

      {/* Store Reviews */}
      {reviews.length > 0 && (
        <section className="pb-12">
          <div className="container">
            <h2 className="text-xl font-bold mb-4">Customer Reviews ({reviews.length})</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="p-4 rounded-xl border border-border bg-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{review.reviewer_name}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`w-3.5 h-3.5 ${j < review.rating ? "text-accent fill-current" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground/60 mt-2">
                    {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default StorePage;
