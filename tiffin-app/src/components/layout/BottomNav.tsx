"use client";
import React from "react";
import { Home, UtensilsCrossed, Receipt, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: UtensilsCrossed, label: "Kitchens", href: "/kitchens" },
        { icon: Receipt, label: "Orders", href: "/orders" },
        { icon: User, label: "Profile", href: "/profile" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 pb-safe lg:hidden">
            <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center space-y-1 w-full h-full"
                        >
                            <Icon
                                className={cn(
                                    "w-6 h-6 transition-colors",
                                    isActive ? "text-primary fill-current" : "text-muted-foreground"
                                )}
                            />
                            <span
                                className={cn(
                                    "text-[10px] font-bold uppercase transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
