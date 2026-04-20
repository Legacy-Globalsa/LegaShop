import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, Search, Map } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useStores } from "@/hooks/use-api";
import StoreMap from "@/components/maps/StoreMap";
import baqalaImg from "@/assets/baqala-store.jpg";

const StoresPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMap, setShowMap] = useState(true);
  const { data: stores = [], isLoading, isError } = useStores();

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (store.name_ar && store.name_ar.toLowerCase().includes(searchTerm.toLowerCase())) ||
    store.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 py-10 md:py-14">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-4xl mb-2 block">🏪</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Nearby Baqalas
            </h1>
            <p className="text-white/80 text-base max-w-md mx-auto">
              Your neighborhood stores, now delivering to your door
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Location */}
      <div className="sticky top-0 z-30 bg-card border-b border-border py-3">
        <div className="container flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-50 text-sm text-sky-900 font-semibold">
            <MapPin className="w-4 h-4" />
            <span>Al Batha, Riyadh</span>
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stores..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              showMap
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">{showMap ? "Hide Map" : "Show Map"}</span>
          </button>
        </div>
      </div>

      {/* Store Map */}
      {showMap && !isLoading && !isError && filteredStores.length > 0 && (
        <section className="py-4">
          <div className="container">
            <StoreMap
              stores={filteredStores}
              height="350px"
            />
          </div>
        </section>
      )}

      {/* Store Grid */}
      <section className="py-8">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
                  <Skeleton className="h-36 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-9 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-3">😕</span>
              <h2 className="text-xl font-bold mb-2">Failed to load stores</h2>
              <p className="text-muted-foreground text-sm">Please check your connection and try again.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                <span className="font-bold text-foreground">{filteredStores.length}</span> stores near you
              </p>
              {filteredStores.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-3">🔍</span>
                  <h2 className="text-xl font-bold mb-2">No stores found</h2>
                  <p className="text-muted-foreground text-sm">Try a different search term.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredStores.map((store, i) => (
                    <Link to={`/stores/${store.id}`} key={store.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 cursor-pointer border border-border"
                      >
                        <div className="h-36 overflow-hidden relative">
                          <img src={store.image_url || baqalaImg} alt={store.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 space-y-3">
                          <h3 className="font-bold text-foreground">{store.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span>{store.district}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              {store.avg_delivery_min} min
                            </span>
                            <span className="flex items-center gap-1 font-bold text-foreground">
                              <Star className="w-3.5 h-3.5 text-accent" fill="currentColor" />
                              {store.rating?.toFixed(1) ?? "—"}
                            </span>
                          </div>
                          <span className="block w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold text-center hover:opacity-90 transition-opacity">
                            Browse Store
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoresPage;
