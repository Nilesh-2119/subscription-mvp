"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ClipboardList,
    UtensilsCrossed,
    Users,
    Settings,
    LogOut,
    Menu as MenuIcon,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { href: "/vendor/orders", label: "Orders", icon: ClipboardList },
        // { href: "/vendor/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/vendor/menu", label: "Menu Management", icon: UtensilsCrossed },
        { href: "/vendor/subscribers", label: "Subscribers", icon: Users },
        { href: "/vendor/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
                <div className="p-6">
                    <h1 className="text-2xl font-extrabold text-orange-600 tracking-tight">Tiffin<span className="text-gray-900">Partner</span></h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                                    isActive
                                        ? "bg-orange-50 text-orange-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-orange-600" : "text-gray-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-20">
                    <span className="font-bold text-lg">Dashboard</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                        <MenuIcon className="w-6 h-6" />
                    </Button>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="fixed inset-y-0 left-0 w-64 bg-white p-4 shadow-xl">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-bold text-xl">Menu</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>
                            <nav className="space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                                            pathname === item.href
                                                ? "bg-orange-50 text-orange-700"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
