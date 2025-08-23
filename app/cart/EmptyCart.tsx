
import styles from "./cart.module.css";
import Link from "next/link";
import CartIcon from "@/components/smallComponents/cartIcon/CartIcon";
export default function  EmptyCart(){
    return (
        <>
            <div className={styles["empty-cart-container"]}>
                <div className={styles["empty-cart-header"]}>
                    <h1>Shopping Cart</h1>
                    <p>Explore the Vodafone shop without interruption. Your cart saves all your choices!</p>
                </div>

                <CartIcon margin width={80} height={80} />

                <div className={styles["empty-cart-body"]}>
                    <h2>Shopping cart is empty</h2>
                    <p>Add a Packet</p>
                </div>

                <Link href="/" className={styles["shop-button"]}>
                    Go Back
                </Link>
            </div>
        </>
    );
};