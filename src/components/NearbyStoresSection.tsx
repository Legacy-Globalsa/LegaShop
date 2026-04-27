import { motion } from "framer-motion";
import { MapPin, Clock, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useNearbyStores } from "@/hooks/use-api";
import baqalaImg from "@/assets/baqala-store.jpg";

// Same coordinates as StoresPage
const USER_LAT = 24.6900;
const USER_LNG = 46.6850;

const NearbyStoresSection = () => {
  const { data: stores = [], isLoading } = useNearbyStores(USER_LAT, USER_LNG, 15);

  // Show top 4 nearest stores
  const topStores = stores.slice(0, 4);

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

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
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
        ) : topStores.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <span className="text-4xl block mb-2">🏪</span>
            <p>No stores nearby. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {topStores.map((store, i) => (
              <Link to={`/stores/${store.id}`} key={store.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
                  className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 cursor-pointer border border-border"
                >
                  <div className="h-36 overflow-hidden relative">
                    <img src={store.image_url || baqalaImg} alt={store.name} className="w-full h-full object-cover" />
                    {store.distance_km != null && (
                      <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                        {store.distance_km} km
                      </span>
                    )}
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
                      {store.delivery_fee != null ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <Truck className="w-3.5 h-3.5" />
                          {store.delivery_fee} SAR
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs font-semibold">Too far</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
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
      </div>
    </section>
  );
};

export default NearbyStoresSection;
