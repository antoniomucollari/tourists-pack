import styles from "./cartIcon.module.css";

export default function CartIcon({width, height, margin}: CartIconProps){
    return (
        <div>
            <svg style={{
                margin: margin ? "3rem" : "0",
            }} className={styles["empty-cart-icon"] } xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
        </div>
    )
};

type CartIconProps = {
    width: number,
    height: number,
    margin?: boolean,
}