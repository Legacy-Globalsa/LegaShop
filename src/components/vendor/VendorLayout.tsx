import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User as UserIcon, Store as StoreIcon, Home } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMyStore } from "@/hooks/use-vendor";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/legashop-logo1.png";

interface VendorLayoutProps {
  children: React.ReactNode;
}

const VendorLayout = ({ children }: VendorLayoutProps) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, logout } = useAuth();
  const { data: store } = useMyStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-card border-b border-border h-14 flex items-center px-4 gap-3">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent"
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link to="/vendor" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="LEGASHOP" className="w-[100px] h-auto" />
          <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-muted-foreground border-l border-border pl-2 ml-1">
            Vendor
          </span>
        </Link>

        <div className="flex-1 hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          {store ? (
            <>
              <StoreIcon className="w-4 h-4" />
              <span className="font-medium text-foreground truncate max-w-[260px]">{store.name}</span>
              {!store.is_active && (
                <span className="ml-2 text-[10px] uppercase tracking-wide bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
                  Pending approval
                </span>
              )}
            </>
          ) : null}
        </div>

        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-accent transition"
        >
          <Home className="w-3.5 h-3.5" />
          Storefront
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-accent transition">
              <UserIcon className="w-3.5 h-3.5" />
              <span className="max-w-[100px] truncate hidden sm:inline">{user?.first_name || "Vendor"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user?.email}</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/account")}>
              <UserIcon className="w-4 h-4 mr-2" /> My Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-60 shrink-0 border-r border-border bg-card sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <VendorSidebar />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileNavOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          >
            <aside
              className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-border">
                <span className="text-sm font-semibold">Menu</span>
                <button
                  className="p-2 rounded-lg hover:bg-accent"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <VendorSidebar onNavigate={() => setMobileNavOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default VendorLayout;
