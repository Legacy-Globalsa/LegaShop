import { motion } from "framer-motion";
import { MapPin, Clock, Star } from "lucide-react";
import baqalaImg from "@/assets/baqala-store.jpg";

const stores = [
  { name: "Abu Khalid Baqala", district: "Al Batha", distance: "0.3 km", time: "15 min", rating: 4.8, products: 230 },
  { name: "Al Noor Mini Mart", district: "Al Batha", distance: "0.5 km", time: "20 min", rating: 4.6, products: 185 },
  { name: "Pinoy Corner Store", district: "Al Olaya", distance: "1.2 km", time: "30 min", rating: 4.9, products: 310 },
  { name: "Riyadh Sari-Sari", district: "Al Murabba", distance: "1.8 km", time: "35 min", rating: 4.7, products: 275 },
];

const NearbyStoresSection = () => {
  return (
    <section id="stores" className="py-16 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-extrabold text-foreground mb-2">🏪 Nearby Baqalas</h2>
          <p className="text-muted-foreground">Your neighborhood stores, now online</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stores.map((store, i) => (
            <motion.div
              key={store.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 cursor-pointer border border-border"
            >
              <div className="h-36 overflow-hidden">
                <img src={baqalaImg} alt={store.name} className="w-full h-full object-cover" />
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
                    <Star className="w-3.5 h-3.5 text-tala" fill="currentColor" />
                    {store.rating}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">{store.products} products</div>
                <button className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-kalayaan-dark transition-colors">
                  Browse Store
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NearbyStoresSection;
