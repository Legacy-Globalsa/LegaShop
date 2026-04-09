import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-16 max-w-lg mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-extrabold mb-2">Order Placed!</h1>
          <p className="text-muted-foreground mb-1">
            Thank you for your order. Your items are being prepared.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Order #{orderId}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 mb-8"
        >
          <h2 className="text-sm font-bold mb-4">What happens next?</h2>
          <div className="space-y-4 text-left">
            {[
              { step: "1", title: "Order Confirmed", desc: "The store has received your order", done: true },
              { step: "2", title: "Preparing", desc: "Your items are being packed", done: false },
              { step: "3", title: "Out for Delivery", desc: "On the way to your address", done: false },
              { step: "4", title: "Delivered", desc: "Enjoy your groceries!", done: false },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    item.done
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.done ? <CheckCircle className="w-4 h-4" /> : item.step}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${item.done ? "text-green-700" : ""}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
          >
            <Package className="w-4 h-4" />
            View My Orders
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-border rounded-lg font-semibold text-sm hover:bg-accent transition"
          >
            <Home className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
