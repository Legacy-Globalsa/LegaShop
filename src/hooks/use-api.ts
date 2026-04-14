import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductById,
  fetchDeals,
  fetchCategories,
  fetchStores,
  fetchStoreById,
  fetchStoreProducts,
  fetchProductReviews,
  fetchStoreReviews,
  fetchOrders,
  fetchOrderById,
  createOrder,
  cancelOrder,
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  fetchProfile,
  updateProfile,
  changePassword,
  createReview,
  type CreateOrderData,
  type AddressInput,
  type CreateReviewData,
} from "@/lib/api";

// ──────────────────────────────────────
// Products
// ──────────────────────────────────────

export function useProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}

export function useDeals(dealType?: "ONE_RIYAL" | "FIVE_RIYAL") {
  return useQuery({
    queryKey: ["deals", dealType ?? "all"],
    queryFn: () => fetchDeals(dealType),
    staleTime: 2 * 60 * 1000,
  });
}

// ──────────────────────────────────────
// Categories
// ──────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
}

// ──────────────────────────────────────
// Stores
// ──────────────────────────────────────

export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
    staleTime: 2 * 60 * 1000,
  });
}

export function useStore(id: number) {
  return useQuery({
    queryKey: ["store", id],
    queryFn: () => fetchStoreById(id),
    enabled: !!id,
  });
}

export function useStoreProducts(storeId: number) {
  return useQuery({
    queryKey: ["storeProducts", storeId],
    queryFn: () => fetchStoreProducts(storeId),
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000,
  });
}

// ──────────────────────────────────────
// Reviews
// ──────────────────────────────────────

export function useProductReviews(productId: number) {
  return useQuery({
    queryKey: ["productReviews", productId],
    queryFn: () => fetchProductReviews(productId),
    enabled: !!productId,
  });
}

export function useStoreReviews(storeId: number) {
  return useQuery({
    queryKey: ["storeReviews", storeId],
    queryFn: () => fetchStoreReviews(storeId),
    enabled: !!storeId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewData) => createReview(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["storeReviews", variables.store] });
      if (variables.product) {
        queryClient.invalidateQueries({ queryKey: ["productReviews", variables.product] });
      }
    },
  });
}

// ──────────────────────────────────────
// Orders
// ──────────────────────────────────────

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderData) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
  });
}

// ──────────────────────────────────────
// Addresses
// ──────────────────────────────────────

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressInput) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AddressInput> }) => updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

// ──────────────────────────────────────
// Profile
// ──────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { first_name?: string; phone_number?: string }) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { current_password: string; new_password: string; confirm_new_password: string }) =>
      changePassword(data),
  });
}
