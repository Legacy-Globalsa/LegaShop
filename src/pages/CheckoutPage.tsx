import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CreditCard, Banknote, Smartphone, Check, Plus, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Address, AddressInput, fetchAddresses, createAddress } from "@/lib/api";
import AddressFormDialog from "@/components/account/AddressFormDialog";
import { Separator } from "@/components/ui/separator";

type PaymentMethod = "COD" | "MADA" | "VISA";

const paymentMethods = [
  { id: "COD" as PaymentMethod, label: "Cash on Delivery", icon: Banknote, description: "Pay when you receive your order" },
  { id: "MADA" as PaymentMethod, label: "Mada", icon: CreditCard, description: "Saudi debit card" },
  { id: "VISA" as PaymentMethod, label: "Visa / Mastercard", icon: CreditCard, description: "Credit or debit card" },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<number | undefined>();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("COD");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);

  const loadAddresses = useCallback(async () => {
    if (!isAuthenticated) {
      setAddressLoading(false);
      return;
    }
    try {
      const data = await fetchAddresses();
      setAddresses(data);
      const defaultAddr = data.find((a) => a.is_default) ?? data[0];
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    } catch {
      // fallback already handled in fetchAddresses
    } finally {
      setAddressLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleAddAddress = async (data: AddressInput) => {
    setAddressSaving(true);
    try {
      const newAddr = await createAddress(data);
      await loadAddresses();
      setSelectedAddress(newAddr.id);
      setAddressDialogOpen(false);
    } catch {
      // error handled by API layer
    } finally {
      setAddressSaving(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <span className="text-6xl block mb-4">🛒</span>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    // Simulate order creation (replace with real API in Phase 4)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const orderId = Math.floor(1000 + Math.random() * 9000);
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Checkout</span>
        </nav>

        <h1 className="text-2xl font-extrabold mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Delivery Address
              </h2>
              {!isAuthenticated && (
                <p className="text-sm text-muted-foreground mb-4">
                  <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link> to use your saved addresses, or continue as guest.
                </p>
              )}
              {addressLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-border rounded-lg">
                  <MapPin className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No saved addresses</p>
                  <button onClick={() => setAddressDialogOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition">
                    <Plus className="w-4 h-4" /> Add Address
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                          selectedAddress === addr.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-0.5 accent-primary"
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{addr.label}</span>
                            {addr.is_default && (
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {addr.street}, {addr.district}, {addr.city}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setAddressDialogOpen(true)}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Add new address
                  </button>
                </>
              )}
            </motion.section>

            {/* Payment Method */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Payment Method
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                      selectedPayment === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="accent-primary"
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                    />
                    <method.icon className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-sm font-semibold">{method.label}</span>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                    {selectedPayment === method.id && (
                      <Check className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </label>
                ))}
              </div>
            </motion.section>

            {/* Order Notes */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="text-base font-bold mb-3">Order Notes (Optional)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., leave at the gate, call before delivery..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none"
              />
            </motion.section>
          </div>

          {/* Right: Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-xl border border-border bg-card p-6 sticky top-28"
            >
              <h2 className="text-base font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => {
                  const price = parseFloat(product.sale_price ?? product.price);
                  return (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-muted border border-border overflow-hidden shrink-0">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-0.5" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground">{quantity} × {price.toFixed(2)} SAR</p>
                      </div>
                      <span className="text-xs font-bold">{(price * quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-semibold">{deliveryFee.toFixed(2)} SAR</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-base font-bold mb-6">
                <span>Total</span>
                <span className="text-destructive">{total.toFixed(2)} SAR</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>Place Order — {total.toFixed(2)} SAR</>
                )}
              </button>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                By placing this order you agree to our Terms of Service
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <AddressFormDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        address={null}
        saving={addressSaving}
        onSubmit={handleAddAddress}
      />
      <Footer />
    </div>
  );
};

export default CheckoutPage;
