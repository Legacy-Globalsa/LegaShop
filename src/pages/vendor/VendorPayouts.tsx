import { format } from "date-fns";
import { Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { VendorEmptyState } from "@/components/vendor/VendorState";
import { useVendorPayouts } from "@/hooks/use-vendor";

const money = (value: number) => `SAR ${value.toFixed(2)}`;

const VendorPayouts = () => {
  const { data: payouts, isLoading } = useVendorPayouts();
  const pendingTotal = payouts?.filter((payout) => payout.status === "PENDING").reduce((sum, payout) => sum + payout.net, 0) ?? 0;
  const paidTotal = payouts?.filter((payout) => payout.status === "PAID").reduce((sum, payout) => sum + payout.net, 0) ?? 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payouts</h1>
        <p className="text-sm text-muted-foreground">Weekly settlement history and pending payout totals.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending payout</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-28" /> : <p className="text-2xl font-bold">{money(pendingTotal)}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid out</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-28" /> : <p className="text-2xl font-bold">{money(paidTotal)}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : payouts?.length ? (
            <div className="overflow-x-auto">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Gross</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid at</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.period}</TableCell>
                      <TableCell className="text-right">{money(payout.gross)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{money(payout.commission)}</TableCell>
                      <TableCell className="text-right font-semibold">{money(payout.net)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            payout.status === "PAID"
                              ? "border-green-300 bg-green-50 text-green-700"
                              : "border-amber-300 bg-amber-50 text-amber-800"
                          }
                        >
                          {payout.status === "PAID" ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {payout.paid_at ? format(new Date(payout.paid_at), "MMM d, yyyy") : "Not paid yet"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <VendorEmptyState title="No payout statements yet" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPayouts;
