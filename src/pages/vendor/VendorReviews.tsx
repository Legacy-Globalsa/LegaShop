import { useMemo, useState } from "react";
import { format } from "date-fns";
import { MessageSquare, Search, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { VendorEmptyState, VendorErrorState } from "@/components/vendor/VendorState";
import { useVendorReviews } from "@/hooks/use-vendor";
import type { Review } from "@/lib/api";

const ratingOptions = ["ALL", "5", "4", "3", "2", "1"];
const targetOptions = [
  { label: "All reviews", value: "ALL" },
  { label: "Store reviews", value: "STORE" },
  { label: "Product reviews", value: "PRODUCT" },
];

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5 text-amber-500" aria-label={`${rating} stars`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? "fill-current" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const ReviewSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <Card key={index}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const targetLabel = (review: Review) => {
  if (review.product) return review.product_name || `Product #${review.product}`;
  return review.store_name || "Store review";
};

const VendorReviews = () => {
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("ALL");
  const [target, setTarget] = useState("ALL");
  const reviewsQuery = useVendorReviews();

  const filteredReviews = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (reviewsQuery.data ?? []).filter((review) => {
      const matchesRating = rating === "ALL" || review.rating === Number(rating);
      const matchesTarget =
        target === "ALL" ||
        (target === "STORE" && !review.product) ||
        (target === "PRODUCT" && !!review.product);
      const matchesSearch =
        !q ||
        review.reviewer_name.toLowerCase().includes(q) ||
        targetLabel(review).toLowerCase().includes(q) ||
        (review.comment ?? "").toLowerCase().includes(q);

      return matchesRating && matchesTarget && matchesSearch;
    });
  }, [rating, reviewsQuery.data, search, target]);

  const averageRating =
    reviewsQuery.data?.length
      ? reviewsQuery.data.reduce((sum, review) => sum + review.rating, 0) / reviewsQuery.data.length
      : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-sm text-muted-foreground">Read customer feedback for your store and products.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:min-w-56">
          <div className="rounded-lg border px-3 py-2">
            <p className="text-xs text-muted-foreground">Average</p>
            <div className="mt-0.5 flex items-center gap-1.5 text-lg font-semibold">
              {averageRating.toFixed(1)}
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="rounded-lg border px-3 py-2">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-0.5 text-lg font-semibold">{reviewsQuery.data?.length ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search reviews..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select value={target} onValueChange={setTarget}>
          <SelectTrigger className="lg:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {targetOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={rating} onValueChange={setRating}>
          <SelectTrigger className="lg:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ratingOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "ALL" ? "All ratings" : `${option} stars`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {reviewsQuery.error ? (
        <VendorErrorState
          title="Reviews could not load"
          description="The reviews endpoint is unavailable right now."
          onRetry={() => reviewsQuery.refetch()}
        />
      ) : reviewsQuery.isLoading ? (
        <ReviewSkeleton />
      ) : filteredReviews.length === 0 ? (
        <VendorEmptyState
          title={reviewsQuery.data?.length ? "No reviews match your filters" : "No reviews yet"}
          description={
            reviewsQuery.data?.length
              ? "Try clearing the search or rating filter."
              : "Customer reviews will appear here after shoppers leave feedback."
          }
          action={
            reviewsQuery.data?.length ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setRating("ALL");
                  setTarget("ALL");
                }}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{review.reviewer_name}</p>
                      <Badge variant="outline" className="text-xs">
                        {review.product ? "Product" : "Store"}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span className="font-medium text-foreground">{targetLabel(review)}</span>
                      <span>{format(new Date(review.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <Stars rating={review.rating} />
                </div>

                {review.comment ? (
                  <p className="mt-4 text-sm leading-6 text-foreground/85">{review.comment}</p>
                ) : (
                  <p className="mt-4 text-sm italic text-muted-foreground">No written comment.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorReviews;
