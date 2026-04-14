import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, ShoppingBag, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrders } from "@/hooks/use-api";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  PREPARING: { label: "Preparing", color: "bg-orange-100 text-orange-700", icon: Package },
  OUT_FOR_DELIVERY: { label: "On the way", color: "bg-sky-100 text-sky-700", icon: Truck },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
};

const OrdersPage = () => {
  const { data: orders = [], isLoading, error } = useOrders();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          My Orders
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">😕</span>
            <h2 className="text-xl font-bold mb-2">Could not load orders</h2>
            <p className="text-muted-foreground mb-6">Please try again later or check your connection.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">📦</span>
            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping and your orders will appear here.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
            >
              <ShoppingBag className="w-4 h-4" /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const config = statusConfig[order.status] ?? statusConfig.PENDING;
              const StatusIcon = config.icon;
              const date = new Date(order.created_at);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/orders/${order.id}`}
                    className="block rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">Order #{order.id}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${config.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <span>{order.store_name}</span>
                      <span>·</span>
                      <span>{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span>·</span>
                      <span>{date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>

                    {/* Item thumbnails */}
                    <div className="flex items-center gap-2 mb-3">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item.id} className="w-10 h-10 rounded-md bg-muted border border-border overflow-hidden shrink-0">
                          {item.product_image ? (
                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm">📦</div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <span className="text-xs text-muted-foreground">+{order.items.length - 4} more</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items · {order.payment?.method ?? "COD"}
                      </span>
                      <span className="text-sm font-bold text-destructive">{order.total} SAR</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;
