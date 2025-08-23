"use client"
import styles from "./cart.module.css";
import {useCart} from "react-use-cart";
import EmptyCart from "@/app/cart/EmptyCart";
export default function Cart(){
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('sq-AL', {
            style: 'currency',
            currency: 'Lek', // Change currency as needed
        }).format(price);
    };
    const {
        isEmpty,
        totalUniqueItems,
        items,
        updateItemQuantity,
        removeItem,
        cartTotal
    } = useCart();
    if (isEmpty) return <EmptyCart/>;
    return (
        <>
            <div className={styles["cart-page"]}>
                <div className={styles["cart-container"]}>
                    <h1>Shopping Cart</h1>

                    <div className={styles["cart-layout"]}>
                        {/* Left Column: Cart Items */}
                        <div className={styles["cart-items-column"]}>
                            <h2 className={styles["column-title"]}>
                                Your Items ({totalUniqueItems})
                            </h2>
                            <ul className={styles["cart-items-list"]}>
                                {items.map((item) => (
                                    <li key={item.id} className={styles["cart-item"]}>
                                        <div className={styles["cart-item-info"]}>
                                            <img
                                                src={
                                                    `https://home.vodafone.al/tourist/_next/static/media/vodafone-logo-inverted-full.f33a6614.svg`
                                                }
                                                alt={item.name}
                                                className={styles["cart-item-image"]}
                                            />
                                            <div className={styles["cart-item-details"]}>
                                                <h3>{item.title}</h3>
                                                <p>{formatPrice(item.price)} each</p>
                                            </div>
                                        </div>

                                        <div className={styles["cart-item-controls"]}>
                                            <div className={styles["quantity-controls"]}>
                                                <button
                                                    onClick={() =>
                                                        updateItemQuantity(
                                                            item.id,
                                                            item.quantity ?? 1 - 1
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        updateItemQuantity(
                                                            item.id,
                                                            (item.quantity ?? 0) + 1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className={styles["item-total-price"]}>
                                                {formatPrice(item.itemTotal ?? 0)}
                                            </p>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className={styles["remove-item-button"]}
                                                title="Remove item"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line
                                                        x1="10"
                                                        y1="11"
                                                        x2="10"
                                                        y2="17"
                                                    ></line>
                                                    <line
                                                        x1="14"
                                                        y1="11"
                                                        x2="14"
                                                        y2="17"
                                                    ></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Column: Order Summary */}
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
        </>
    );
}