import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OneSarDeals from "./pages/OneSarDeals";
import FiveSarDeals from "./pages/FiveSarDeals";
import CategoriesPage from "./pages/CategoriesPage";
import StoresPage from "./pages/StoresPage";
import RemittancePage from "./pages/RemittancePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/deals/1-sar" element={<OneSarDeals />} />
          <Route path="/deals/5-sar" element={<FiveSarDeals />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/remittance" element={<RemittancePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
