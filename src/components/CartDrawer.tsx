import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, itemCount, subtotal, deliveryFee, total } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Cart
            {itemCount > 0 && (
              <span className="ml-1 text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="text-6xl">🛒</span>
            <div>
              <h3 className="font-bold text-lg mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Browse our deals and add some products!
              </p>
            </div>
            <Link
              to="/deals/1-sar"
              onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
            >
              Browse 1 SAR Deals
            </Link>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-4 space-y-4">
                {items.map(({ product, quantity }) => {
                  const price = parseFloat(product.sale_price ?? product.price);
                  const hasDiscount = product.sale_price !== null;
                  return (
                    <div key={product.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.store_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-destructive">
                            {price.toFixed(2)} SAR
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through">
                              {product.price} SAR
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border rounded-md overflow-hidden">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1.5 hover:bg-muted transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-bold min-w-[28px] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1.5 hover:bg-muted transition"
                              disabled={quantity >= product.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="border-t border-border">
              <div className="px-6 py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-semibold">{deliveryFee.toFixed(2)} SAR</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-destructive">{total.toFixed(2)} SAR</span>
                </div>
              </div>

              <SheetFooter className="px-6 pb-6 pt-0">
                <Link
                  to="/checkout"
                  onClick={() => onOpenChange(false)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition"
                >
                  Proceed to Checkout
                </Link>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
