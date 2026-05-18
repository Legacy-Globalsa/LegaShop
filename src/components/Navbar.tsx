import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, MapPin, User, LogOut, Package, ChevronDown, Settings, Store as StoreIcon, Heart, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useSearch } from "@/hooks/use-api";
import CartDrawer from "@/components/CartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/legashop-logo1.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const { data: searchResults, isLoading: searchLoading } = useSearch(debouncedQuery);

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Show dropdown when there are results
  useEffect(() => {
    if (debouncedQuery && searchResults) {
      setShowDropdown(true);
    }
  }, [debouncedQuery, searchResults]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = useCallback((path: string) => {
    setShowDropdown(false);
    setSearchQuery("");
    setDebouncedQuery("");
    navigate(path);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

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
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-6 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                setShowDropdown(false);
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setSearchQuery("");
                setDebouncedQuery("");
              }
            }}
            className="relative w-full"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (debouncedQuery && searchResults) setShowDropdown(true); }}
              onKeyDown={(e) => { if (e.key === "Escape") setShowDropdown(false); }}
              placeholder="Search for products, brands, and stores..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            />
          </form>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showDropdown && debouncedQuery && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-[60] overflow-hidden max-h-[400px] overflow-y-auto"
              >
                {searchLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Products */}
                    {searchResults && searchResults.products.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/50">Products</div>
                        {searchResults.products.slice(0, 5).map((p) => (
                          <button
                            key={`p-${p.id}`}
                            onClick={() => handleSelectResult(`/products/${p.id}`)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition text-left"
                          >
                            <div className="w-9 h-9 rounded-md bg-white border border-border overflow-hidden shrink-0 flex items-center justify-center">
                              {p.image_url ? (
                                <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-0.5" />
                              ) : (
                                <span className="text-sm">📦</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.sale_price ?? p.price} SAR</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Stores */}
                    {searchResults && searchResults.stores.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/50">Stores</div>
                        {searchResults.stores.slice(0, 3).map((s) => (
                          <button
                            key={`s-${s.id}`}
                            onClick={() => handleSelectResult(`/stores/${s.id}`)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition text-left"
                          >
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <StoreIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{s.name}</p>
                              <p className="text-xs text-muted-foreground">{s.district}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Categories */}
                    {searchResults && searchResults.categories.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/50">Categories</div>
                        {searchResults.categories.slice(0, 3).map((c) => (
                          <button
                            key={`c-${c.id}`}
                            onClick={() => handleSelectResult(`/categories?cat=${c.id}`)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition text-left"
                          >
                            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                              <span className="text-sm">📁</span>
                            </div>
                            <p className="text-sm font-medium truncate">{c.name}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No results */}
                    {searchResults && searchResults.products.length === 0 && searchResults.stores.length === 0 && searchResults.categories.length === 0 && (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                        No results for "{debouncedQuery}"
                      </div>
                    )}

                    {/* See all results */}
                    {searchResults && (searchResults.products.length > 0 || searchResults.stores.length > 0) && (
                      <button
                        onClick={() => handleSelectResult(`/search?q=${encodeURIComponent(debouncedQuery)}`)}
                        className="w-full px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition border-t border-border text-center"
                      >
                        See all results for "{debouncedQuery}" →
                      </button>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-800 font-semibold hover:bg-sky-100 transition">
            <MapPin className="w-3.5 h-3.5" />
            <span>Al Batha, Riyadh</span>
          </button>
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition" onClick={() => navigate("/search")}>
            <Search className="w-5 h-5 text-foreground/70" />
          </button>
          {isAuthenticated && (
            <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-slate-100 transition">
              <Heart className="w-5 h-5 text-foreground/70" />
            </Link>
          )}
          <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-lg hover:bg-slate-100 transition">
            <ShoppingCart className="w-5 h-5 text-foreground/70" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-white text-[10px] flex items-center justify-center font-bold leading-none">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Auth: Login button or User dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-accent transition">
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{user?.first_name || "Account"}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  <Settings className="w-4 h-4 mr-2" />
                  My Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  <Package className="w-4 h-4 mr-2" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                  <Heart className="w-4 h-4 mr-2" />
                  My Wishlist
                </DropdownMenuItem>
                {user?.role === "VENDOR" && (
                  <DropdownMenuItem onClick={() => navigate("/vendor")}>
                    <StoreIcon className="w-4 h-4 mr-2" />
                    Vendor Portal
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition"
            >
              <User className="w-3.5 h-3.5" />
              Login
            </Link>
          )}

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

              {/* Mobile auth section */}
              <div className="mt-2 pt-2 border-t border-border flex flex-col gap-1">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      Signed in as <span className="font-semibold text-foreground">{user?.first_name}</span>
                    </div>
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/5 font-medium text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" /> My Account
                    </Link>
                    <Link to="/orders" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/5 font-medium text-sm flex items-center gap-2">
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    {user?.role === "VENDOR" && (
                      <Link to="/vendor" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/5 font-medium text-sm flex items-center gap-2">
                        <StoreIcon className="w-4 h-4" /> Vendor Portal
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="py-2.5 px-3 rounded-lg text-destructive hover:bg-destructive/5 font-medium text-sm text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm text-center">
                      Login
                    </Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-lg border border-border text-foreground/80 hover:bg-accent font-medium text-sm text-center">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 py-2 px-3 text-muted-foreground text-xs mt-2 border-t border-border">
                <MapPin className="w-3.5 h-3.5" />
                <span>Al Batha, Riyadh</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default Navbar;
