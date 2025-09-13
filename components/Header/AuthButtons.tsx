"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import {User, LogOut, LayoutDashboard, ChevronDown, ShoppingCart} from "lucide-react"; // Assuming you use lucide-react
import { useAuth } from "@/context/AuthContext";
import {useState} from "react";
const SkeletonAuthButton = () => (
    <div className="h-7 w-28 animate-pulse rounded-full bg-gray-200"></div>
);
export default function AuthButtons() {
    const { user, logout, isLoading,isAdmin, isCustomer } = useAuth();
    const [parent] = useAutoAnimate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    console.log(user?.lastOrder?.paymentStatus);
    return (

        <div ref={parent} className="flex h-10 items-center justify-center">
            {isLoading ? (
                <SkeletonAuthButton/>
            ) : user?.lastOrder? (
                <div className="relative ">
                    <div
                        className="relative"
                        onMouseEnter={() => setIsMenuOpen(true)}
                        onMouseLeave={() => setIsMenuOpen(false)}
                    >
                        {/* This is the trigger button that shows the user's name */}
                        <button
                            className="flex items-center gap-x-2 rounded-full bg-slate-100 py-1.5 px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-200 transition-colors"
                        >
                            <User className="h-4 w-4 text-slate-500" />
                            <span className="max-w-[120px] truncate">{user.name}</span>
                            <ChevronDown
                                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                                    isMenuOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {/* The Dropdown Menu */}
                        {isMenuOpen && (
                            <div
                                className=" absolute right-0 top-full z-10 mt-0 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                                <div className="py-1">
                                    {/* Optional: User Info Header */}
                                    <div className="border-b border-slate-200 px-4 py-2">
                                        <p className="text-sm font-semibold text-slate-800 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {user.email} {/* Assuming user.email exists */}
                                        </p>
                                    </div>

                                    {/* Menu Links */}
                                    <div className="py-1">
                                        <Link
                                            href="/account-settings"
                                            className="flex w-full items-center gap-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                        >
                                            <User className="h-4 w-4" />
                                            Account Settings
                                        </Link>
                                        {isCustomer && <Link
                                            href="/orders"
                                            className="flex w-full items-center gap-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                        >
                                            <ShoppingCart className="h-4 w-4"/>
                                            My Orders
                                        </Link>}
                                        {isAdmin && (
                                            <Link
                                                href="/dashboard"
                                                className="flex w-full items-center gap-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                Admin Dashboard
                                            </Link>
                                        )}
                                    </div>

                                    {/* Logout Button */}
                                    <div className="border-t border-slate-200 py-1">
                                        <button
                                            onClick={logout}
                                            className="flex w-full items-center gap-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-900 transition-colors"
                >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                </Link>
            )}
        </div>
    );
}