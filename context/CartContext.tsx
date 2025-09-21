"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart as useLocalCart, Item } from "react-use-cart";
import { CartData } from "@/domain/CartData";
import { CartItemInterface } from "@/domain/CartItemInterface";
import Product from "@/domain/Product";

interface CartContextType {
  isLoading: boolean;
  addItem: (product: Product) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  updateItemQuantity: (packetId: number, newQuantity: number) => Promise<void>;
  items: Product[];
  isEmpty: boolean;
  totalUniqueItems: number;
  totalItems: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const localCart = useLocalCart();
  const [orderItems, setOrderItems] = useState<CartItemInterface[]>([]);
  const [isLoadingState, setIsLoadingState] = useState(true);

  const fetchBackendCart = async () => {
    if (!isAuthenticated) {
      setIsLoadingState(false);
      return;
    }
    setIsLoadingState(true);
    try {
      const response = await fetch("/api/cart/items", { cache: "no-store" });
      if (response.ok) {
        const result = await response.json();
        setOrderItems(result.data.cartItems || []);
      }
    } catch (error) {
      console.error("Failed to fetch backend cart:", error);
    } finally {
      setIsLoadingState(false);
    }
  };

  const mergeLocalCartToBackend = async () => {
    if (!isAuthenticated || localCart.items.length === 0) return;
    try {
      const response = await fetch("/api/cart/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: localCart.items.map((item) => ({
            product: {
              id: item.id,
              productType: item.productType,
            },
            quantity: item.quantity,
          })),
        }),
      });
      if (response.ok) {
        localCart.emptyCart();
        await fetchBackendCart();
      }
    } catch (error) {
      console.error("Failed to merge local cart:", error);
    }
  };

  useEffect(() => {
    const initializeCart = async () => {
      if (isAuthenticated) {
        if (localCart.items.length > 0) {
          await mergeLocalCartToBackend();
        } else {
          await fetchBackendCart();
        }
      } else {
        setIsLoadingState(false);
      }
    };
    initializeCart();
  }, [isAuthenticated]);

  const addItem = async (product: Product | any) => {
    if (isAuthenticated) {
      await fetch("/api/cart/add/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      await fetchBackendCart();
    } else {
      // Transform the product data to match react-use-cart's Item interface
      const cartItem = {
        id: product.id || product.title, // Use title as fallback for packets
        name: product.name || product.title,
        price: product.price,
        quantity: 1,
        productType: product.productType || "PACKET",
        subtitle: product.subtitle,
        duration: product.duration,
        features: product.features,
        isPopular: product.isPopular,
      };
      localCart.addItem(cartItem);
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (isAuthenticated) {
      await fetch(`/api/cart/items/remove/${cartItemId}`, { method: "DELETE" });
      await fetchBackendCart();
    } else {
      localCart.removeItem(cartItemId.toString());
    }
  };

  const updateItemQuantity = async (packetId: number, newQuantity: number) => {
    if (isAuthenticated) {
      const item = orderItems.find((i) => Number(i.product.id) === packetId);
      if (!item || newQuantity === item.quantity) return;

      if (newQuantity <= 0) {
        await removeItem(Number(item.id));
        return;
      } else if (newQuantity > item.quantity) {
        await fetch(`/api/cart/items/increment/${packetId}`, {
          method: "POST",
        });
      } else if (newQuantity < item.quantity) {
        await fetch(`/api/cart/items/decrement/${packetId}`, {
          method: "POST",
        });
      }
      await fetchBackendCart();
    } else {
      localCart.updateItemQuantity(packetId.toString(), newQuantity);
    }
  };

  const cartData = useMemo(() => {
    if (isAuthenticated) {
      const adaptedItems = orderItems.map((item) => ({
        ...item.product,
        id: item.product.id,
        cartId: item.id,
        quantity: item.quantity,
        itemTotal: item.subTotal,
      }));
      return {
        items: adaptedItems,
        isEmpty: orderItems.length === 0,
        totalUniqueItems: orderItems.length,
        totalItems: orderItems.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal: orderItems.reduce((total, item) => total + item.subTotal, 0),
      };
    } else {
      return {
        items: localCart.items,
        isEmpty: localCart.isEmpty,
        totalUniqueItems: localCart.totalUniqueItems,
        totalItems: localCart.totalItems,
        cartTotal: localCart.cartTotal,
      };
    }
  }, [isAuthenticated, orderItems, localCart]);

  const value = {
    isLoading: isLoadingState,
    addItem,
    removeItem,
    updateItemQuantity,
    ...cartData,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Create the consumer hook
export function useHybridCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useHybridCart must be used within a CartProvider");
  }
  return context;
}
