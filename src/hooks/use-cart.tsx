import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Product, ProductVariant } from "@/lib/api";
import { getUser } from "@/lib/api";

export interface CartItem {
  product: Product;
  variant?: ProductVariant;  // optional — null for products without variants
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: number, variantId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variantId?: number) => void;
  clearCart: () => void;
  setDeliveryFee: (fee: number | null) => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const CART_PREFIX = "legashop_cart";
const DEFAULT_DELIVERY_FEE = 5;

/** Get a user-scoped cart key. Guest users share a "guest" key. */
function getCartKey(): string {
  const user = getUser();
  const userId = user?.id ?? "guest";
  return `${CART_PREFIX}_${userId}`;
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(getCartKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(getCartKey(), JSON.stringify(items));
}

/** Unique key for a cart item — product + variant combo */
function cartItemKey(productId: number, variantId?: number): string {
  return variantId ? `${productId}_v${variantId}` : `${productId}`;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [deliveryFeeOverride, setDeliveryFeeOverride] = useState<number | null>(null);

  // Re-load cart when user changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setItems(loadCart());
    };
    // Listen for login/logout (our auth code sets "legashop_user" in localStorage)
    window.addEventListener("storage", handleStorageChange);

    // Also poll on user change via custom event
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1, variant?: ProductVariant) => {
    setItems((prev) => {
      const maxStock = variant ? variant.stock : product.stock;
      const existing = prev.find(
        (i) => i.product.id === product.id && (i.variant?.id ?? undefined) === (variant?.id ?? undefined)
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && (i.variant?.id ?? undefined) === (variant?.id ?? undefined)
            ? { ...i, quantity: Math.min(i.quantity + quantity, maxStock) }
            : i,
        );
      }
      return [
        ...prev,
        { product, variant, quantity: Math.min(quantity, maxStock) },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: number, variantId?: number) => {
    setItems((prev) => prev.filter(
      (i) => !(i.product.id === productId && (i.variant?.id ?? undefined) === (variantId ?? undefined))
    ));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number, variantId?: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter(
        (i) => !(i.product.id === productId && (i.variant?.id ?? undefined) === (variantId ?? undefined))
      ));
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id === productId && (i.variant?.id ?? undefined) === (variantId ?? undefined)) {
          const maxStock = i.variant ? i.variant.stock : i.product.stock;
          return { ...i, quantity: Math.min(quantity, maxStock) };
        }
        return i;
      }),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setDeliveryFeeOverride(null);
  }, []);

  const setDeliveryFee = useCallback((fee: number | null) => {
    setDeliveryFeeOverride(fee != null && Number.isFinite(fee) ? Math.max(0, fee) : null);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = items.reduce((sum, i) => {
    const variant = i.variant;
    const price = variant
      ? parseFloat(variant.sale_price ?? variant.price)
      : parseFloat(i.product.sale_price ?? i.product.price);
    return sum + price * i.quantity;
  }, 0);

  const deliveryFee = subtotal > 0 ? deliveryFeeOverride ?? DEFAULT_DELIVERY_FEE : 0;

  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setDeliveryFee,
        itemCount,
        subtotal,
        deliveryFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
