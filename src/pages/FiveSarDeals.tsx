import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Plus, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from "@/lib/mock-data";

const fiveSarProducts = [
  { id: 9, name: "Lucky Me Pancit Canton x3", oldPrice: "8", image: "https://luckyme.ph/static/uploads/products/product_12_4e90b3e9.webp", rating: 4.7, sold: 2840, discount: "-38%", category: "Noodles" },
  { id: 10, name: "Silver Swan Soy Sauce 1L", oldPrice: "7", image: "https://clt-enterprise.com/wp-content/uploads/2018/10/Silver-Swan-Soy-sauce.jpg", rating: 4.6, sold: 1560, discount: "-29%", category: "Condiments" },
  { id: 11, name: "Milo Sachet x10", oldPrice: "9", image: "https://images.openfoodfacts.org/images/products/885/001/105/5375/front_en.3.400.jpg", rating: 4.8, sold: 3120, discount: "-44%", category: "Beverages" },
  { id: 12, name: "Argentina Corned Beef 260g", oldPrice: "8", image: "https://masaganaoriental.com/wp-content/uploads/60_original.jpg", rating: 4.7, sold: 980, discount: "-38%", category: "Canned Goods" },
  { id: 13, name: "Bear Brand Milk 300g", oldPrice: "8", image: "https://bahaykubo.co.uk/wp-content/uploads/2023/02/BBPM.webp", rating: 4.8, sold: 1580, discount: "-38%", category: "Beverages" },
  { id: 14, name: "Nescafe 3in1 x10", oldPrice: "9", image: "https://www.nescafe.com/mena/sites/default/files/2023-08/AE_ae_NES_3.0 Website_3in1 Classic_IMG-1_960by960px_230713_1_1689313729902_1.png", rating: 4.7, sold: 2340, discount: "-44%", category: "Beverages" },
  { id: 15, name: "Purefoods Hotdog 500g", oldPrice: "8", image: "https://down-ph.img.susercontent.com/file/4f5e3cccfe4d22cf8cdb8b8dc6dcd467_tn.webp", rating: 4.7, sold: 1120, discount: "-38%", category: "Frozen Foods" },
  { id: 16, name: "CDO Karne Norte 260g", oldPrice: "8", image: "https://www.srssulit.com/wp-content/uploads/products/8867-1.png", rating: 4.5, sold: 890, discount: "-38%", category: "Canned Goods" },
];

type SortOption = "default" | "rating" | "most-sold" | "discount";

const FiveSarDeals = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const categories = [...new Set(fiveSarProducts.map((p) => p.category))];

  const filteredAndSorted = useMemo(() => {
    let items = [...fiveSarProducts];
    if (categoryFilter) {
      items = items.filter((p) => p.category === categoryFilter);
    }
    switch (sortBy) {
      case "rating": return items.sort((a, b) => b.rating - a.rating);
      case "most-sold": return items.sort((a, b) => b.sold - a.sold);
      case "discount": return items.sort((a, b) => parseFloat(b.discount) - parseFloat(a.discount));
      default: return items;
    }
  }, [sortBy, categoryFilter]);

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
                <ArrowUpDown className="w-3.5 h-3.5" /> {sortBy === "default" ? "Sort" : sortBy === "rating" ? "Highest Rated" : sortBy === "most-sold" ? "Most Sold" : "Biggest Discount"}
              </button>
              {showSortMenu && (
                <div className="absolute right-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-lg z-40">
                  {([["default","Default"],["rating","Highest Rated"],["most-sold","Most Sold"],["discount","Biggest Discount"]] as const).map(([val, label]) => (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredAndSorted.map((product, i) => (
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
                  <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white">
                    5 SAR
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FiveSarDeals;
