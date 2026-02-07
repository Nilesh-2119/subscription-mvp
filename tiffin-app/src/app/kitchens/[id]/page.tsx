"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Star, Clock, MapPin, IndianRupee, CheckCircle2, X } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Simple Veg/Non-Veg Icon Component
const VegIcon = ({ isVeg }: { isVeg?: boolean }) => (
    <div className={cn("w-4 h-4 border flex items-center justify-center p-0.5 rounded-sm", isVeg ? "border-green-600" : "border-red-600")}>
        <div className={cn("w-full h-full rounded-full", isVeg ? "bg-green-600" : "bg-red-600")} />
    </div>
);

export default function KitchenDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [kitchen, setKitchen] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<'TRIAL' | 'SUBSCRIPTION'>('TRIAL');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);


    useEffect(() => {
        const fetchKitchen = async () => {
            try {
                const res = await api.get(`/public/vendors/${params.id}`);
                setKitchen(res.data);
            } catch (error) {
                console.error("Failed to fetch kitchen", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (params.id) fetchKitchen();
    }, [params.id]);



    if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    if (!kitchen) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Kitchen not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />

            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-32 h-32 rounded-2xl bg-orange-100 flex items-center justify-center text-4xl font-bold text-orange-600">
                            {kitchen.businessName.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{kitchen.businessName}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                                <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg font-bold">
                                    <Star className="w-4 h-4 fill-green-700" /> 4.5
                                </span>
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {kitchen.address || "Hinjewadi, Pune"}</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Delivery by 1:00 PM</span>
                            </div>
                            <p className="text-gray-500 max-w-2xl">
                                Authentic home-cooked meals prepared with love and hygiene. We specialize in North Indian and Maharashtrian thalis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Menu List Column - Full Width Now */}
                <div className="col-span-full">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended ({kitchen.menuItems.length})</h2>
                    <div className="space-y-6">
                        {kitchen.menuItems.map((item: any) => (
                            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start group">
                                <div className="flex-1 pr-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <VegIcon isVeg={true} /> {/* Assuming Veg for MVP, can be dynamic */}
                                        {item.isBestSeller && <span className="text-[10px] font-bold text-orange-500">⭐ BESTSELLER</span>}
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                                    <p className="font-bold text-gray-900 mt-1">₹{item.price}</p>
                                    <div className="flex items-center gap-1 mt-1 mb-2">
                                        <Star className="w-3 h-3 fill-green-600 text-green-600" />
                                        <span className="text-xs font-bold text-green-600">4.6</span>
                                        <span className="text-xs text-gray-400">(150+)</span>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{item.description || "Deep fried savoury snack, made from urad dal and other spices."}</p>
                                </div>
                                <div className="relative w-36 h-32 flex-shrink-0">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl.startsWith('http') ? item.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${item.imageUrl}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover rounded-xl shadow-sm"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/150x150?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-3xl">🥘</div>
                                    )}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%]">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedItem(item);
                                            }}
                                            className="w-full bg-white text-green-600 font-bold py-2 rounded-lg shadow-md border border-gray-200 text-sm hover:shadow-lg hover:bg-green-50 transition-all uppercase"
                                        >
                                            ADD
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Menu Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="bg-black text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
                >
                    <span className="text-xs tracking-widest uppercase">MENU</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Weekly Plan</span>
                </button>
            </div>

            {/* Weekly Menu Modal/Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: "0%" }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto p-6 md:max-w-2xl md:mx-auto md:rounded-3xl md:bottom-6 md:h-auto shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Weekly Schedule</h2>
                                    <p className="text-gray-500 text-sm">Day-wise meal plan</p>
                                </div>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {kitchen.weeklyMenus?.length > 0 ? (
                                    kitchen.weeklyMenus.map((day: any) => (
                                        <div key={day.day} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-4">
                                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-lg font-bold shadow-sm text-gray-400">
                                                {day.day.substring(0, 3)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-gray-800">{day.day}</h3>
                                                    {day.isVeg && <span className="text-[10px] font-bold text-green-600 bg-white px-2 py-0.5 rounded border border-green-100">VEG</span>}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <p><span className="font-medium text-gray-900">Ln:</span> {day.lunch || "-"}</p>
                                                    {day.dinner && <p><span className="font-medium text-gray-900">Dn:</span> {day.dinner}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-gray-400">
                                        No weekly schedule uploaded by this kitchen yet.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Plan Selection Drawer (Replaces 'Choose a Plan' column) */}
            <AnimatePresence>
                {selectedItem && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: "0%" }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 md:max-w-2xl md:mx-auto md:rounded-3xl md:bottom-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0">
                                        {selectedItem.imageUrl ? (
                                            <img src={selectedItem.imageUrl.startsWith('http') ? selectedItem.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${selectedItem.imageUrl}`} alt={selectedItem.name} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">🥘</div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{selectedItem.name}</h2>
                                        <p className="text-xs text-gray-500">{selectedPlan === 'TRIAL' ? 'Trial Meal' : 'Monthly Plan'}</p>
                                        <p className="font-bold text-orange-600 mt-1">₹{selectedPlan === 'TRIAL' ? selectedItem.price : Math.round(Number(selectedItem.price) * 26 * 0.85)}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedItem(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <>
                                <h3 className="font-bold text-gray-900 mb-4">Select Subscription Plan</h3>

                                <div className="space-y-3 mb-6">
                                    <div
                                        className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center", selectedPlan === 'TRIAL' ? "border-orange-500 bg-orange-50" : "border-gray-100 hover:border-orange-200")}
                                        onClick={() => setSelectedPlan('TRIAL')}
                                    >
                                        <div>
                                            <div className="font-bold text-gray-900">Trial Meal</div>
                                            <div className="text-xs text-gray-500 mt-0.5">One-time delivery</div>
                                        </div>
                                        <div className="font-bold text-gray-900">₹{selectedItem.price}</div>
                                    </div>

                                    <div
                                        className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center", selectedPlan === 'SUBSCRIPTION' ? "border-orange-500 bg-orange-50" : "border-gray-100 hover:border-orange-200")}
                                        onClick={() => setSelectedPlan('SUBSCRIPTION')}
                                    >
                                        <div>
                                            <div className="font-bold text-gray-900">Monthly Plan</div>
                                            <div className="text-xs text-gray-500 mt-0.5">Daily lunch for 26 days (Best Value)</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">₹{Math.round(Number(selectedItem.price) * 26 * 0.85)}</div>
                                            <div className="text-[10px] text-green-600 font-bold">SAVE 15%</div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => {
                                        if (!user) {
                                            router.push('/login');
                                            return;
                                        }
                                        const itemParam = encodeURIComponent(JSON.stringify(selectedItem));
                                        router.push(`/checkout?item=${itemParam}&plan=${selectedPlan}&vendorId=${kitchen.id}`);
                                    }}
                                    className="w-full h-14 text-lg font-bold rounded-xl shadow-orange-200 shadow-lg flex justify-between items-center px-6"
                                >
                                    <span>₹{selectedPlan === 'TRIAL' ? selectedItem.price : Math.round(Number(selectedItem.price) * 26 * 0.85)}</span>
                                    <span className="text-sm font-normal opacity-80">Proceed to Buy &rarr;</span>
                                </Button>
                            </>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
