import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, MapPin } from "lucide-react";
import logo from "@/assets/legashop-logo.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border"
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="LEGASHOP" className="h-10 w-10" />
          <span className="font-display font-extrabold text-xl text-primary">
            LEGASHOP
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#deals" className="text-foreground/70 hover:text-primary transition-colors">Deals</a>
          <a href="#categories" className="text-foreground/70 hover:text-primary transition-colors">Categories</a>
          <a href="#stores" className="text-foreground/70 hover:text-primary transition-colors">Nearby Baqalas</a>
          <a href="#remittance" className="text-foreground/70 hover:text-primary transition-colors">Send to PH</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground hover:bg-secondary/80 transition">
            <MapPin className="w-4 h-4" />
            <span>Al Batha, Riyadh</span>
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition">
            <Search className="w-5 h-5 text-foreground/70" />
          </button>
          <button className="relative p-2 rounded-lg hover:bg-secondary transition">
            <ShoppingCart className="w-5 h-5 text-foreground/70" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-tapang text-primary-foreground text-xs flex items-center justify-center font-bold">
              3
            </span>
          </button>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-card"
          >
            <div className="container py-4 flex flex-col gap-3">
              <a href="#deals" className="py-2 text-foreground/70 hover:text-primary font-medium">🔥 Deals</a>
              <a href="#categories" className="py-2 text-foreground/70 hover:text-primary font-medium">📦 Categories</a>
              <a href="#stores" className="py-2 text-foreground/70 hover:text-primary font-medium">🏪 Nearby Baqalas</a>
              <a href="#remittance" className="py-2 text-foreground/70 hover:text-primary font-medium">🇵🇭 Send to Philippines</a>
              <div className="flex items-center gap-2 py-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                <span>Al Batha, Riyadh</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
