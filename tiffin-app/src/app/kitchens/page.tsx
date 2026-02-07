"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MapPin, Star, Clock, ChefHat, Utensils } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Kitchen {
    id: string;
    businessName: string;
    kitchenName?: string;
    description?: string;
    address?: string;
    city?: string;
    isVeg?: boolean;
    rating?: number;
    deliveryTime?: string;
    profileImage?: string;
    user?: {
        fullName: string;
        email: string;
    };
}

export default function KitchensPage() {
    const [kitchens, setKitchens] = useState<Kitchen[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchKitchens = async () => {
            try {
                const res = await api.get('/public/vendors');
                console.log('Kitchens data:', res.data);
                setKitchens(res.data || []);
            } catch (error) {
                console.error('Failed to fetch kitchens:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchKitchens();
    }, []);

    // Get kitchen display name - use businessName or kitchenName or user's fullName
    const getKitchenName = (kitchen: Kitchen) => {
        return kitchen.businessName || kitchen.kitchenName || kitchen.user?.fullName || 'Kitchen';
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 px-4 py-8 text-white">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-extrabold mb-2">Nearby Kitchens 🍽️</h1>
                    <p className="text-orange-100 text-lg">Fresh, homemade tiffins delivered to your doorstep</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Kitchen Count */}
                {!isLoading && kitchens.length > 0 && (
                    <p className="text-sm text-gray-500 mb-4 font-medium">
                        {kitchens.length} kitchen{kitchens.length > 1 ? 's' : ''} available near you
                    </p>
                )}

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Finding kitchens near you...</p>
                    </div>
                ) : kitchens.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ChefHat className="w-12 h-12 text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No kitchens available</h2>
                        <p className="text-gray-500">We're expanding soon to your area!</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {kitchens.map((kitchen) => (
                            <Link
                                key={kitchen.id}
                                href={`/kitchens/${kitchen.id}`}
                                className="block bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Kitchen Image */}
                                <div className="relative h-44 bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50">
                                    {kitchen.profileImage ? (
                                        <Image
                                            src={kitchen.profileImage}
                                            alt={getKitchenName(kitchen)}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                <Utensils className="w-10 h-10 text-orange-400" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Veg Badge - Top Left */}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${kitchen.isVeg !== false
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                            }`}>
                                            {kitchen.isVeg !== false ? '🌱 Pure Veg' : '🍖 Non-Veg'}
                                        </span>
                                    </div>

                                    {/* Rating - Top Right */}
                                    <div className="absolute top-4 right-4">
                                        <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-sm">
                                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                                            <span className="text-sm font-bold text-gray-900">
                                                {kitchen.rating || '4.5'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Kitchen Name Overlay - Bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 pt-12">
                                        <h3 className="font-extrabold text-xl text-white drop-shadow-lg">
                                            {getKitchenName(kitchen)}
                                        </h3>
                                    </div>
                                </div>

                                {/* Kitchen Details */}
                                <div className="p-4">
                                    <p className="text-gray-600 line-clamp-2 mb-4 text-sm">
                                        {kitchen.description || 'Delicious homemade meals prepared with love and fresh ingredients'}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="text-sm font-medium line-clamp-1">
                                                {kitchen.city || kitchen.address || 'Nearby'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm font-bold">
                                                {kitchen.deliveryTime || '30-45 min'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
