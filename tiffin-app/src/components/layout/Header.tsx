"use client";
import React, { useState } from "react";
import { MapPin, User, ChevronDown, Menu, X, Store, Briefcase, Download, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuthStore(); // Use global auth store

    return (
        <>
            <header className="sticky top-0 z-50 bg-primary border-0 pt-2 pb-1 text-white">
                <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto">
                    <div className="flex flex-col">
                        <div className="flex items-center text-white font-bold text-lg">
                            <MapPin className="w-5 h-5 mr-1" />
                            <span className="uppercase tracking-wide text-xs font-extrabold flex items-center">
                                Home <ChevronDown className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                        <p className="text-xs text-orange-50 truncate max-w-[200px] md:max-w-md pl-6 font-medium opacity-90">
                            Hinjewadi Phase 1, Pune, Maharashtra...
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8 mr-4">
                            {!user && (
                                <>
                                    <a href="#" className="font-bold text-white text-sm hover:opacity-90 transition-opacity">
                                        Tiffin Corporate
                                    </a>
                                    <Link href="/partner-with-us" className="font-bold text-white text-sm hover:opacity-90 transition-opacity">
                                        Partner with us
                                    </Link>
                                </>
                            )}
                            <Button
                                variant="outline"
                                className="rounded-2xl bg-transparent text-white border-white hover:bg-white/10 hover:text-white hover:border-white h-12 px-6 font-extrabold text-sm"
                            >
                                Get the App <ChevronDown className="ml-1 w-4 h-4 -rotate-90" />
                            </Button>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    {user.role === 'VENDOR' && (
                                        <Link href="/vendor/dashboard" className="font-bold text-white text-sm hover:underline">
                                            Dashboard
                                        </Link>
                                    )}
                                    <div className="flex items-center gap-3 bg-white/10 rounded-full pl-1 pr-4 py-1 hover:bg-white/20 transition-colors cursor-pointer group relative">
                                        <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm">
                                            {user.fullName.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-white leading-tight">{user.fullName}</p>
                                            <p className="text-[10px] text-white/70 font-medium leading-tight capitalize">{user.role.toLowerCase()}</p>
                                        </div>

                                        {/* Simple Dropdown for Logout */}
                                        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                            <button
                                                onClick={logout}
                                                className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href="/login" className="font-bold text-white text-sm hover:opacity-80">
                                        Sign in
                                    </Link>
                                    <Link href="/signup">
                                        <Button
                                            className="rounded-2xl bg-black text-white hover:bg-neutral-900 h-10 px-6 font-extrabold text-sm border-0 shadow-lg"
                                        >
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Icon */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden rounded-full text-white hover:bg-white/10 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl p-6 flex flex-col lg:hidden overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-extrabold text-gray-900">Menu</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-6 h-6 text-gray-400" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {!user && (
                                    <>
                                        <Link
                                            href="/partner-with-us"
                                            className="flex items-center p-4 bg-orange-50 rounded-2xl group"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors">
                                                <Store className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900">Partner with us</h3>
                                                <p className="text-xs text-muted-foreground">For Kitchens & Delivery Partners</p>
                                            </div>
                                        </Link>

                                        <a href="#" className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                            <Briefcase className="w-5 h-5 text-gray-400 mr-4" />
                                            <span className="font-bold text-gray-700">Tiffin Corporate</span>
                                        </a>
                                        <div className="h-px bg-gray-100 my-2" />
                                    </>
                                )}

                                <div className="space-y-4">
                                    <Button
                                        className="w-full justify-start h-12 text-base font-bold bg-gray-900 text-white hover:bg-black"
                                    >
                                        <LogIn className="w-5 h-5 mr-3" /> Sign In
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start h-12 text-base font-bold border-gray-200"
                                    >
                                        <Download className="w-5 h-5 mr-3" /> Get the App
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-auto pt-8">
                                <p className="text-xs text-center text-gray-400 font-medium">
                                    Version 1.0.0
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
