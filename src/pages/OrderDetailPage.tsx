import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Clock, CheckCircle, Truck, XCircle, MapPin, CreditCard, Store, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrder, useCancelOrder } from "@/hooks/use-api";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const statusSteps = [
  { key: "PENDING", label: "Pending", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { key: "PREPARING", label: "Preparing", icon: Package },
  { key: "OUT_FOR_DELIVERY", label: "On the way", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

const statusOrder = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, error } = useOrder(Number(orderId));
  const cancelMutation = useCancelOrder();
  const { toast } = useToast();

  const handleCancel = async () => {
    if (!order) return;
    try {
      await cancelMutation.mutateAsync(order.id);
      toast({ title: "Order cancelled", description: `Order #${order.id} has been cancelled.` });
    } catch (err) {
      toast({
        title: "Cancel failed",
        description: err instanceof Error ? err.message : "Could not cancel order.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h1 className="text-2xl font-bold mb-2">Order not found</h1>
          <p className="text-muted-foreground mb-6">This order may not exist or you don't have access.</p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isCancelled = order.status === "CANCELLED";
  const currentStepIndex = statusOrder.indexOf(order.status);
  const date = new Date(order.created_at);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-6 max-w-3xl mx-auto">
        {/* Back */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">Order #{order.id}</h1>
            <p className="text-sm text-muted-foreground">
              {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} at{" "}
              {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          {order.status === "PENDING" && (
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="px-4 py-2 text-sm font-semibold text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/5 transition disabled:opacity-60"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>

        {/* Status Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 mb-6"
        >
          <h2 className="text-sm font-bold mb-5">Order Status</h2>
          {isCancelled ? (
            <div className="flex items-center gap-3 text-red-600">
              <XCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Order Cancelled</p>
                <p className="text-xs text-muted-foreground">This order has been cancelled</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const StepIcon = step.icon;
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1 relative">
                    {index > 0 && (
                      <div
                        className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                          index <= currentStepIndex ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCurrent
                          ? "bg-primary text-white ring-4 ring-primary/20"
                          : isActive
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] mt-2 font-medium text-center ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Delivery Address */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Delivery Address
            </h2>
            {order.delivery_address_data ? (
              <>
                <p className="text-sm font-medium">{order.delivery_address_data.street}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {order.delivery_address_data.district}, {order.delivery_address_data.city}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {order.delivery_address_data.label}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Address not available</p>
            )}
          </motion.section>

          {/* Payment */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Payment
            </h2>
            <p className="text-sm">{order.payment?.method ?? "—"}</p>
            <p className="text-xs text-muted-foreground">
              Status: <span className={order.payment?.status === "PAID" ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>{order.payment?.status ?? "—"}</span>
            </p>
            {order.payment?.reference && (
              <p className="text-[10px] text-muted-foreground mt-1">Ref: {order.payment.reference}</p>
            )}
          </motion.section>
        </div>

        {/* Order Items */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 mb-6"
        >
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" />
            {order.store_name}
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                  {item.product_image ? (
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground">{item.quantity} × {item.price_at_order} SAR</p>
                </div>
                <span className="text-sm font-bold">
                  {item.line_total} SAR
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{order.subtotal} SAR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>{order.delivery_fee} SAR</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-destructive">{order.total} SAR</span>
            </div>
          </div>

          {order.note && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-1">Order Notes</h3>
                <p className="text-sm">{order.note}</p>
              </div>
            </>
          )}
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailPage;
