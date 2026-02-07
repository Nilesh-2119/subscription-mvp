"use client";
import { VendorRegistrationForm } from "@/components/vendor/VendorRegistrationForm";
import { Header } from "@/components/layout/Header";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Bike, ChevronRight, ArrowLeft } from "lucide-react";

export default function PartnerPage() {
    const [step, setStep] = useState<'select' | 'kitchen' | 'rider'>('select');

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="flex min-h-[calc(100vh-64px)]">
                {/* Left Side - Branding (Hidden on mobile) */}
                <div className="hidden lg:flex w-1/2 bg-[#001E3C] relative items-center justify-center p-12 text-white overflow-hidden">
                    {/* Decorative Background Circles */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

                    <div className="relative z-10 max-w-xl">
                        <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl inline-block">
                            <span className="text-orange-400 font-bold tracking-wider uppercase text-sm">For Kitchens & Stores</span>
                        </div>
                        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
                            Grow your business with <span className="text-primary">Tiffin</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                            Join thousands of kitchens, grocery stores, and milk vendors delivering happiness to customers daily.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-4xl font-bold mb-1">1000+</h3>
                                <p className="text-gray-400 text-sm">Happy Vendors</p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold mb-1">50k+</h3>
                                <p className="text-gray-400 text-sm">Daily Orders</p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold mb-1">₹0</h3>
                                <p className="text-gray-400 text-sm">Listing Fee</p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold mb-1">24/7</h3>
                                <p className="text-gray-400 text-sm">Support</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form/Selection */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                    <AnimatePresence mode="wait">
                        {step === 'select' && (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full max-w-md"
                            >
                                <h2 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">Join as a Partner</h2>
                                <div className="grid gap-4">
                                    <button
                                        onClick={() => setStep('kitchen')}
                                        className="flex items-center p-6 bg-white border-2 border-orange-100 rounded-3xl hover:border-orange-500 hover:shadow-xl transition-all group text-left"
                                    >
                                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                                            <Store className="w-8 h-8 text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Kitchen / Store</h3>
                                            <p className="text-sm text-gray-500 font-medium">Sell tiffins, groceries & essentials</p>
                                        </div>
                                        <ChevronRight className="ml-auto w-6 h-6 text-gray-300 group-hover:text-orange-500" />
                                    </button>

                                    <button
                                        onClick={() => setStep('rider')}
                                        className="flex items-center p-6 bg-white border-2 border-blue-100 rounded-3xl hover:border-blue-500 hover:shadow-xl transition-all group text-left"
                                    >
                                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                                            <Bike className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Delivery Partner</h3>
                                            <p className="text-sm text-gray-500 font-medium">Deliver orders & earn safely</p>
                                        </div>
                                        <ChevronRight className="ml-auto w-6 h-6 text-gray-300 group-hover:text-blue-500" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'kitchen' && (
                            <motion.div
                                key="kitchen-form"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="w-full"
                            >
                                <button
                                    onClick={() => setStep('select')}
                                    className="flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 mb-6 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to selection
                                </button>
                                <VendorRegistrationForm />
                            </motion.div>
                        )}

                        {step === 'rider' && (
                            <motion.div
                                key="rider-form"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="w-full text-center"
                            >
                                <button
                                    onClick={() => setStep('select')}
                                    className="flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 mb-6 transition-colors" // Added Back button here too
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to selection
                                </button>

                                <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 inline-block">
                                    <Bike className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-blue-900 mb-2">Rider Registration</h3>
                                    <p className="text-blue-700">Coming soon! We are currently onboarding kitchens only.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
