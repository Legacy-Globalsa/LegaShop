import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import baqalaImg from "@/assets/baqala-store.jpg";

const stores = [
  { name: "Abu Khalid Baqala", district: "Al Batha", distance: "0.3 km", time: "15 min", rating: 4.8, products: 230, featured: true },
  { name: "Al Noor Mini Mart", district: "Al Batha", distance: "0.5 km", time: "20 min", rating: 4.6, products: 185, featured: false },
  { name: "Pinoy Corner Store", district: "Al Olaya", distance: "1.2 km", time: "30 min", rating: 4.9, products: 310, featured: true },
  { name: "Riyadh Sari-Sari", district: "Al Murabba", distance: "1.8 km", time: "35 min", rating: 4.7, products: 275, featured: false },
  { name: "King Baqala", district: "Al Batha", distance: "0.7 km", time: "22 min", rating: 4.5, products: 195, featured: false },
  { name: "Manila Market", district: "Al Olaya", distance: "1.5 km", time: "32 min", rating: 4.8, products: 290, featured: true },
  { name: "Al Rashid Grocery", district: "Al Murabba", distance: "2.0 km", time: "40 min", rating: 4.4, products: 160, featured: false },
  { name: "Kabayan Store", district: "Al Batha", distance: "0.4 km", time: "18 min", rating: 4.7, products: 245, featured: true },
];

const StoresPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        </div>
      </div>

      {/* Store Grid */}
      <section className="py-8">
        <div className="container">
          <p className="text-sm text-muted-foreground mb-4">
            <span className="font-bold text-foreground">{filteredStores.length}</span> stores near you
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredStores.map((store, i) => (
              <Link to={`/stores/${i + 1}`} key={store.name}>
              <motion.div
                key={store.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 cursor-pointer border border-border"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src={baqalaImg} alt={store.name} className="w-full h-full object-cover" />
                  {store.featured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-accent text-foreground">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-foreground">{store.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{store.district} · {store.distance}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {store.time}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-foreground">
                      <Star className="w-3.5 h-3.5 text-accent" fill="currentColor" />
                      {store.rating}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{store.products} products</div>
                  <span className="block w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold text-center hover:opacity-90 transition-opacity">
                    Browse Store
                  </span>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoresPage;
