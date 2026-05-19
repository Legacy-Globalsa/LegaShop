import { AlertTriangle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VendorEmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const VendorEmptyState = ({ title, description, action }: VendorEmptyStateProps) => (
  <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-10 text-center">
    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background text-muted-foreground">
      <Inbox className="h-5 w-5" />
    </div>
    <p className="font-medium">{title}</p>
    {description && <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

interface VendorErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const VendorErrorState = ({
  title = "Something went wrong",
  description = "Refresh the page or try again in a moment.",
  onRetry,
}: VendorErrorStateProps) => (
  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-8 text-center text-destructive">
    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background">
      <AlertTriangle className="h-5 w-5" />
    </div>
    <p className="font-medium">{title}</p>
    <p className="mx-auto mt-1 max-w-md text-sm text-destructive/80">{description}</p>
    {onRetry && (
      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);
