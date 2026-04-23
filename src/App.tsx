import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { toast } from "sonner";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OneSarDeals from "./pages/OneSarDeals";
import FiveSarDeals from "./pages/FiveSarDeals";
import CategoriesPage from "./pages/CategoriesPage";
import StoresPage from "./pages/StoresPage";
import RemittancePage from "./pages/RemittancePage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AccountPage from "./pages/AccountPage";
import SearchResults from "./pages/SearchResults";
import StorePage from "./pages/StorePage";
import ProtectedRoute from "./components/ProtectedRoute";
import VendorRoute from "./components/VendorRoute";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorOrderDetail from "./pages/vendor/VendorOrderDetail";
import VendorProducts from "./pages/vendor/VendorProducts";
import VendorProductForm from "./pages/vendor/VendorProductForm";
import VendorStoreSettings from "./pages/vendor/VendorStoreSettings";
import VendorReviews from "./pages/vendor/VendorReviews";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import VendorPayouts from "./pages/vendor/VendorPayouts";
import VendorOnboarding from "./pages/vendor/VendorOnboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    },
    mutations: {
      onError: (error) => {
        const msg = error instanceof Error ? error.message : "Something went wrong";
        toast.error(msg);
      },
    },
  },
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <GoogleMapsProvider>
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
                <Route path="/stores/:id" element={<StorePage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/remittance" element={<RemittancePage />} />
                <Route path="/products/:id" element={<ProductPage />} />
                <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                {/* Vendor portal */}
                <Route path="/vendor" element={<VendorRoute><VendorDashboard /></VendorRoute>} />
                <Route path="/vendor/orders" element={<VendorRoute><VendorOrders /></VendorRoute>} />
                <Route path="/vendor/orders/:id" element={<VendorRoute><VendorOrderDetail /></VendorRoute>} />
                <Route path="/vendor/products" element={<VendorRoute><VendorProducts /></VendorRoute>} />
                <Route path="/vendor/products/new" element={<VendorRoute><VendorProductForm /></VendorRoute>} />
                <Route path="/vendor/products/:id/edit" element={<VendorRoute><VendorProductForm /></VendorRoute>} />
                <Route path="/vendor/store" element={<VendorRoute><VendorStoreSettings /></VendorRoute>} />
                <Route path="/vendor/reviews" element={<VendorRoute><VendorReviews /></VendorRoute>} />
                <Route path="/vendor/analytics" element={<VendorRoute><VendorAnalytics /></VendorRoute>} />
                <Route path="/vendor/payouts" element={<VendorRoute><VendorPayouts /></VendorRoute>} />
                <Route path="/vendor/onboarding" element={<VendorRoute><VendorOnboarding /></VendorRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
          </GoogleMapsProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;

