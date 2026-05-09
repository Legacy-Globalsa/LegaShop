import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, MapPin, CreditCard, Package, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OrderStatusBadge from "@/components/vendor/OrderStatusBadge";
import OrderStatusActions from "@/components/vendor/OrderStatusActions";
import { useVendorOrder } from "@/hooks/use-vendor";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  MADA: "Mada",
  VISA: "Visa",
  APPLE_PAY: "Apple Pay",
};

const PAYMENT_STATUS_CLASS: Record<string, string> = {
  PENDING: "border-yellow-400 text-yellow-700 bg-yellow-50",
  PAID: "border-green-400 text-green-700 bg-green-50",
  FAILED: "border-red-400 text-red-700 bg-red-50",
  REFUNDED: "border-purple-400 text-purple-700 bg-purple-50",
};

const VendorOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? Number(id) : undefined;
  const { data: order, isLoading, error } = useVendorOrder(orderId);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg">Order not found.</p>
        <Button variant="link" asChild className="mt-2">
          <Link to="/vendor/orders">← Back to orders</Link>
        </Button>
      </div>
    );
  }

  const addr = order.delivery_address_data;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back + header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild className="-ml-2 mt-0.5">
          <Link to="/vendor/orders">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Order #{order.id}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Placed {format(new Date(order.created_at), "PPp")}
          </p>
        </div>
      </div>

      {/* Status actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Status Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusActions order={order} />
          {["DELIVERED", "CANCELLED"].includes(order.status) && (
            <p className="text-sm text-muted-foreground">This order is in a final state.</p>
          )}
        </CardContent>
      </Card>

      {/* Order items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="w-4 h-4" /> Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.product_image ? (
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-12 h-12 rounded-md object-cover border flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-md border bg-muted flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.product_name}</div>
                <div className="text-xs text-muted-foreground">
                  {order.currency} {Number(item.price_at_order).toFixed(2)} × {item.quantity}
                </div>
              </div>
              <div className="font-medium whitespace-nowrap">
                {order.currency} {Number(item.line_total).toFixed(2)}
              </div>
            </div>
          ))}

          <Separator />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{order.currency} {Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery fee</span>
              <span>{order.currency} {Number(order.delivery_fee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-1">
              <span>Total</span>
              <span>{order.currency} {Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          {order.note && (
            <>
              <Separator />
              <div className="text-sm text-muted-foreground italic">"{order.note}"</div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4" /> Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{order.customer_name}</p>
            <p className="text-muted-foreground">{order.customer_email}</p>
          </CardContent>
        </Card>

        {/* Delivery address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4" /> Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {addr ? (
              <div className="space-y-0.5">
                {addr.label && <p className="font-medium">{addr.label}</p>}
                <p>{addr.street}</p>
                <p className="text-muted-foreground">{addr.district}, {addr.city}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No address info</p>
            )}
          </CardContent>
        </Card>

        {/* Payment */}
        <Card className="sm:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="w-4 h-4" /> Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm flex flex-wrap gap-4">
            <div>
              <p className="text-muted-foreground text-xs">Method</p>
              <p className="font-medium">{PAYMENT_METHOD_LABELS[order.payment?.method] ?? order.payment?.method}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Status</p>
              <Badge
                variant="outline"
                className={`text-xs font-semibold ${PAYMENT_STATUS_CLASS[order.payment?.status] ?? ""}`}
              >
                {order.payment?.status}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Amount</p>
              <p className="font-medium">{order.payment?.currency} {Number(order.payment?.amount).toFixed(2)}</p>
            </div>
            {order.payment?.paid_at && (
              <div>
                <p className="text-muted-foreground text-xs">Paid at</p>
                <p className="font-medium">{format(new Date(order.payment.paid_at), "PPp")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorOrderDetail;
