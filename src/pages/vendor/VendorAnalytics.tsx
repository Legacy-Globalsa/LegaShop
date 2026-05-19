import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, Package, ShoppingBag } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VendorEmptyState, VendorErrorState } from "@/components/vendor/VendorState";
import { useVendorAnalytics } from "@/hooks/use-vendor";

const money = (value: number | string | null | undefined) =>
  `SAR ${Number(value ?? 0).toLocaleString("en", { maximumFractionDigits: 0 })}`;

const VendorAnalytics = () => {
  const { data, isLoading, error, refetch } = useVendorAnalytics();
  const chartData =
    data?.salesLast7Days.map((day) => ({
      ...day,
      label: format(new Date(day.date), "EEE"),
    })) ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Sales trends and top-product performance for the last 7 days.</p>
      </div>

      {error ? (
        <VendorErrorState
          title="Analytics could not load"
          description="The analytics endpoint is unavailable right now."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Week revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-bold">{money(data?.weekRevenue)}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today&apos;s orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{data?.todayOrders ?? 0}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Low stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{data?.lowStockCount ?? 0}</p>}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue by day</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-72 w-full" />
              ) : chartData.length ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} width={42} />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "revenue" ? money(Number(value)) : value,
                          name === "revenue" ? "Revenue" : "Orders",
                        ]}
                      />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <VendorEmptyState title="No sales trend yet" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top products</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : data?.topProducts.length ? (
                <div className="space-y-3">
                  {data.topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                      </div>
                      <p className="text-sm font-semibold whitespace-nowrap">{money(product.revenue)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <VendorEmptyState title="No top products yet" />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default VendorAnalytics;
