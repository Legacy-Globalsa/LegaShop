import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DealsSection from "@/components/DealsSection";
import CategoriesSection from "@/components/CategoriesSection";
import NearbyStoresSection from "@/components/NearbyStoresSection";
import StatsSection from "@/components/StatsSection";
import RemittanceSection from "@/components/RemittanceSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <DealsSection />
      <CategoriesSection />
      <NearbyStoresSection />
      <RemittanceSection />
      <Footer />
    </div>
  );
};

export default Index;
