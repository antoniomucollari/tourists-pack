"use client";

import img from "../../public/assets/logo.webp";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import CartIcon from "@/components/smallComponents/cartIcon/CartIcon";
import { useHybridCart } from "@/hooks/useHybridCart";
import SearchBar from "@/components/Search/SearchBar";
import AuthButtons from "@/components/Header/AuthButtons";
import { usePathname, useSearchParams } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isEmpty, totalUniqueItems } = useHybridCart();
    const [isClient, setIsClient] = useState(false);

    // --- ANIMATION LOGIC START ---
    const [isAnimating, setIsAnimating] = useState(false);
    const prevTotalItems = useRef(totalUniqueItems);

    useEffect(() => {
        if (totalUniqueItems > prevTotalItems.current) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 500);
            return () => clearTimeout(timer);
        }
        prevTotalItems.current = totalUniqueItems;
    }, [totalUniqueItems]);
    // --- ANIMATION LOGIC END ---

    useEffect(() => {
        setIsClient(true);
    }, []);

    // ✅ hide header for login, register, dashboard paths, OR if ?dashboard query exists
    if (
        pathname?.startsWith("/login") ||
        pathname?.startsWith("/register") ||
        pathname?.startsWith("/dashboard") ||
        searchParams.has("dashboard")
    ) return null;

    const menuItems = [
        { name: "Mobile", href: "/" },
        { name: "Fits & TV", href: "/fits-tv" },
        { name: "eShop", href: "/e-shop" },
        { name: "Tourist Pack", href: "/tourist-pack" },
        { name: "Support", href: "/support" },
    ];

    return (
        <header className="header">
            <div className="header-content">
                {/* Logo */}
                <Link href="/" passHref>
                    <Image
                        src={img}
                        alt="vodafone logo"
                        width={50}
                        height={50}
                        style={{ objectFit: "contain", cursor: "pointer" }}
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="nav">
                    {menuItems.map((item) => (
                        <Link key={item.name} href={item.href} className="nav-link">
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Header Buttons */}
                <div className="header-buttons">
                    <SearchBar />
                    <AuthButtons />

                    <div className="cart-icon-container">
                        <Link href="/cart" className="header-button">
                            <CartIcon width={25} height={25} />
                        </Link>
                        {isClient && !isEmpty && (
                            <span className={`cart-badge ${isAnimating ? "updated" : ""}`}>
                                {totalUniqueItems}
                            </span>
                        )}
                    </div>

                    <button
                        className="mobile-menu-button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        ☰
                    </button>
                </div>
            </div>

            <nav className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="mobile-nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </header>
    );
}
