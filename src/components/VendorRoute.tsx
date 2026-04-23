import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import VendorLayout from "@/components/vendor/VendorLayout";

interface VendorRouteProps {
  children: React.ReactNode;
}

const VendorRoute = ({ children }: VendorRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (user?.role !== "VENDOR") {
    return <Navigate to="/" replace />;
  }

  return <VendorLayout>{children}</VendorLayout>;
};

export default VendorRoute;
