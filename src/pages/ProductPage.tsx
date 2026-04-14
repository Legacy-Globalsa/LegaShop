import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Plus, Minus, ArrowLeft, Store, Tag, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchProductById, fetchProductReviews, type Product, type Review } from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/use-require-auth";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { requireAuth } = useRequireAuth();

  useEffect(() => {
    if (!id) return;
    const productId = Number(id);

    setLoading(true);
    fetchProductById(productId)
      .then((data) => setProduct(data))
      .finally(() => setLoading(false));

    fetchProductReviews(productId).then((data) => setReviews(data));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-square bg-muted animate-pulse rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-5 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-10 bg-muted animate-pulse rounded w-1/3 mt-6" />
              <div className="h-20 bg-muted animate-pulse rounded mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-6">This product may have been removed or doesn't exist.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const displayPrice = product.sale_price ?? product.price;
  const hasDiscount = product.sale_price !== null;
  const discountPercent = hasDiscount
    ? Math.round((1 - parseFloat(product.sale_price!) / parseFloat(product.price)) * 100)
    : 0;
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container py-3">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-primary transition">Categories</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <section className="container pb-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div className="aspect-square bg-slate-50 rounded-2xl border border-border flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <Package className="w-24 h-24 text-muted-foreground/30" />
              )}
            </div>
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-sm font-bold bg-destructive text-white">
                -{discountPercent}%
              </span>
            )}
            {product.is_deal && product.deal_type && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-lg text-sm font-bold bg-accent text-foreground">
                {product.deal_type === "ONE_RIYAL" ? "1 SAR" : "5 SAR"} Deal
              </span>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category & Store */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                <Tag className="w-3 h-3" />
                {product.category_name}
              </span>
              <Link to={`/stores/${product.store}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition">
                <Store className="w-3 h-3" />
                {product.store_name}
              </Link>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-1">
              {product.name}
            </h1>

            {product.name_tl && product.name_tl !== product.name && (
              <p className="text-sm text-muted-foreground mb-4">{product.name_tl}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-extrabold text-destructive">
                {displayPrice} <span className="text-base">{product.currency}</span>
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.price} {product.currency}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Stock */}
            <div className="mb-6">
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  In stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  Out of stock
                </span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-muted transition"
                  disabled={!inStock}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 py-2 text-sm font-bold min-w-[48px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2.5 hover:bg-muted transition"
                  disabled={!inStock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                disabled={!inStock}
                onClick={() => {
                  if (!requireAuth()) return;
                  addItem(product, quantity);
                  toast({ title: "Added to cart", description: `${quantity}× ${product.name}` });
                  setQuantity(1);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>

            {/* Unit info */}
            <p className="text-xs text-muted-foreground mt-3">
              Sold per {product.unit} · {product.currency} pricing
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="container pb-12">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm">{review.reviewer_name}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? "text-accent fill-current" : "text-muted-foreground/30"}`}
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Write a Review (stub form) */}
      <section className="container pb-12">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-bold text-base mb-3">Write a Review</h3>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-muted-foreground/30 cursor-pointer hover:text-accent transition"
              />
            ))}
          </div>
          <textarea
            placeholder="Share your experience with this product..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            rows={3}
          />
          <button
            className="mt-2 px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition"
            onClick={() => toast({ title: "Review submitted!", description: "Thank you for your feedback." })}
          >
            Submit Review
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductPage;
