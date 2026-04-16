import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Star, Plus, MapPin, Clock, ArrowUpDown, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { searchAll, type Product, type Store, type Category } from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/use-require-auth";

type SortOption = "relevance" | "price-low" | "price-high" | "rating" | "newest";
type ResultTab = "all" | "products" | "stores" | "categories";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ResultTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setStores([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    searchAll(query)
      .then((results) => {
        setProducts(results.products);
        setStores(results.stores);
        setCategories(results.categories);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => parseFloat(a.sale_price ?? a.price) - parseFloat(b.sale_price ?? b.price));
      case "price-high":
        return sorted.sort((a, b) => parseFloat(b.sale_price ?? b.price) - parseFloat(a.sale_price ?? a.price));
      case "newest":
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
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

  const totalResults = products.length + stores.length + categories.length;

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "relevance", label: "Relevance" },
    { value: "price-low", label: "Price: Low → High" },
    { value: "price-high", label: "Price: High → Low" },
    { value: "newest", label: "Newest First" },
  ];

  const tabs: { value: ResultTab; label: string; count: number }[] = [
    { value: "all", label: "All", count: totalResults },
    { value: "products", label: "Products", count: products.length },
    { value: "stores", label: "Stores", count: stores.length },
    { value: "categories", label: "Categories", count: categories.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Search Header */}
      <section className="bg-gradient-to-br from-slate-100 to-slate-50 border-b border-border py-6">
        <div className="container">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products, stores, categories..."
              className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
              autoFocus
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(""); setSearchParams({}); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </form>
          {query && !loading && (
            <p className="text-center text-sm text-muted-foreground mt-3">
              Found <span className="font-bold text-foreground">{totalResults}</span> results for "<span className="font-semibold text-foreground">{query}</span>"
            </p>
          )}
        </div>
      </section>

      {/* Tabs + Sort */}
      {query && (
        <div className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="container flex items-center justify-between py-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === tab.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
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
      )}

      {/* Results */}
      <section className="py-8">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !query ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">Search LEGASHOP</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Search for your favorite Filipino products, stores, and categories
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["Lucky Me", "Century Tuna", "Milo", "Rice", "Sardines", "Pinoy"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchParams({ q: term })}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">😕</span>
              <h2 className="text-xl font-bold text-foreground mb-2">No results found</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                We couldn't find anything for "{query}". Try a different search term.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["Rice", "Tuna", "Noodles", "Snacks", "Beverages"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchParams({ q: term })}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Categories Results */}
              {(activeTab === "all" || activeTab === "categories") && categories.length > 0 && (
                <div>
                  {activeTab === "all" && (
                    <h2 className="text-lg font-bold text-foreground mb-3">Categories</h2>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/categories?filter=${cat.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition"
                      >
                        <span className="font-semibold text-sm text-foreground">{cat.name}</span>
                        <span className="text-xs text-muted-foreground">({cat.name_tl})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Stores Results */}
              {(activeTab === "all" || activeTab === "stores") && stores.length > 0 && (
                <div>
                  {activeTab === "all" && (
                    <h2 className="text-lg font-bold text-foreground mb-3">Stores</h2>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stores.map((store, i) => (
                      <Link to={`/stores/${store.id}`} key={store.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-sm transition space-y-2"
                        >
                          <h3 className="font-bold text-foreground">{store.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{store.description}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-primary" />
                              {store.district}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              {store.avg_delivery_min} min
                            </span>
                            <span className="flex items-center gap-1 font-bold text-foreground">
                              <Star className="w-3.5 h-3.5 text-accent" fill="currentColor" />
                              {store.rating}
                            </span>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Results */}
              {(activeTab === "all" || activeTab === "products") && sortedProducts.length > 0 && (
                <div>
                  {activeTab === "all" && (
                    <h2 className="text-lg font-bold text-foreground mb-3">Products</h2>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {sortedProducts.map((product, i) => {
                      const displayPrice = product.sale_price ?? product.price;
                      const hasDiscount = product.sale_price !== null;

                      return (
                        <Link to={`/products/${product.id}`} key={product.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.03 }}
                            className="group bg-card flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/50 hover:border-primary/20"
                          >
                            <div className="relative">
                              <div className="w-full aspect-square bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <img src={product.image_url || ""} alt={product.name} className="w-full h-full object-contain p-4" />
                              </div>
                              {product.is_deal && product.deal_type && (
                                <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-accent text-foreground">
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
                              <p className="text-[10px] text-muted-foreground">{product.store_name}</p>
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
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SearchResults;
