import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, RefreshCw, Search } from "lucide-react";
import OrderStatusBadge from "@/components/vendor/OrderStatusBadge";
import { useVendorOrders } from "@/hooks/use-vendor";
import type { Order } from "@/lib/api";

const TABS: { label: string; value: Order["status"] | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

// Poll every 30s on live tabs; no polling on terminal-state tabs
const LIVE_STATUSES: Array<Order["status"] | "ALL"> = ["ALL", "PENDING", "CONFIRMED", "PREPARING"];

const VendorOrders = () => {
  const [activeTab, setActiveTab] = useState<Order["status"] | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filters = activeTab !== "ALL" ? { status: activeTab as Order["status"] } : {};
  const isLive = LIVE_STATUSES.includes(activeTab);

  const { data: orders, isLoading, isFetching, refetch } = useVendorOrders(filters, {
    refetchInterval: isLive ? 30_000 : undefined,
  });

  const filtered = orders?.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(o.id).includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground text-sm">Manage incoming orders from your store.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Order["status"] | "ALL")}>
        <TabsList className="flex-wrap h-auto gap-1">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="text-xs">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search order # or customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead className="w-16 text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : filtered?.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      {search ? "No orders match your search." : "No orders yet."}
                    </TableCell>
                  </TableRow>
                )
              : filtered?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div className="font-medium leading-tight">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                    </TableCell>
                    <TableCell className="text-right">{order.items.length}</TableCell>
                    <TableCell className="text-right font-medium">
                      {order.currency} {Number(order.total).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {format(new Date(order.created_at), "MMM d, h:mm a")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/vendor/orders/${order.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VendorOrders;
