"use client";

import { useCart as useLocalCart, Item } from "react-use-cart";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import Packet from "@/domain/Packet";

export interface BackendCartItem {
    id: string;
    packet: Packet;
    quantity: number;
    subTotal: number;
}
export function useHybridCart() {
    // --- 1. Call ALL hooks unconditionally at the top ---
    const { isAuthenticated } = useAuth();
    const localCart = useLocalCart();
    const [backendItems, setBackendItems] = useState<BackendCartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- 2. Define all functions and logic ---
    const fetchBackendCart = async () => {
        // Make sure we don't fetch if there is a token
        if (!isAuthenticated ) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);

        // Set loading to true only when we are about to fetch
        try {
            const response = await fetch("/api/cart/items");
            if (response.ok) {
                const result = await response.json();
                setBackendItems(result.data.cartItems || []);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Failed to fetch backend cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const mergeLocalCartToBackend = async () => {
        if (!isAuthenticated || localCart.items.length === 0) return;

        try {
             const response = await fetch("/api/cart/merge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: localCart.items.map(item => ({
                        packet: { id: item.id },   // must wrap in "packet"
                        quantity: item.quantity
                    }))
                }),
            });

            if (response.ok) {
                // After merge, clear local cart
                localCart.emptyCart();
                await fetchBackendCart();
                setIsLoading(false);


                // Refresh backend cart
            }
        } catch (error) {
            console.error("Failed to merge local cart:", error);
        }
    };
    useEffect(() => {
        if (isAuthenticated) {
            mergeLocalCartToBackend();
        }
        fetchBackendCart();
    }, [isAuthenticated]);// Re-fetch whenever the isAuthenticated logs in or out

    const addItem = async (product: Item) => {
        if (isAuthenticated) {
            await fetch('/api/cart/add/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packetId: product.id, quantity: 1 }),
            });
            await fetchBackendCart();
        } else {
            localCart.addItem(product);
        }
    };

    const removeItem = async (cartItemId: number) => {
        if (isAuthenticated) {
            await fetch(`/api/cart/items/remove/${cartItemId}`, { method: 'DELETE' });
            await fetchBackendCart();
        } else {
            localCart.removeItem(cartItemId.toString());
        }
    };

    const updateItemQuantity = async (packetId: number, newQuantity: number) => {
        if (isAuthenticated) {
            const item = backendItems.find(i => Number(i.packet.id) === packetId);
            if (!item) return;

            if (newQuantity > item.quantity) {
                await fetch(`/api/cart/items/increment/${packetId}`, { method: 'POST' });
            } else if (newQuantity < item.quantity && newQuantity > 0) {
                await fetch(`/api/cart/items/decrement/${packetId}`, { method: 'POST' });
            } else if (newQuantity <= 0) {
                await removeItem(Number(item.id));
                return;
            }
            await fetchBackendCart();
        } else {
            localCart.updateItemQuantity(packetId.toString(), newQuantity);
        }
    };
    // For logged-in users, return the derived values from the backend state
    const adaptedItems: Packet[] = useMemo(() =>
        backendItems.map(item => ({
            ...item.packet,
            id: item.packet.id,
            cartId: item.id,
            quantity: item.quantity,
            itemTotal: item.subTotal,
        })), [backendItems]);

    const cartTotal = useMemo(() =>
            backendItems.reduce((total, item) => total + item.subTotal, 0),
        [backendItems]);
    // --- 3. Use the 'if' condition to decide what to RETURN ---
    if (!isAuthenticated) {
        return {
            ...localCart,
            isLoading,
            addItem,
            removeItem,
            updateItemQuantity
        };
    }

    return {
        isLoading,
        addItem,
        removeItem,
        updateItemQuantity,
        items: adaptedItems,
        isEmpty: backendItems.length === 0,
        totalUniqueItems: backendItems.length,
        totalItems: backendItems.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal,
    };
}