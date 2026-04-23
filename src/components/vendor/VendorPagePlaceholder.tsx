import { Link } from "react-router-dom";
import { Construction } from "lucide-react";

interface VendorPagePlaceholderProps {
  title: string;
  description?: string;
  sprint?: string;
}

const VendorPagePlaceholder = ({ title, description, sprint }: VendorPagePlaceholderProps) => (
  <div className="max-w-3xl mx-auto">
    <div className="rounded-2xl border-2 border-dashed border-border bg-card p-10 text-center">
      <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
        <Construction className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-4">
        {description || "This page is coming up in a later sprint."}
      </p>
      {sprint && (
        <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
          Scheduled for {sprint}
        </p>
      )}
      <div className="mt-6">
        <Link
          to="/vendor"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  </div>
);

export default VendorPagePlaceholder;
