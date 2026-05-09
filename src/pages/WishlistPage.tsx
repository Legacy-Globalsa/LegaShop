import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2, Loader2, ArrowLeft, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/use-api";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const { data: wishlistItems = [], isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Login to see your wishlist</h1>
          <p className="text-muted-foreground mb-6">Save products you love and find them here later.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
          >
            Log in
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="container py-6">
        <div className="flex items-center gap-3 mb-1">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">My Wishlist</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      <section className="container pb-12">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-20 h-20 mx-auto text-muted-foreground/20 mb-4" />
            <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Tap the ❤️ on any product to save it here for later.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlistItems.map((item, i) => {
              const product = item.product;
              const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
              const originalPrice = parseFloat(product.price);
              const discount = salePrice
                ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
                : 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 border border-border/50 hover:border-primary/20 flex flex-col"
                >
                  <Link to={`/products/${product.id}`} className="relative">
                    <div className="w-full aspect-square bg-white flex items-center justify-center overflow-hidden p-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Package className="w-16 h-16 text-muted-foreground/30" />
                      )}
                    </div>
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-destructive text-white">
                        -{discount}%
                      </span>
                    )}
                  </Link>

                  <div className="p-3 flex-1 flex flex-col gap-2">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                    </Link>

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
                      <p className="text-[10px] text-muted-foreground truncate">{product.store_name}</p>
                    )}

                    <div className="flex gap-2 mt-auto pt-2">
                      <button
                        onClick={() => {
                          addItem(product);
                          toast({ title: "Added to cart", description: `1× ${product.name}` });
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => {
                          removeFromWishlist.mutate(product.id);
                          toast({ title: "Removed from wishlist", description: product.name });
                        }}
                        className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default WishlistPage;
