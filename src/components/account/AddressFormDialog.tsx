import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin } from "lucide-react";
import type { Address, AddressInput } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddressAutocomplete from "@/components/maps/AddressAutocomplete";

const addressSchema = z.object({
  label: z.enum(["HOME", "WORK", "OTHER"]),
  street: z.string().min(1, "Street address is required"),
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  is_default: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address | null;
  saving: boolean;
  onSubmit: (data: AddressInput) => void;
}

const AddressFormDialog = ({ open, onOpenChange, address, saving, onSubmit }: AddressFormDialogProps) => {
  const isEdit = !!address;

  // Store lat/lng separately (not part of react-hook-form since autocomplete sets them)
  const [coords, setCoords] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "HOME",
      street: "",
      district: "",
      city: "Riyadh",
      is_default: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (address) {
        form.reset({
          label: address.label,
          street: address.street,
          district: address.district,
          city: address.city,
          is_default: address.is_default,
        });
        setCoords({ latitude: address.latitude, longitude: address.longitude });
      } else {
        form.reset({
          label: "HOME",
          street: "",
          district: "",
          city: "Riyadh",
          is_default: false,
        });
        setCoords({ latitude: null, longitude: null });
      }
    }
  }, [open, address, form]);

  // When user selects an address from Google Places autocomplete
  const handleAutocompleteSelect = useCallback(
    (result: { street: string; district: string; city: string; latitude: number; longitude: number }) => {
      form.setValue("street", result.street, { shouldValidate: true });
      form.setValue("district", result.district, { shouldValidate: true });
      form.setValue("city", result.city, { shouldValidate: true });
      setCoords({ latitude: result.latitude, longitude: result.longitude });
    },
    [form]
  );

  const handleSubmit = (values: AddressFormValues) => {
    onSubmit({
      ...values,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Address" : "Add New Address"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HOME">🏠 Home</SelectItem>
                      <SelectItem value="WORK">🏢 Work</SelectItem>
                      <SelectItem value="OTHER">📍 Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Google Places Autocomplete — fills street, district, city, lat/lng */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Search Address</label>
              <AddressAutocomplete
                onAddressSelect={handleAutocompleteSelect}
                placeholder="Type to search your address..."
                defaultValue={isEdit ? address?.street || "" : ""}
              />
              {coords.latitude && coords.longitude && (
                <p className="flex items-center gap-1 text-xs text-emerald-600">
                  <MapPin className="w-3 h-3" />
                  Location pinned ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Building 12, Apt 3, Street 15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input placeholder="Al Batha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Riyadh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_default"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <FormLabel className="text-sm font-medium">Default Address</FormLabel>
                    <p className="text-xs text-muted-foreground">Use this as your primary delivery address</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? "Save Changes" : "Add Address"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormDialog;
