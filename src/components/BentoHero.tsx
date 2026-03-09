import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-delivery.jpg";

const heroSlides = [
  {
    title: "Lega lang, kababayan.",
    subtitle: "Your affordable grocery — from the nearest baqala to your door, or straight to your family in the Philippines.",
    cta: "Shop Now",
    link: "/deals/1-sar",
    image: heroImg,
    overlay: "bg-gradient-to-r from-sky-50/95 via-sky-50/80 to-transparent",
    textColor: "text-foreground",
    subtitleColor: "text-muted-foreground",
    accent: "bg-primary text-white",
    type: "image" as const,
  },
  {
    title: "1 SAR Deals",
    subtitle: "Groceries starting at just 1 Riyal — new deals daily!",
    cta: "Shop 1 SAR Deals",
    link: "/deals/1-sar",
    gradient: "from-primary via-primary to-secondary",
    emoji: "🔥",
    accent: "bg-accent text-foreground",
    type: "gradient" as const,
  },
  {
    title: "Send Groceries to PH",
    subtitle: "Your pamilya receives fresh groceries from Puregold",
    cta: "Send Now",
    link: "/remittance",
    gradient: "from-destructive via-destructive to-orange-500",
    emoji: "🇵🇭",
    accent: "bg-white text-destructive",
    type: "gradient" as const,
  },
  {
    title: "5 SAR Deals",
    subtitle: "Premium Filipino essentials at unbeatable prices",
    cta: "Shop 5 SAR Deals",
    link: "/deals/5-sar",
    gradient: "from-accent via-yellow-400 to-orange-400",
    emoji: "⭐",
    accent: "bg-foreground text-white",
    type: "gradient" as const,
  },
];

const sideBanners = [
  {
    title: "Free Delivery",
    subtitle: "On first order",
    gradient: "from-emerald-500 to-teal-600",
    emoji: "🚚",
    link: "/deals/1-sar",
  },
  {
    title: "Baqala Partners",
    subtitle: "15,000+ stores",
    gradient: "from-violet-500 to-purple-600",
    emoji: "🏪",
    link: "/stores",
  },
];

const BentoHero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setCurrent((c) => (c + 1) % heroSlides.length);

  return (
    <section className="bg-background pt-4 pb-2">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-auto lg:h-[320px]">
          {/* Main Carousel - takes 3 cols */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center"
              >
                {heroSlides[current].type === "image" ? (
                  <>
                    <img
                      src={heroSlides[current].image}
                      alt="LEGASHOP delivery"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 ${heroSlides[current].overlay}`} />
                    <div className="p-8 md:p-12 flex-1 relative z-10 max-w-lg">
                      <h2 className={`text-3xl md:text-4xl font-extrabold ${heroSlides[current].textColor} mb-2 leading-tight`}>
                        Lega lang,{" "}
                        <span className="text-primary">kababayan.</span>
                      </h2>
                      <p className={`${heroSlides[current].subtitleColor} text-sm md:text-base mb-5 max-w-sm`}>
                        {heroSlides[current].subtitle}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={heroSlides[current].link}
                          className={`inline-flex items-center px-6 py-2.5 rounded-full font-bold text-sm ${heroSlides[current].accent} shadow-lg hover:scale-105 transition-transform`}
                        >
                          {heroSlides[current].cta} →
                        </Link>
                        <Link
                          to="/remittance"
                          className="inline-flex items-center px-6 py-2.5 rounded-full font-bold text-sm bg-destructive text-white shadow-lg hover:scale-105 transition-transform"
                        >
                          🇵🇭 Send Groceries to PH
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[current].gradient}`} />
                    <div className="p-8 md:p-12 flex-1 relative z-10">
                      <span className="text-5xl mb-3 block">{heroSlides[current].emoji}</span>
                      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-sm">
                        {heroSlides[current].title}
                      </h2>
                      <p className="text-white/90 text-base md:text-lg mb-5 max-w-md">
                        {heroSlides[current].subtitle}
                      </p>
                      <Link
                        to={heroSlides[current].link}
                        className={`inline-flex items-center px-6 py-2.5 rounded-full font-bold text-sm ${heroSlides[current].accent} shadow-lg hover:scale-105 transition-transform`}
                      >
                        {heroSlides[current].cta}
                      </Link>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10" />
                    <div className="absolute right-20 top-6 w-32 h-32 rounded-full bg-white/5" />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            {/* Ensure proper height */}
            <div className="h-[280px] lg:h-full" />

            {/* Nav arrows */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Side banners stack */}
          <div className="hidden lg:flex flex-col gap-3">
            {sideBanners.map((banner) => (
              <Link
                key={banner.title}
                to={banner.link}
                className={`flex-1 rounded-2xl bg-gradient-to-br ${banner.gradient} p-5 flex flex-col justify-center text-white hover:scale-[1.02] transition-transform cursor-pointer`}
              >
                <span className="text-3xl mb-1">{banner.emoji}</span>
                <h3 className="font-extrabold text-lg leading-tight">{banner.title}</h3>
                <p className="text-white/80 text-xs mt-1">{banner.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoHero;
