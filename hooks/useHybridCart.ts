"use client";

import { useCart as useLocalCart, Item } from "react-use-cart";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import Packet from "@/domain/Packet";
import OrderItem from "@/domain/OrderItem";

export function useHybridCart() {
    const { isAuthenticated,isLoading } = useAuth();
    const localCart = useLocalCart();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [isLoadingState, setIsLoadingState] = useState(true);
    // console.log(orderItems, "orderItems");
    // Define all functions and logic ---
    const fetchBackendCart = async () => {

        if (!isAuthenticated ) {
            setIsLoadingState(false);
            return;
        }
        setIsLoadingState(true);
        
        try {
            const response = await fetch("/api/cart/items");
            if (response.ok) {
                const result = await response.json();
                setOrderItems(result.data.cartItems || []);
                setIsLoadingState(false);
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
                setIsLoadingState(false);


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
            const item = orderItems.find(i => Number(i.packet.id) === packetId);
            if (!item) return;

            if (newQuantity > item.quantity) {
                await fetch(`/api/cart/items/increment/${packetId}`, { method: 'POST' });
            } else if (newQuantity < item.quantity && newQuantity > 0) {
            } else if (newQuantity <= 0) {
                await removeItem(Number(item.id));
                return;
            }
            await fetchBackendCart();
        } else {
            localCart.updateItemQuantity(packetId.toString(), newQuantity);
        }
    };
    const adaptedItems: Packet[] = useMemo(() =>
        orderItems.map(item => ({
            ...item.packet,
            id: item.packet.id,
            cartId: item.id,
            quantity: item.quantity,
            itemTotal: item.subTotal,
        })), [orderItems]);

    const cartTotal = useMemo(() =>
            orderItems.reduce((total, item) => total + item.subTotal, 0),
        [orderItems]);
    // --- 3. Use the 'if' condition to decide what to RETURN ---
    if (!isAuthenticated) {
        return {
            ...localCart,
            isLoading: isLoadingState,
            addItem,
            removeItem,
            updateItemQuantity
        };
    }

    return {
        isLoading: isLoadingState,
        addItem,
        removeItem,
        updateItemQuantity,
        items: adaptedItems,
        isEmpty: orderItems.length === 0,
        totalUniqueItems: orderItems.length,
        totalItems: orderItems.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal,
    };
}