import { motion } from "framer-motion";
import { ArrowRight, Clock, Star } from "lucide-react";
import heroImg from "@/assets/hero-delivery.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-sky">
      <div className="container py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tala-light text-sm font-semibold text-foreground">
              <Star className="w-4 h-4 text-tala" fill="currentColor" />
              Serving 800,000+ Filipinos in Riyadh
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
              Lega lang,{" "}
              <span className="text-primary">kababayan.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Your affordable grocery — from the nearest baqala to your door, 
              or straight to your family in the Philippines. 🇵🇭
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-card hover:shadow-card-hover transition-shadow"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-tapang text-primary-foreground font-bold text-base shadow-deal"
              >
                🇵🇭 Send Groceries to PH
              </motion.button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" /> 15–45 min delivery
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-tala font-bold text-base">1 SAR</span> deals daily
              </span>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-card-hover">
              <img
                src={heroImg}
                alt="LEGASHOP baqala delivery in Riyadh"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 md:-left-8 bg-card rounded-xl p-4 shadow-card-hover border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tala-light flex items-center justify-center text-lg">🛒</div>
                <div>
                  <p className="font-bold text-sm text-foreground">1,200+ Products</p>
                  <p className="text-xs text-muted-foreground">From nearby baqalas</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
