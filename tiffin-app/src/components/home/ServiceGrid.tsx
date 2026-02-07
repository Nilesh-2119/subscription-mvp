"use client";
import React from "react";
import { Utensils, Milk, Newspaper, ShoppingBasket, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const services = [
    {
        id: "tiffin",
        name: "Tiffin",
        desc: "Home style meals",
        cta: "Check it out",
        icon: Utensils,
        bg: "bg-rose-50",
        text: "text-rose-950",
        iconColor: "text-rose-600",
        hoverBorder: "group-hover:border-rose-200"
    },
    {
        id: "milk",
        name: "Milk",
        desc: "Farm fresh milk",
        cta: "Check it out",
        icon: Milk,
        bg: "bg-sky-50",
        text: "text-sky-950",
        iconColor: "text-sky-600",
        hoverBorder: "group-hover:border-sky-200"
    },
    {
        id: "grocery",
        name: "Grocery",
        desc: "Daily essentials",
        cta: "Check it out",
        icon: ShoppingBasket,
        bg: "bg-emerald-50",
        text: "text-emerald-950",
        iconColor: "text-emerald-600",
        hoverBorder: "group-hover:border-emerald-200"
    },
    {
        id: "paper",
        name: "Papers",
        desc: "Morning news",
        cta: "Check it out",
        icon: Newspaper,
        bg: "bg-violet-50",
        text: "text-violet-950",
        iconColor: "text-violet-600",
        hoverBorder: "group-hover:border-violet-200"
    },
];

export function ServiceGrid() {
    return (
        <div className="px-4 -mt-12 relative z-20 pb-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((service, index) => (
                    <motion.button
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                            "flex flex-col items-start p-6 rounded-3xl border border-transparent shadow-md transition-all duration-300 group text-left min-h-[200px] justify-between",
                            service.bg,
                            service.hoverBorder
                        )}
                    >
                        <div className="w-full">
                            <h3 className={cn("text-2xl font-black tracking-tight mb-2", service.text)}>
                                {service.name}
                            </h3>
                            <p className={cn("text-sm font-medium opacity-70 mb-4", service.text)}>
                                {service.desc}
                            </p>
                        </div>

                        <div className="w-full flex items-end justify-between">
                            <div className={cn("text-xs font-extrabold uppercase tracking-wider flex items-center bg-white/50 px-3 py-2 rounded-full backdrop-blur-sm", service.iconColor)}>
                                {service.cta} <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                            <service.icon className={cn("w-14 h-14 opacity-90 drop-shadow-sm transform group-hover:-rotate-12 transition-transform", service.iconColor)} />
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
