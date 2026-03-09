import { Link } from "react-router-dom";
import groceriesImg from "@/assets/filipino-groceries.jpg";

const PromoBanners = () => {
  return (
    <section className="py-6 bg-background">
      <div className="container space-y-3">
        {/* Wide groceries banner */}
        <div className="relative rounded-2xl overflow-hidden h-[160px] md:h-[180px]">
          <img src={groceriesImg} alt="Filipino groceries" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
          <div className="absolute inset-0 flex items-center px-6 md:px-10">
            <div>
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Filipino Essentials</p>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-1">1 Riyal = ~₱15 Deals Every Day</h3>
              <p className="text-white/70 text-sm mt-1.5 max-w-md">The most affordable Filipino essentials in Riyadh</p>
              <Link
                to="/deals/1-sar"
                className="inline-flex items-center mt-3 px-5 py-2 rounded-full bg-white text-primary font-bold text-xs hover:scale-105 transition-transform shadow"
              >
                Shop Deals →
              </Link>
            </div>
          </div>
        </div>

        {/* 3-col banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Banner 1 - 1 SAR */}
          <Link
            to="/deals/1-sar"
            className="relative rounded-2xl overflow-hidden h-[140px] bg-gradient-to-br from-accent via-yellow-300 to-orange-400 p-5 flex flex-col justify-center group hover:shadow-lg transition-shadow"
          >
            <div className="relative z-10">
              <p className="text-foreground/70 text-xs font-semibold uppercase tracking-wider">Daily Deals</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">1 SAR Deals</h3>
              <p className="text-foreground/70 text-sm mt-1">Starting at ~₱15</p>
            </div>
            <span className="absolute right-4 bottom-2 text-6xl opacity-30 group-hover:scale-110 transition-transform">
              🔥
            </span>
          </Link>

          {/* Banner 2 - 5 SAR */}
          <Link
            to="/deals/5-sar"
            className="relative rounded-2xl overflow-hidden h-[140px] bg-gradient-to-br from-primary via-sky-400 to-cyan-500 p-5 flex flex-col justify-center group hover:shadow-lg transition-shadow"
          >
            <div className="relative z-10">
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Premium Picks</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">5 SAR Deals</h3>
              <p className="text-white/70 text-sm mt-1">Best value packs ~₱75</p>
            </div>
            <span className="absolute right-4 bottom-2 text-6xl opacity-30 group-hover:scale-110 transition-transform">
              ⭐
            </span>
          </Link>

          {/* Banner 3 - Remittance */}
          <Link
            to="/remittance"
            className="relative rounded-2xl overflow-hidden h-[140px] bg-gradient-to-br from-destructive via-rose-500 to-pink-500 p-5 flex flex-col justify-center group hover:shadow-lg transition-shadow"
          >
            <div className="relative z-10">
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">For Your Family</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">Send to PH</h3>
              <p className="text-white/70 text-sm mt-1">Groceries via Puregold</p>
            </div>
            <span className="absolute right-4 bottom-2 text-6xl opacity-30 group-hover:scale-110 transition-transform">
              🇵🇭
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
