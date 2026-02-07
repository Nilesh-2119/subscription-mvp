"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Star, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function KitchenList() {
    const [kitchens, setKitchens] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchKitchens = async () => {
            try {
                const res = await api.get('/public/vendors');
                setKitchens(res.data);
            } catch (error) {
                console.error("Failed to fetch kitchens", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchKitchens();
    }, []);

    const colors = ["bg-rose-100", "bg-amber-100", "bg-emerald-100", "bg-blue-100", "bg-purple-100"];

    return (
        <div className="py-2 pb-24 max-w-7xl mx-auto">
            <div className="px-4 flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-secondary">Kitchens Near You</h2>
                <Button variant="ghost" size="sm" className="text-primary font-bold text-sm h-auto py-1 px-3">
                    See All
                </Button>
            </div>

            <div className="flex overflow-x-auto px-4 gap-6 pb-8 snap-x hide-scrollbar">
                {isLoading ? (
                    <div className="w-full text-center py-10 text-gray-500">Loading kitchens...</div>
                ) : kitchens.length === 0 ? (
                    <div className="w-full text-center py-10 text-gray-500">No kitchens found nearby.</div>
                ) : (
                    kitchens.map((kitchen, index) => (
                        <Link href={`/kitchens/${kitchen.id}`} key={kitchen.id} className="min-w-[320px] md:min-w-[380px] snap-center block h-full">
                            <Card className="h-full overflow-hidden border border-border/50 shadow-md hover:shadow-xl transition-shadow duration-300">
                                {/* Placeholder Image */}
                                <div className={cn("h-40 w-full relative", colors[index % colors.length])}>
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                        <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                                        <span className="text-xs font-bold">4.{Math.floor(Math.random() * 5) + 5}</span>
                                    </div>
                                </div>

                                <CardContent>
                                    <h3 className="font-bold text-xl mb-1">{kitchen.businessName}</h3>
                                    <div className="flex items-center gap-3 text-muted-foreground text-xs font-medium mb-3">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 30-45 mins</span>
                                        <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                            {kitchen.menuItems?.length > 0 ? `₹${kitchen.menuItems[0].price}/meal` : 'Contact for Price'}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 mb-4">
                                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md uppercase tracking-wider">
                                            {kitchen.menuItems?.length > 0 ? kitchen.menuItems[0].name : "Home Cooked"}
                                        </span>
                                    </div>

                                    <Button className="w-full font-bold rounded-xl h-10">
                                        View Menu
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    )))}
            </div>
        </div>
    );
}
