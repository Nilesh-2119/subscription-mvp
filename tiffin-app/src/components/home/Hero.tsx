"use client";
import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <div className="bg-primary pt-6 pb-20 px-4 -mt-1 rounded-b-[3rem] shadow-xl relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
                <div className="md:w-1/2">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                        Order tiffin & <br /> daily essentials
                    </h1>
                    <p className="text-orange-50 font-medium text-lg mb-8 opacity-90 max-w-md">
                        Discover best kitchens near you. Fresh, hygienic, and home-cooked.
                    </p>
                </div>

                <div className="relative md:w-1/2 max-w-xl">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for 'Aloo Paratha'..."
                        className="w-full py-5 pl-12 pr-6 rounded-2xl bg-white text-foreground placeholder:text-muted-foreground shadow-2xl shadow-black/10 focus:outline-none focus:ring-4 focus:ring-white/30 text-base font-medium transition-all"
                    />
                </div>
            </motion.div>
        </div>
    );
}
