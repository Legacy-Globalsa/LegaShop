import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MapPin, Store } from "lucide-react";
import { toast } from "sonner";

import ImageUploader from "@/components/vendor/ImageUploader";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateMyStore } from "@/hooks/use-vendor";

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

const DEFAULT_LOCATION = {
  latitude: 24.7136,
  longitude: 46.6753,
};

const VendorOnboarding = () => {
  const navigate = useNavigate();
  const imageFileRef = useRef<File | null>(null);
  const createStore = useCreateMyStore();

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
      latitude: DEFAULT_LOCATION.latitude,
      longitude: DEFAULT_LOCATION.longitude,
    },
  });

  const isPending = createStore.isPending;

  const onSubmit = (values: FormValues) => {
    const fd = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        fd.append(key, String(value));
      }
    });
    if (imageFileRef.current) fd.append("image", imageFileRef.current);

    createStore.mutate(fd, {
      onSuccess: () => {
        toast.success("Store submitted for approval");
        navigate("/vendor/store");
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Could not create store");
      },
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create your store</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set up the store profile customers will see after admin approval.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="w-4 h-4" />
                Store profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploader
                currentUrl={null}
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
                        <Input placeholder="e.g. Manila Mini Mart" {...field} disabled={isPending} />
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
                        <Input placeholder="Arabic display name" dir="rtl" {...field} disabled={isPending} />
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
                        <Input placeholder="+966 5x xxx xxxx" {...field} disabled={isPending} />
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
                            <SelectValue placeholder="Select city" />
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
                      <Textarea
                        rows={4}
                        placeholder="Specialties, delivery notes, or languages supported."
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

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery and location
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

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="avg_delivery_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avg. delivery min *</FormLabel>
                      <FormControl>
                        <Input type="number" min="10" max="180" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

              <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
                Map pin selection will plug into the Google Maps address picker. For now, the coordinates are editable directly.
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={isPending} className="min-w-[180px]">
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit for approval
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VendorOnboarding;
