import { motion } from "framer-motion";
import { Plus, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useProducts } from "@/hooks/use-api";
import type { Product } from "@/lib/api";

const FeaturedProducts = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { requireAuth } = useRequireAuth();
  const { data: products = [], isLoading } = useProducts();

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth()) return;
    addItem(product);
    toast({ title: "Added to cart", description: `1× ${product.name}` });
  };

  return (
    <section className="py-8 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Filipino Favorites</h2>
          <Link
            to="/categories"
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.slice(0, 12).map((product, i) => {
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
                <div className="w-full aspect-square bg-white flex items-center justify-center overflow-hidden p-4 group-hover:bg-slate-50 transition-colors duration-300">
                  <img src={product.image_url || ""} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
                {discount > 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-destructive text-white">
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
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
