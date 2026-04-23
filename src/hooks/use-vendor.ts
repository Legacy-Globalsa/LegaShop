import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMyStore,
  createVendorProduct,
  deleteVendorProduct,
  fetchMyStore,
  fetchVendorOrder,
  fetchVendorOrders,
  fetchVendorProducts,
  updateMyStore,
  updateVendorOrderStatus,
  updateVendorProduct,
  type ProductInput,
  type StoreInput,
  type VendorOrderFilters,
  type VendorProductFilters,
} from "@/lib/vendor-api";
import { fetchCategories } from "@/lib/api";
import {
  MOCK_VENDOR_ANALYTICS,
  MOCK_VENDOR_PAYOUTS,
  USE_VENDOR_MOCK,
  type VendorAnalytics,
} from "@/lib/vendor-mock";
import type { Order } from "@/lib/api";

// ──────────────────────────────────────
// Store
// ──────────────────────────────────────

export function useMyStore() {
  return useQuery({
    queryKey: ["vendor", "store", "me"],
    queryFn: fetchMyStore,
    staleTime: 60_000,
  });
}

export function useCreateMyStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: StoreInput | FormData) => createMyStore(data),
    onSuccess: (store) => {
      qc.setQueryData(["vendor", "store", "me"], store);
    },
  });
}

export function useUpdateMyStore(id: number | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: StoreInput | FormData) => {
      if (!id) throw new Error("Store id is required");
      return updateMyStore(id, data);
    },
    onSuccess: (store) => {
      qc.setQueryData(["vendor", "store", "me"], store);
    },
  });
}

// ──────────────────────────────────────
// Products
// ──────────────────────────────────────

export function useVendorProducts(filters: VendorProductFilters = {}) {
  return useQuery({
    queryKey: ["vendor", "products", filters],
    queryFn: () => fetchVendorProducts(filters),
    staleTime: 30_000,
  });
}

export function useCreateVendorProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductInput | FormData) => createVendorProduct(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor", "products"] });
    },
  });
}

export function useUpdateVendorProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductInput> | FormData }) =>
      updateVendorProduct(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor", "products"] });
    },
  });
}

export function useDeleteVendorProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteVendorProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor", "products"] });
    },
  });
}

// ──────────────────────────────────────
// Orders
// ──────────────────────────────────────

export function useVendorOrders(filters: VendorOrderFilters = {}, options: { refetchInterval?: number } = {}) {
  return useQuery({
    queryKey: ["vendor", "orders", filters],
    queryFn: () => fetchVendorOrders(filters),
    staleTime: 15_000,
    refetchInterval: options.refetchInterval,
  });
}

export function useVendorOrder(id: number | undefined) {
  return useQuery({
    queryKey: ["vendor", "order", id],
    queryFn: () => fetchVendorOrder(id as number),
    enabled: !!id,
  });
}

export function useUpdateVendorOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Order["status"] }) =>
      updateVendorOrderStatus(id, status),
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: ["vendor", "orders"] });
      qc.setQueryData(["vendor", "order", order.id], order);
    },
  });
}

// ──────────────────────────────────────
// Categories (re-export for vendor product form)
// ──────────────────────────────────────

export function useCategoriesForVendor() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
  });
}

// ──────────────────────────────────────
// Analytics & Payouts (mock until backend G4/G7 ship)
// ──────────────────────────────────────

export function useVendorAnalytics() {
  return useQuery<VendorAnalytics>({
    queryKey: ["vendor", "analytics"],
    queryFn: async () => {
      if (USE_VENDOR_MOCK) {
        return MOCK_VENDOR_ANALYTICS;
      }
      // Future: GET /api/vendor/analytics/
      throw new Error("Vendor analytics endpoint not implemented yet");
    },
    staleTime: 60_000,
  });
}

export function useVendorPayouts() {
  return useQuery({
    queryKey: ["vendor", "payouts"],
    queryFn: async () => {
      if (USE_VENDOR_MOCK) return MOCK_VENDOR_PAYOUTS;
      throw new Error("Vendor payouts endpoint not implemented yet");
    },
    staleTime: 5 * 60_000,
  });
}
