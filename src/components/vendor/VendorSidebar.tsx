import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Store,
  Star,
  BarChart3,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/vendor", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/vendor/orders", label: "Orders", icon: ShoppingBag },
  { to: "/vendor/products", label: "Products", icon: Package },
  { to: "/vendor/store", label: "Store Settings", icon: Store },
  { to: "/vendor/reviews", label: "Reviews", icon: Star },
  { to: "/vendor/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/vendor/payouts", label: "Payouts", icon: Wallet },
];

interface VendorSidebarProps {
  onNavigate?: () => void;
}

const VendorSidebar = ({ onNavigate }: VendorSidebarProps) => {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-accent hover:text-foreground"
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default VendorSidebar;
