import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Plus, Search, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  useVendorProducts,
  useDeleteVendorProduct,
  useUpdateVendorProduct,
  useCategoriesForVendor,
} from "@/hooks/use-vendor";

// Inline stock editor
const InlineStock = ({ id, stock }: { id: number; stock: number }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(stock));
  const updateMutation = useUpdateVendorProduct(id);

  const commit = () => {
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 0) { setValue(String(stock)); setEditing(false); return; }
    if (n === stock) { setEditing(false); return; }
    updateMutation.mutate(
      { stock: n } as any,
      {
        onSuccess: () => { toast.success("Stock updated"); setEditing(false); },
        onError: () => { toast.error("Failed to update stock"); setValue(String(stock)); setEditing(false); },
      }
    );
  };

  if (editing) {
    return (
      <Input
        type="number"
        min="0"
        className="w-20 h-7 text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setValue(String(stock)); setEditing(false); } }}
        autoFocus
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={`flex items-center gap-1 text-sm font-medium hover:underline ${stock <= 5 ? "text-red-600" : ""}`}
    >
      {stock <= 5 && <AlertTriangle className="w-3.5 h-3.5" />}
      {stock}
      <Pencil className="w-3 h-3 text-muted-foreground" />
    </button>
  );
};

const VendorProducts = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const { data: categories } = useCategoriesForVendor();

  const filters = {
    ...(categoryFilter !== "ALL" && { category: categoryFilter }),
    ...(lowStockOnly && { low_stock: true }),
    ...(search && { search }),
  };

  const { data: products, isLoading } = useVendorProducts(filters);
  const deleteMutation = useDeleteVendorProduct();

  const handleDelete = (id: number, name: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success(`"${name}" deleted`),
      onError: () => toast.error("Failed to delete product"),
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground text-sm">Manage your store catalog.</p>
          </div>
          <Button asChild>
            <Link to="/vendor/products/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add product
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All categories</SelectItem>
              {categories?.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <Switch checked={lowStockOnly} onCheckedChange={setLowStockOnly} />
            Low stock only
          </label>
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Deal</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : products?.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        {search || categoryFilter !== "ALL" || lowStockOnly
                          ? "No products match your filters."
                          : "No products yet. Add your first product."}
                      </TableCell>
                    </TableRow>
                  )
                : products?.map((product) => (
                    <TableRow key={product.id}>
                      {/* Image */}
                      <TableCell>
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-9 h-9 rounded-md object-cover border"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-md border bg-muted" />
                        )}
                      </TableCell>

                      {/* Name */}
                      <TableCell>
                        <div className="font-medium leading-tight">{product.name}</div>
                        {product.name_tl && (
                          <div className="text-xs text-muted-foreground">{product.name_tl}</div>
                        )}
                      </TableCell>

                      {/* Category */}
                      <TableCell className="text-sm text-muted-foreground">
                        {product.category_name}
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-right text-sm font-medium">
                        <div>{product.currency} {Number(product.price).toFixed(2)}</div>
                        {product.sale_price && (
                          <div className="text-xs text-green-600 font-semibold">
                            Sale: {Number(product.sale_price).toFixed(2)}
                          </div>
                        )}
                      </TableCell>

                      {/* Stock (inline edit) */}
                      <TableCell className="text-right">
                        <InlineStock id={product.id} stock={product.stock} />
                      </TableCell>

                      {/* Deal badge */}
                      <TableCell>
                        {product.is_deal && product.deal_type ? (
                          <Badge
                            variant="outline"
                            className={
                              product.deal_type === "ONE_RIYAL"
                                ? "border-red-400 text-red-700 bg-red-50 text-xs"
                                : "border-yellow-400 text-yellow-700 bg-yellow-50 text-xs"
                            }
                          >
                            {product.deal_type === "ONE_RIYAL" ? "1 SAR" : "5 SAR"}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>

                      {/* Active */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            product.is_active
                              ? "border-green-400 text-green-700 bg-green-50 text-xs"
                              : "border-gray-300 text-gray-500 text-xs"
                          }
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/vendor/products/${product.id}/edit`}>
                                  <Pencil className="w-4 h-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>

                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    disabled={deleteMutation.isPending}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete "{product.name}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove the product. Orders that already contain it are not affected.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => handleDelete(product.id, product.name)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default VendorProducts;
