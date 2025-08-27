"use client";
import img from "./../public/assets/logo.webp";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartIcon from "@/components/smallComponents/cartIcon/CartIcon";
import {useCart} from "react-use-cart";
import SearchBar from "@/components/SearchBar";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    isEmpty, totalUniqueItems} = useCart();
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
            <ul key={item.name} className="nav-link">
              {item.name}
            </ul>
          ))}
        </nav>

        {/* Header Buttons */}
        <div className="header-buttons">
          <SearchBar/>
          <div className="cart-icon-container">
            <Link href="/cart" className="header-button">
              <CartIcon width={25} height={25} />
            </Link>
            {!isEmpty && (
                <span className="cart-badge">{totalUniqueItems}</span>
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
          <a
            key={item.name}
            href={item.href}
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.name}
          </a>
        ))}
      </nav>
    </header>
  );
}
