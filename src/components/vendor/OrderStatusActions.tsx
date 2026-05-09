import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle, ChefHat, Truck, PackageCheck, XCircle, Loader2 } from "lucide-react";
import type { Order } from "@/lib/api";
import { useUpdateVendorOrderStatus } from "@/hooks/use-vendor";
import { toast } from "sonner";

type Transition = {
  to: Order["status"];
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "default" | "destructive" | "outline";
  confirm?: boolean;
  confirmTitle?: string;
  confirmDesc?: string;
};

const TRANSITIONS: Record<Order["status"], Transition[]> = {
  PENDING: [
    {
      to: "CONFIRMED",
      label: "Accept order",
      icon: CheckCircle,
      variant: "default",
    },
    {
      to: "CANCELLED",
      label: "Reject",
      icon: XCircle,
      variant: "destructive",
      confirm: true,
      confirmTitle: "Reject this order?",
      confirmDesc:
        "The order will be cancelled and stock will be restored. This cannot be undone.",
    },
  ],
  CONFIRMED: [
    {
      to: "PREPARING",
      label: "Start preparing",
      icon: ChefHat,
      variant: "default",
    },
    {
      to: "CANCELLED",
      label: "Cancel",
      icon: XCircle,
      variant: "destructive",
      confirm: true,
      confirmTitle: "Cancel this order?",
      confirmDesc: "Stock will be restored. This cannot be undone.",
    },
  ],
  PREPARING: [
    {
      to: "OUT_FOR_DELIVERY",
      label: "Out for delivery",
      icon: Truck,
      variant: "default",
    },
  ],
  OUT_FOR_DELIVERY: [
    {
      to: "DELIVERED",
      label: "Mark delivered",
      icon: PackageCheck,
      variant: "default",
    },
  ],
  DELIVERED: [],
  CANCELLED: [],
};

interface OrderStatusActionsProps {
  order: Order;
  onStatusChange?: (updated: Order) => void;
}

const OrderStatusActions = ({ order, onStatusChange }: OrderStatusActionsProps) => {
  const { mutate, isPending } = useUpdateVendorOrderStatus();
  const [pendingTo, setPendingTo] = useState<Order["status"] | null>(null);
  const transitions = TRANSITIONS[order.status] ?? [];

  if (transitions.length === 0) return null;

  const doTransition = (to: Order["status"]) => {
    setPendingTo(to);
    mutate(
      { id: order.id, status: to },
      {
        onSuccess: (updated) => {
          toast.success(`Order #${order.id} → ${to.replace(/_/g, " ")}`);
          onStatusChange?.(updated);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Failed to update status");
        },
        onSettled: () => setPendingTo(null),
      }
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {transitions.map((t) => {
        const Icon = t.icon;
        const loading = isPending && pendingTo === t.to;

        if (t.confirm) {
          return (
            <AlertDialog key={t.to}>
              <AlertDialogTrigger asChild>
                <Button variant={t.variant} size="sm" disabled={isPending}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 mr-1.5" />
                  )}
                  {t.label}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.confirmTitle}</AlertDialogTitle>
                  <AlertDialogDescription>{t.confirmDesc}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Go back</AlertDialogCancel>
                  <AlertDialogAction
                    className={t.variant === "destructive" ? "bg-destructive hover:bg-destructive/90" : ""}
                    onClick={() => doTransition(t.to)}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          );
        }

        return (
          <Button
            key={t.to}
            variant={t.variant}
            size="sm"
            disabled={isPending}
            onClick={() => doTransition(t.to)}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Icon className="w-4 h-4 mr-1.5" />
            )}
            {t.label}
          </Button>
        );
      })}
    </div>
  );
};

export default OrderStatusActions;
