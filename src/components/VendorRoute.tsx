import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useMyStore } from "@/hooks/use-vendor";
import VendorLayout from "@/components/vendor/VendorLayout";
import VendorErrorBoundary from "@/components/vendor/VendorErrorBoundary";

interface VendorRouteProps {
  children: React.ReactNode;
}

const VendorStoreGate = ({ children }: VendorRouteProps) => {
  const location = useLocation();
  const { data: store, isLoading } = useMyStore();
  const isOnboarding = location.pathname === "/vendor/onboarding";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading vendor portal...</div>
      </div>
    );
  }

  if (!store && !isOnboarding) {
    return <Navigate to="/vendor/onboarding" replace />;
  }

  if (store && isOnboarding) {
    return <Navigate to="/vendor/store" replace />;
  }

  return (
    <VendorLayout>
      <VendorErrorBoundary resetKey={location.pathname}>{children}</VendorErrorBoundary>
    </VendorLayout>
  );
};

const VendorRoute = ({ children }: VendorRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (user?.role !== "VENDOR") {
    return <Navigate to="/" replace />;
  }

  return <VendorStoreGate>{children}</VendorStoreGate>;
};

export default VendorRoute;
