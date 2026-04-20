import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User as UserIcon, Mail, Phone, Shield, Pencil, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile, useUpdateProfile } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const profileSchema = z.object({
  first_name: z.string().min(1, "Name is required").max(150),
  phone_number: z.string().max(20).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileSection = () => {
  const { updateUser } = useAuth();
  const { data: profile } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);

  // Use fresh profile data from API, fall back to auth context
  const user = profile ?? null;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name ?? "",
      phone_number: user?.phone_number ?? "",
    },
  });

  // Reset form defaults when fresh profile data arrives
  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name ?? "",
        phone_number: profile.phone_number ?? "",
      });
    }
  }, [profile, form]);

  const initials = (user?.first_name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values, {
      onSuccess: (updated) => {
        updateUser(updated);
        toast({ title: "Profile updated", description: "Your changes have been saved." });
        setEditing(false);
      },
      onError: (err) => {
        toast({
          title: "Update failed",
          description: err instanceof Error ? err.message : "Something went wrong.",
          variant: "destructive",
        });
      },
    });
  };

  const saving = updateProfileMutation.isPending;

  const handleCancel = () => {
    form.reset({
      first_name: user?.first_name ?? "",
      phone_number: user?.phone_number ?? "",
    });
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Avatar + Name header */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 text-lg">
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-bold">{user?.first_name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs capitalize">
              {user?.role?.toLowerCase()}
            </Badge>
          </div>
        </div>
        {!editing && (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => setEditing(true)}
          >
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
        )}
      </div>

      {editing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input className="pl-9" placeholder="Your name" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email (read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9 bg-muted" value={user?.email ?? ""} disabled />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input className="pl-9" placeholder="+966 5xx xxx xxxx" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <UserIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="text-sm font-medium">{user?.first_name || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{user?.phone_number || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium capitalize">{user?.role?.toLowerCase() || "Customer"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
