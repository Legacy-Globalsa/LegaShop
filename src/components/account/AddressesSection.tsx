import { useState, useEffect, useCallback } from "react";
import { MapPin, Plus, Star, Pencil, Trash2, Loader2 } from "lucide-react";
import { Address, AddressInput, fetchAddresses, createAddress, updateAddress, deleteAddress } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddressFormDialog from "./AddressFormDialog";

const labelEmoji: Record<string, string> = { HOME: "🏠", WORK: "🏢", OTHER: "📍" };

const AddressesSection = () => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);

  const loadAddresses = useCallback(async () => {
    try {
      const data = await fetchAddresses();
      setAddresses(data);
    } catch {
      toast({ title: "Error", description: "Failed to load addresses.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleCreate = () => {
    setEditingAddress(null);
    setFormOpen(true);
  };

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: AddressInput) => {
    setSaving(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
        toast({ title: "Address updated" });
      } else {
        await createAddress(data);
        toast({ title: "Address added" });
      }
      setFormOpen(false);
      await loadAddresses();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAddress(deleteTarget.id);
      toast({ title: "Address deleted" });
      setDeleteTarget(null);
      await loadAddresses();
    } catch {
      toast({ title: "Error", description: "Failed to delete address.", variant: "destructive" });
    }
  };

  const handleSetDefault = async (addr: Address) => {
    try {
      await updateAddress(addr.id, { is_default: true });
      toast({ title: "Default address updated" });
      await loadAddresses();
    } catch {
      toast({ title: "Error", description: "Failed to set default address.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {addresses.length} address{addresses.length !== 1 ? "es" : ""} saved
        </p>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <MapPin className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="text-base font-semibold mb-1">No addresses yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add a delivery address to get started.
          </p>
          <Button size="sm" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`relative p-4 rounded-xl border transition ${
                addr.is_default ? "border-primary bg-primary/5" : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{labelEmoji[addr.label] ?? "📍"}</span>
                  <Badge variant={addr.is_default ? "default" : "outline"} className="text-xs">
                    {addr.label}
                  </Badge>
                  {addr.is_default && (
                    <span className="flex items-center gap-0.5 text-[10px] text-primary font-semibold">
                      <Star className="w-3 h-3 fill-primary" /> Default
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm font-medium">{addr.street}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {addr.district}, {addr.city}
              </p>

              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handleEdit(addr)}>
                  <Pencil className="w-3 h-3 mr-1" /> Edit
                </Button>
                {!addr.is_default && (
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handleSetDefault(addr)}>
                    <Star className="w-3 h-3 mr-1" /> Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive ml-auto"
                  onClick={() => setDeleteTarget(addr)}
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Dialog */}
      <AddressFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        address={editingAddress}
        saving={saving}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddressesSection;
