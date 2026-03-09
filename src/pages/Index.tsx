import Navbar from "@/components/Navbar";
import BentoHero from "@/components/BentoHero";
import QuickLinks from "@/components/QuickLinks";
import FlashDeals from "@/components/FlashDeals";
import CategoryGrid from "@/components/CategoryGrid";
import PromoBanners from "@/components/PromoBanners";
import FeaturedProducts from "@/components/FeaturedProducts";
import RemittancePreview from "@/components/RemittancePreview";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BentoHero />
      <QuickLinks />
      <FlashDeals />
      <CategoryGrid />
      <PromoBanners />
      <FeaturedProducts />
      <RemittancePreview />
      <StatsSection />
      <Footer />
    </div>
  );
};

export default Index;
