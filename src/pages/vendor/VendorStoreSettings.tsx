import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, CheckCircle2, Clock, Loader2, MapPin, ShieldCheck, Star, Store } from "lucide-react";
import { toast } from "sonner";

import ImageUploader from "@/components/vendor/ImageUploader";
import AddressPickerMap, { type AddressPickerLocation } from "@/components/maps/AddressPickerMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMyStore, useUpdateMyStore } from "@/hooks/use-vendor";

const DISTRICTS = [
  "Riyadh",
  "Jeddah",
  "Dammam",
  "Khobar",
  "Dhahran",
  "Makkah",
  "Madinah",
  "Taif",
  "Al Ahsa",
  "Jubail",
];

const schema = z.object({
  name: z.string().min(2, "Store name is required").max(160),
  name_ar: z.string().max(160).optional().or(z.literal("")),
  phone: z.string().min(7, "Phone is required").max(30),
  district: z.string().min(1, "District is required"),
  description: z.string().max(800).optional().or(z.literal("")),
  delivery_zone: z.coerce.number().min(1).max(25),
  avg_delivery_min: z.coerce.number().int().min(10).max(180),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

type FormValues = z.infer<typeof schema>;

const formatDate = (value?: string) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
};

const VendorStoreSettings = () => {
  const imageFileRef = useRef<File | null>(null);
  const { data: store, isLoading } = useMyStore();
  const updateStore = useUpdateMyStore(store?.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      name_ar: "",
      phone: "",
      district: "Riyadh",
      description: "",
      delivery_zone: 5,
      avg_delivery_min: 45,
      latitude: 24.7136,
      longitude: 46.6753,
    },
  });

  useEffect(() => {
    if (!store) return;
    form.reset({
      name: store.name ?? "",
      name_ar: store.name_ar ?? "",
      phone: store.phone ?? "",
      district: store.district ?? "Riyadh",
      description: store.description ?? "",
      delivery_zone: Number(store.delivery_zone ?? 5),
      avg_delivery_min: Number(store.avg_delivery_min ?? 45),
      latitude: Number(store.latitude ?? 24.7136),
      longitude: Number(store.longitude ?? 46.6753),
    });
  }, [form, store]);

  const isPending = updateStore.isPending;
  const selectedLatitude = form.watch("latitude");
  const selectedLongitude = form.watch("longitude");
  const selectedDeliveryZone = form.watch("delivery_zone");

  const handleLocationSelect = (location: AddressPickerLocation) => {
    form.setValue("latitude", location.lat, { shouldDirty: true, shouldValidate: true });
    form.setValue("longitude", location.lng, { shouldDirty: true, shouldValidate: true });
    if (location.district && DISTRICTS.includes(location.district)) {
      form.setValue("district", location.district, { shouldDirty: true, shouldValidate: true });
    }
  };

  const onSubmit = (values: FormValues) => {
    const fd = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        fd.append(key, String(value));
      }
    });
    if (imageFileRef.current) fd.append("image", imageFileRef.current);

    updateStore.mutate(fd, {
      onSuccess: () => {
        imageFileRef.current = null;
        toast.success("Store settings saved");
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Could not save store settings");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Store profile has not been created yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Store Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your public profile, delivery coverage, and approval status.
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            store.is_active
              ? "border-green-300 bg-green-50 text-green-700 w-fit"
              : "border-amber-300 bg-amber-50 text-amber-800 w-fit"
          }
        >
          {store.is_active ? "Approved" : "Pending approval"}
        </Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="profile" className="space-y-5">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploader
                    currentUrl={store.image_url ?? store.image ?? null}
                    onChange={(file) => {
                      imageFileRef.current = file;
                    }}
                    disabled={isPending}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store name *</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arabic name</FormLabel>
                          <FormControl>
                            <Input dir="rtl" {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City / district *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DISTRICTS.map((district) => (
                                <SelectItem key={district} value={district}>
                                  {district}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <FormField
                    control={form.control}
                    name="delivery_zone"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-3">
                          <FormLabel>Delivery zone</FormLabel>
                          <span className="text-sm font-medium">{field.value} km</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={25}
                            step={1}
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avg_delivery_min"
                    render={({ field }) => (
                      <FormItem className="max-w-xs">
                        <FormLabel>Average delivery time *</FormLabel>
                        <FormControl>
                          <Input type="number" min="10" max="180" {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
                    Opening hours are planned for the backend hours JSON field. This tab is ready to extend when that field lands.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude *</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.000001" {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude *</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.000001" {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <AddressPickerMap
                    initialLat={selectedLatitude}
                    initialLng={selectedLongitude}
                    radiusKm={selectedDeliveryZone}
                    showRadius
                    height="320px"
                    onLocationSelect={handleLocationSelect}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="status">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Approval
                    </div>
                    <p className="text-2xl font-semibold mt-2">{store.is_active ? "Approved" : "Pending"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Admin approval controls public storefront visibility.
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Star className="w-4 h-4" />
                      Rating
                    </div>
                    <p className="text-2xl font-semibold mt-2">{Number(store.rating ?? 0).toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Average customer review score.</p>
                  </div>
                  <div className="rounded-lg border p-4 sm:col-span-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CalendarDays className="w-4 h-4" />
                      Joined
                    </div>
                    <p className="text-lg font-semibold mt-2">{formatDate(store.created_at)}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-5 flex gap-3">
            <Button type="submit" disabled={isPending} className="min-w-[140px]">
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VendorStoreSettings;
