import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/api";

const STATUS_CONFIG: Record<
  Order["status"],
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  PENDING: {
    label: "Pending",
    variant: "outline",
    className: "border-yellow-400 text-yellow-700 bg-yellow-50",
  },
  CONFIRMED: {
    label: "Confirmed",
    variant: "outline",
    className: "border-blue-400 text-blue-700 bg-blue-50",
  },
  PREPARING: {
    label: "Preparing",
    variant: "outline",
    className: "border-purple-400 text-purple-700 bg-purple-50",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    variant: "outline",
    className: "border-orange-400 text-orange-700 bg-orange-50",
  },
  DELIVERED: {
    label: "Delivered",
    variant: "outline",
    className: "border-green-400 text-green-700 bg-green-50",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "outline",
    className: "border-red-300 text-red-600 bg-red-50",
  },
};

interface OrderStatusBadgeProps {
  status: Order["status"];
  className?: string;
}

const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    variant: "secondary" as const,
    className: "",
  };
  return (
    <Badge variant={cfg.variant} className={`${cfg.className} font-semibold ${className ?? ""}`}>
      {cfg.label}
    </Badge>
  );
};

export default OrderStatusBadge;
