"use client";

import img from "../../public/assets/logo.webp";

import {useEffect, useState} from "react";

import Image from "next/image";

import Link from "next/link";

import CartIcon from "@/components/smallComponents/cartIcon/CartIcon";

import { useHybridCart } from "@/hooks/useHybridCart";

import SearchBar from "@/components/Search/SearchBar";

import AuthButtons from "@/components/Header/AuthButtons";
import {usePathname} from "next/navigation";

export default function Header() {
    const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isEmpty, totalUniqueItems } = useHybridCart();
  console.log(totalUniqueItems);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

    if (pathname?.startsWith("/login") || pathname.startsWith("/register")) return null;
  const menuItems = [
    { name: "Mobile", href: "/" },
    { name: "Fits & TV", href: "/fits-tv" },
    { name: "eShop", href: "/eshop" },
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
                // Using a Link for navigation is better practice
                <Link key={item.name} href={item.href} className="nav-link">
                  {item.name}
                </Link>
            ))}
          </nav>

          {/* Header Buttons */}
          <div className="header-buttons">
            <SearchBar />

           <AuthButtons/>

            {/* END: Login Button */}

            <div className="cart-icon-container">
              <Link href="/cart" className="header-button">
                <CartIcon width={25} height={25} />
              </Link>
              {isClient && !isEmpty && (
                  <span className="cart-badge">{totalUniqueItems}</span>
              )}
            </div>
            <button
                className="mobile-menu-button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>

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
