import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ImageUploader from "@/components/vendor/ImageUploader";
import {
  useVendorProducts,
  useCreateVendorProduct,
  useUpdateVendorProduct,
  useCategoriesForVendor,
} from "@/hooks/use-vendor";

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = z
  .object({
    category: z.coerce.number({ required_error: "Category is required" }).min(1),
    name: z.string().min(1, "Name is required").max(200),
    name_tl: z.string().max(200).optional().or(z.literal("")),
    name_ar: z.string().max(200).optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
    price: z.coerce.number({ required_error: "Price is required" }).positive("Price must be > 0"),
    sale_price: z.coerce.number().positive().nullable().optional(),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
    unit: z.string().min(1).max(20),
    is_deal: z.boolean(),
    deal_type: z.enum(["ONE_RIYAL", "FIVE_RIYAL"]).nullable().optional(),
    // image handled separately (File | null)
  })
  .refine(
    (d) => !d.sale_price || d.sale_price < d.price,
    { message: "Sale price must be less than regular price", path: ["sale_price"] }
  )
  .refine((d) => !d.is_deal || !!d.deal_type, {
    message: "Select a deal type",
    path: ["deal_type"],
  });

type FormValues = z.infer<typeof schema>;

// ── Component ──────────────────────────────────────────────────────────────────
const VendorProductForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: categories, isLoading: catsLoading } = useCategoriesForVendor();

  // For edit mode — load existing product from cached list
  const { data: products } = useVendorProducts({}, { enabled: isEdit });
  const existing = isEdit ? products?.find((p) => p.id === Number(id)) : undefined;

  const createMutation = useCreateVendorProduct();
  const updateMutation = useUpdateVendorProduct(isEdit ? Number(id) : undefined);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 0,
      name: "",
      name_tl: "",
      name_ar: "",
      description: "",
      price: 0,
      sale_price: null,
      stock: 0,
      unit: "piece",
      is_deal: false,
      deal_type: null,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (existing) {
      form.reset({
        category: existing.category,
        name: existing.name,
        name_tl: existing.name_tl ?? "",
        name_ar: existing.name_ar ?? "",
        description: existing.description ?? "",
        price: Number(existing.price),
        sale_price: existing.sale_price ? Number(existing.sale_price) : null,
        stock: existing.stock,
        unit: existing.unit ?? "piece",
        is_deal: existing.is_deal,
        deal_type: (existing.deal_type as "ONE_RIYAL" | "FIVE_RIYAL" | null) ?? null,
      });
    }
  }, [existing, form]);

  // Image file state (separate from RHF)
  let imageFile: File | null = null;
  const handleImageChange = (file: File | null) => {
    imageFile = file;
  };

  const onSubmit = (values: FormValues) => {
    const fd = new FormData();
    fd.append("category", String(values.category));
    fd.append("name", values.name);
    if (values.name_tl) fd.append("name_tl", values.name_tl);
    if (values.name_ar) fd.append("name_ar", values.name_ar);
    if (values.description) fd.append("description", values.description);
    fd.append("price", String(values.price));
    if (values.sale_price != null) fd.append("sale_price", String(values.sale_price));
    fd.append("stock", String(values.stock));
    fd.append("unit", values.unit);
    fd.append("is_deal", values.is_deal ? "true" : "false");
    if (values.is_deal && values.deal_type) fd.append("deal_type", values.deal_type);
    if (imageFile) fd.append("image", imageFile);

    if (isEdit) {
      updateMutation.mutate(fd, {
        onSuccess: () => {
          toast.success("Product updated");
          navigate("/vendor/products");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
      });
    } else {
      createMutation.mutate(fd, {
        onSuccess: () => {
          toast.success("Product created");
          navigate("/vendor/products");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Create failed"),
      });
    }
  };

  if (isEdit && !existing && products !== undefined) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>Product not found.</p>
        <Button variant="link" asChild>
          <Link to="/vendor/products">← Back to products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link to="/vendor/products">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdit ? "Edit Product" : "Add Product"}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Image */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                currentUrl={existing?.image_url ?? null}
                onChange={handleImageChange}
                disabled={isPending}
              />
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(v) => field.onChange(Number(v))}
                      disabled={catsLoading || isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={catsLoading ? "Loading…" : "Select category"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name tabs */}
              <Tabs defaultValue="en">
                <TabsList className="mb-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="tl">Filipino</TabsTrigger>
                  <TabsTrigger value="ar">Arabic</TabsTrigger>
                </TabsList>
                <TabsContent value="en">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (English) *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Century Tuna 180g" {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="tl">
                  <FormField
                    control={form.control}
                    name="name_tl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (Filipino)</FormLabel>
                        <FormControl>
                          <Input placeholder="Optional Tagalog name" {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <FormField
                    control={form.control}
                    name="name_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (Arabic)</FormLabel>
                        <FormControl>
                          <Input placeholder="الاسم بالعربية" dir="rtl" {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product details, ingredients, usage…"
                        rows={3}
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Pricing & Stock */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pricing & Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (SAR) *</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sale_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price (SAR)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Optional"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? null : e.target.value)
                          }
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock *</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["piece", "kg", "g", "L", "mL", "pack", "box", "bottle", "can", "bag"].map(
                            (u) => (
                              <SelectItem key={u} value={u}>
                                {u}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Deal */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Deal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="is_deal"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <Label className="font-normal cursor-pointer">Mark as a deal</Label>
                  </FormItem>
                )}
              />

              {form.watch("is_deal") && (
                <FormField
                  control={form.control}
                  name="deal_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deal Type *</FormLabel>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(v) => field.onChange(v as "ONE_RIYAL" | "FIVE_RIYAL")}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select deal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ONE_RIYAL">🔴 1 SAR Deal</SelectItem>
                          <SelectItem value="FIVE_RIYAL">⭐ 5 SAR Deal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={isPending} className="min-w-[120px]">
              {isPending && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              {isEdit ? "Save changes" : "Create product"}
            </Button>
            <Button type="button" variant="outline" asChild disabled={isPending}>
              <Link to="/vendor/products">Cancel</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VendorProductForm;
