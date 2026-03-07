import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import familyImg from "@/assets/family-ph.jpg";

const RemittanceSection = () => {
  return (
    <section id="remittance" className="py-16 bg-secondary/50">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-card-hover"
          >
            <img src={familyImg} alt="Family receiving groceries in the Philippines" className="w-full h-auto object-cover" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tapang-light text-sm font-semibold text-tapang">
              <Heart className="w-4 h-4" fill="currentColor" />
              For Your Family Back Home
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              Send groceries to your{" "}
              <span className="text-tapang">pamilya</span>{" "}
              in the Philippines 🇵🇭
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              Browse Puregold products, pay in Saudi Riyals, and your family 
              picks up fresh groceries at any Puregold branch — or gets them 
              delivered. No more sending cash and hoping it goes to food.
            </p>

            <div className="bg-card rounded-xl p-5 border border-border space-y-3">
              <h4 className="font-bold text-foreground">How it works:</h4>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">1</span>
                <p className="text-sm text-muted-foreground">Browse Puregold's catalog — prices shown in SAR with ₱ equivalent</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">2</span>
                <p className="text-sm text-muted-foreground">Pay in SAR via Mada, Visa, or Apple Pay</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-tapang flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">3</span>
                <p className="text-sm text-muted-foreground">Your family gets SMS notification and picks up or receives delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-bold text-foreground">Today's rate:</span>
              <span className="px-3 py-1 rounded-full bg-tala-light font-bold text-foreground">
                1 SAR = ₱14.85
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-tapang text-primary-foreground font-bold shadow-deal"
            >
              Send Groceries Now <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RemittanceSection;
