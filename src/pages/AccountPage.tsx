import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, MapPin, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileSection from "@/components/account/ProfileSection";
import AddressesSection from "@/components/account/AddressesSection";
import SecuritySection from "@/components/account/SecuritySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AccountPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-6 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">My Account</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-extrabold mb-6">My Account</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="gap-1.5 text-xs sm:text-sm">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="gap-1.5 text-xs sm:text-sm">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-1.5 text-xs sm:text-sm">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="rounded-xl border border-border bg-card p-6">
                <ProfileSection />
              </div>
            </TabsContent>

            <TabsContent value="addresses">
              <div className="rounded-xl border border-border bg-card p-6">
                <AddressesSection />
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="rounded-xl border border-border bg-card p-6">
                <SecuritySection />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountPage;
