"use client";

import img from "./../public/assets/logo.webp";

import {useEffect, useState} from "react";

import Image from "next/image";

import Link from "next/link";

import CartIcon from "@/components/smallComponents/cartIcon/CartIcon";

import {useCart} from "react-use-cart";

import SearchBar from "@/components/Search/SearchBar";


import {User} from "lucide-react";
import {useAuth} from "@/context/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isEmpty, totalUniqueItems } = useCart();
  const [isClient, setIsClient] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.roles.includes("ADMIN");
  useEffect(() => {
    setIsClient(true);
  }, []);

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
            {isAdmin && (
                <Link href="/dashboard" className="hover:text-gray-300 transition">
                  Dashboard
                </Link>
            )}
            {/* START: Login Button */}
            <div>
              {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm">Hello, {user.name}</span>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                      Logout
                    </button>
                  </div>
              ) : (
                  <Link
                      href="/login"
                      className="
                  inline-flex items-center gap-2
                  rounded-full bg-red-600 px-5 py-2.5
                  text-sm font-medium text-white
                  shadow-sm transition-all duration-200
                  hover:bg-red-800
                  focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
                  active:scale-95">

                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
              )}
            </div>

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
