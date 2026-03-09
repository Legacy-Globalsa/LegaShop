import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/legashop-logo1.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Coming Soon Top Banner */}
      <div className="bg-destructive text-white text-center py-1.5 px-4 text-xs font-semibold tracking-wide z-[60] relative">
        🚀 Launching Soon — LEGASHOP is in development &nbsp;|&nbsp; Free delivery on your first order!
      </div>
      
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border"
      >
      <div className="container flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="LEGASHOP" className="w-[110px] h-auto" />
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for products, brands, and stores..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-800 font-semibold hover:bg-sky-100 transition">
            <MapPin className="w-3.5 h-3.5" />
            <span>Al Batha, Riyadh</span>
          </button>
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition">
            <Search className="w-5 h-5 text-foreground/70" />
          </button>
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition">
            <ShoppingCart className="w-5 h-5 text-foreground/70" />
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-destructive text-white text-[10px] flex items-center justify-center font-bold">
              3
            </span>
          </button>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Category Nav */}
      <div className="hidden md:block border-t border-border bg-card">
        <div className="container flex items-center gap-1 h-10 text-xs font-semibold overflow-x-auto">
          <Link to="/deals/1-sar" className="px-3 py-1 rounded-md text-white bg-destructive hover:bg-destructive/90 transition whitespace-nowrap">🔥 1 SAR Deals</Link>
          <Link to="/deals/5-sar" className="px-3 py-1 rounded-md text-foreground/70 hover:text-primary hover:bg-primary/5 transition whitespace-nowrap">⭐ 5 SAR Deals</Link>
          <Link to="/categories" className="px-3 py-1 rounded-md text-foreground/70 hover:text-primary hover:bg-primary/5 transition whitespace-nowrap">Categories</Link>
          <Link to="/stores" className="px-3 py-1 rounded-md text-foreground/70 hover:text-primary hover:bg-primary/5 transition whitespace-nowrap">🏪 Nearby Baqalas</Link>
          <Link to="/remittance" className="px-3 py-1 rounded-md text-foreground/70 hover:text-primary hover:bg-primary/5 transition whitespace-nowrap">🇵🇭 Send to PH</Link>
          <span className="px-3 py-1 text-muted-foreground/50 whitespace-nowrap">|</span>
          <span className="px-3 py-1 text-muted-foreground/60 whitespace-nowrap cursor-default">Free Shipping</span>
          <span className="px-3 py-1 text-muted-foreground/60 whitespace-nowrap cursor-default">New Arrivals</span>
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
            <div className="container py-4 flex flex-col gap-1">
              <Link to="/deals/1-sar" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/5 font-medium text-sm">🔥 1 SAR Deals</Link>
              <Link to="/deals/5-sar" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/5 font-medium text-sm">⭐ 5 SAR Deals</Link>
              <Link to="/categories" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/5 font-medium text-sm">📦 Categories</Link>
              <Link to="/stores" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/5 font-medium text-sm">🏪 Nearby Baqalas</Link>
              <Link to="/remittance" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/5 font-medium text-sm">🇵🇭 Send to Philippines</Link>
              <div className="flex items-center gap-2 py-2 px-3 text-muted-foreground text-xs mt-2 border-t border-border">
                <MapPin className="w-3.5 h-3.5" />
                <span>Al Batha, Riyadh</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    </>
  );
};

export default Navbar;
