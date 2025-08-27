"use client"

import styles from "./cart.module.css";
import {useCart} from "react-use-cart";
import EmptyCart from "@/app/cart/EmptyCart";
import {Trash2} from "lucide-react";
import Loading from "./loading";
import {useEffect, useState} from "react";
export default function Page() {
    const [isMounted, setIsMounted] = useState(false);

    // assumed (avoids localStorage SSR errors) but not true
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("sq-AL", {
            style: "currency",
            currency: "Lek", // adjust currency if needed
        }).format(price);
    };

    const {
        isEmpty,
        totalUniqueItems,
        items,
        updateItemQuantity,
        removeItem,
        cartTotal,
    } = useCart();

    if (!isMounted) return <Loading/>;
    if (isEmpty) return <EmptyCart />;
    return (
            <div className={styles["cart-page"]}>
                <div className={styles["cart-container"]}>
                    <h1>Shopping Cart</h1>

                    <div className={styles["cart-layout"]}>
                        <div className={styles["cart-items-column"]}>
                            <h2 className={styles["column-title"]}>
                                Your Items ({totalUniqueItems})
                            </h2>
                            <ul className={styles["cart-items-list"]}>
                                {items.map((item) => (
                                    <li key={item.id} className={styles["cart-item"]}>
                                        <div className={styles["cart-item-info"]}>
                                            <img
                                                src={`https://publish.oneappcms.vodafone.com/content/dam/multimedia/oneappcms/al/web%20assets/New%20images%20for%20homepage%20test/herobanner-images/RoamingHerobanner.jpg`}
                                                alt={item.name}
                                                className={styles["cart-item-image"]} />
                                            <div className={styles["cart-item-details"]}>
                                                <h3>{item.title}</h3>
                                                <p>{formatPrice(item.price)}</p>
                                            </div>
                                        </div>

                                        <div className={styles["cart-item-controls"]}>
                                            <div className={styles["quantity-controls"]}>
                                                <button onClick={() => updateItemQuantity(
                                                            item.id,
                                                            (item.quantity ?? 0) - 1)}> - </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateItemQuantity(item.id,(item.quantity ?? 0) + 1)}> + </button>
                                            </div>
                                            <p className={styles["item-total-price"]}>
                                                {formatPrice(item.itemTotal ?? 0)}
                                            </p>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className={styles["remove-item-button"]}
                                                title="Remove item" >
                                                <Trash2 color="red" size={20}/>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles["order-summary-column"]}>
                            <div className={styles["order-summary"]}>
                                <h2 className={styles["column-title"]}>
                                    Order Summary
                                </h2>
                                <div className={styles["summary-details"]}>
                                    <div className={styles["summary-row"]}>
                                        <span>Subtotal</span>
                                        <span>{formatPrice(cartTotal)}</span>
                                    </div>
                                    <div className={styles["summary-row"]}>
                                        <span>Shipping</span>
                                        <span>-</span>
                                    </div>
                                    <div className={styles["summary-row"]}>
                                        <span>Taxes</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className={styles["summary-total"]}>
                                        <span>Total</span>
                                        <span>{formatPrice(cartTotal)}</span>
                                    </div>
                                </div>
                                <button className={styles["checkout-button"]}>
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}