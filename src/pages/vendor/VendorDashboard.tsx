import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Clock,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderStatusBadge from "@/components/vendor/OrderStatusBadge";
import { VendorEmptyState, VendorErrorState } from "@/components/vendor/VendorState";
import { useVendorAnalytics, useVendorOrders } from "@/hooks/use-vendor";
import type { Order } from "@/lib/api";

const money = (value: number | string | null | undefined, currency = "SAR") =>
  `${currency} ${Number(value ?? 0).toFixed(2)}`;

const compactMoney = (value: number | string | null | undefined) =>
  `SAR ${Number(value ?? 0).toLocaleString("en", { maximumFractionDigits: 0 })}`;

interface KpiCardProps {
  title: string;
  value: string | number;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  to?: string;
}

const KpiCard = ({ title, value, helper, icon: Icon, loading, to }: KpiCardProps) => {
  const body = (
    <Card className="h-full transition hover:border-primary/40">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{value}</div>}
        <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );

  if (!to) return body;
  return (
    <Link to={to} className="block h-full">
      {body}
    </Link>
  );
};

const RecentOrders = ({
  orders,
  loading,
  error,
  onRetry,
}: {
  orders?: Order[];
  loading: boolean;
  error: unknown;
  onRetry: () => void;
}) => {
  if (error) {
    return <VendorErrorState title="Orders could not load" onRetry={onRetry} />;
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <VendorEmptyState
        title="No recent orders"
        description="New customer orders will appear here as soon as they come in."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[680px]">
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead className="w-16 text-right">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono font-medium">#{order.id}</TableCell>
              <TableCell>
                <div className="font-medium leading-tight">{order.customer_name}</div>
                <div className="text-xs text-muted-foreground">{order.items.length} items</div>
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right font-medium">{money(order.total, order.currency)}</TableCell>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                {format(new Date(order.created_at), "MMM d, h:mm a")}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link to={`/vendor/orders/${order.id}`} aria-label={`View order ${order.id}`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const VendorDashboard = () => {
  const analyticsQuery = useVendorAnalytics();
  const ordersQuery = useVendorOrders({}, { refetchInterval: 30_000 });
  const analytics = analyticsQuery.data;
  const recentOrders = ordersQuery.data?.slice(0, 5) ?? [];
  const maxRevenue = Math.max(...(analytics?.salesLast7Days.map((day) => day.revenue) ?? [0]), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Today&apos;s store pulse, recent orders, and stock signals.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            analyticsQuery.refetch();
            ordersQuery.refetch();
          }}
          disabled={analyticsQuery.isFetching || ordersQuery.isFetching}
        >
          <RefreshCw className={`mr-1.5 h-4 w-4 ${analyticsQuery.isFetching || ordersQuery.isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {analyticsQuery.error && (
        <VendorErrorState
          title="Analytics could not load"
          description="The dashboard metrics endpoint is unavailable right now."
          onRetry={() => analyticsQuery.refetch()}
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Today's orders"
          value={analytics?.todayOrders ?? 0}
          helper={`${compactMoney(analytics?.todayRevenue)} revenue today`}
          icon={ShoppingBag}
          loading={analyticsQuery.isLoading}
          to="/vendor/orders"
        />
        <KpiCard
          title="Pending"
          value={analytics?.pendingCount ?? 0}
          helper="Orders waiting for action"
          icon={Clock}
          loading={analyticsQuery.isLoading}
          to="/vendor/orders?status=PENDING"
        />
        <KpiCard
          title="Out for delivery"
          value={analytics?.outForDeliveryCount ?? 0}
          helper="Active deliveries in progress"
          icon={Truck}
          loading={analyticsQuery.isLoading}
          to="/vendor/orders?status=OUT_FOR_DELIVERY"
        />
        <KpiCard
          title="Low stock"
          value={analytics?.lowStockCount ?? 0}
          helper="Products below 5 units"
          icon={AlertTriangle}
          loading={analyticsQuery.isLoading}
          to="/vendor/products?low_stock=true"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent orders</CardTitle>
              <p className="text-sm text-muted-foreground">Live order queue snapshot from the backend.</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/vendor/orders">
                View all
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <RecentOrders
              orders={recentOrders}
              loading={ordersQuery.isLoading}
              error={ordersQuery.error}
              onRetry={() => ordersQuery.refetch()}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" />
                Top products this week
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsQuery.isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : analytics?.topProducts.length ? (
                <div className="space-y-3">
                  {analytics.topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="h-5 w-5 justify-center rounded-full p-0 text-[10px]">
                            {index + 1}
                          </Badge>
                          <p className="truncate text-sm font-medium">{product.name}</p>
                        </div>
                        <p className="ml-7 text-xs text-muted-foreground">{product.sold} sold</p>
                      </div>
                      <p className="text-sm font-semibold whitespace-nowrap">{compactMoney(product.revenue)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <VendorEmptyState title="No product sales yet" description="Top sellers will appear after orders are placed." />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" />
                Last 7 days
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsQuery.isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : analytics?.salesLast7Days.length ? (
                <div className="flex h-36 items-end gap-2">
                  {analytics.salesLast7Days.map((day) => {
                    const height = Math.max(8, (day.revenue / maxRevenue) * 100);
                    return (
                      <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                        <div className="flex h-24 w-full items-end rounded bg-muted">
                          <div
                            className="w-full rounded bg-primary"
                            style={{ height: `${height}%` }}
                            title={`${compactMoney(day.revenue)} revenue, ${day.orders} orders`}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {format(new Date(day.date), "EEE")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <VendorEmptyState title="No weekly trend yet" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
