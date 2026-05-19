import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import type { Order } from "@/lib/api";

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  useMyStore: vi.fn(),
  useUpdateVendorOrderStatus: vi.fn(),
  useCreateVendorProduct: vi.fn(),
  useUpdateVendorProduct: vi.fn(),
  useVendorProducts: vi.fn(),
  useCategoriesForVendor: vi.fn(),
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: mocks.useAuth,
}));

vi.mock("@/hooks/use-vendor", () => ({
  useMyStore: mocks.useMyStore,
  useUpdateVendorOrderStatus: mocks.useUpdateVendorOrderStatus,
  useCreateVendorProduct: mocks.useCreateVendorProduct,
  useUpdateVendorProduct: mocks.useUpdateVendorProduct,
  useVendorProducts: mocks.useVendorProducts,
  useCategoriesForVendor: mocks.useCategoriesForVendor,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/components/vendor/ImageUploader", () => ({
  default: () => <div data-testid="image-uploader" />,
}));

vi.mock("@/components/ui/select", async () => {
  const React = await import("react");
  const SelectContext = React.createContext({ onValueChange: (_value: string) => {} });

  return {
    Select: ({ children, onValueChange }: { children: React.ReactNode; onValueChange?: (value: string) => void }) => (
      <SelectContext.Provider value={{ onValueChange: onValueChange ?? (() => {}) }}>
        <div>{children}</div>
      </SelectContext.Provider>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
    SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
    SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SelectItem: ({ value, children }: { value: string; children: React.ReactNode }) => {
      const ctx = React.useContext(SelectContext);
      return (
        <button type="button" onClick={() => ctx.onValueChange(value)}>
          {children}
        </button>
      );
    },
  };
});

import VendorRoute from "@/components/VendorRoute";
import OrderStatusActions from "@/components/vendor/OrderStatusActions";
import VendorProductForm from "@/pages/vendor/VendorProductForm";

const renderWithQuery = (ui: React.ReactNode, initialEntries = ["/"]) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

const makeOrder = (status: Order["status"]): Order => ({
  id: 42,
  user: 1,
  customer_name: "Maria Santos",
  customer_email: "maria@example.com",
  store: 7,
  store_name: "Test Store",
  delivery_address: 3,
  order_type: "LOCAL_RIYADH",
  status,
  subtotal: "20.00",
  delivery_fee: "5.00",
  total: "25.00",
  currency: "SAR",
  note: "",
  items: [],
  payment: {
    id: 1,
    method: "COD",
    status: "PENDING",
    amount: "25.00",
    currency: "SAR",
    reference: "",
    paid_at: null,
    created_at: "2026-05-20T08:00:00Z",
  },
  created_at: "2026-05-20T08:00:00Z",
  updated_at: "2026-05-20T08:00:00Z",
});

describe("vendor portal smoke tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    });
    mocks.useMyStore.mockReturnValue({ data: null, isLoading: false });
    mocks.useUpdateVendorOrderStatus.mockReturnValue({ mutate: vi.fn(), isPending: false });
    mocks.useCreateVendorProduct.mockReturnValue({ mutate: vi.fn(), isPending: false });
    mocks.useUpdateVendorProduct.mockReturnValue({ mutate: vi.fn(), isPending: false });
    mocks.useVendorProducts.mockReturnValue({ data: [], isLoading: false });
    mocks.useCategoriesForVendor.mockReturnValue({
      data: [{ id: 1, name: "Groceries" }],
      isLoading: false,
    });
  });

  it("redirects unauthenticated users away from vendor routes", () => {
    renderWithQuery(
      <Routes>
        <Route path="/vendor" element={<VendorRoute><div>Vendor content</div></VendorRoute>} />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>,
      ["/vendor"]
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Vendor content")).not.toBeInTheDocument();
  });

  it("renders only valid status actions and triggers the next transition", () => {
    const mutate = vi.fn();
    mocks.useUpdateVendorOrderStatus.mockReturnValue({ mutate, isPending: false });

    renderWithQuery(<OrderStatusActions order={makeOrder("PENDING")} />);

    expect(screen.getByRole("button", { name: /accept order/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /start preparing/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /accept order/i }));

    expect(mutate).toHaveBeenCalledWith(
      { id: 42, status: "CONFIRMED" },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it("submits the product create form with required fields", async () => {
    const mutate = vi.fn();
    mocks.useCreateVendorProduct.mockReturnValue({ mutate, isPending: false });

    renderWithQuery(
      <Routes>
        <Route path="/vendor/products/new" element={<VendorProductForm />} />
      </Routes>,
      ["/vendor/products/new"]
    );

    fireEvent.click(screen.getByRole("button", { name: "Groceries" }));
    fireEvent.change(screen.getByLabelText(/name \(english\)/i), {
      target: { value: "Jasmine Rice" },
    });
    fireEvent.change(screen.getByLabelText(/^price \(sar\) \*$/i), {
      target: { value: "18.50" },
    });
    fireEvent.change(screen.getByLabelText(/^stock/i), {
      target: { value: "12" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create product/i }));

    await waitFor(() => expect(mutate).toHaveBeenCalled());
    const payload = mutate.mock.calls[0][0] as FormData;

    expect(payload.get("category")).toBe("1");
    expect(payload.get("name")).toBe("Jasmine Rice");
    expect(payload.get("price")).toBe("18.5");
    expect(payload.get("stock")).toBe("12");
  });
});
