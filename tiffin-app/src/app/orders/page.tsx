"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuthStore } from '@/store/authStore';
import { Clock, MapPin, CheckCircle, Package, ChefHat, CalendarCheck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

type OrderType = 'SUBSCRIPTION' | 'TRIAL';

export default function CustomerOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<OrderType>('SUBSCRIPTION');
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/customer');
                setOrders(res.data || []);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'ACCEPTED': return 'bg-blue-100 text-blue-700';
            case 'PREPARING': return 'bg-orange-100 text-orange-700';
            case 'DELIVERED': return 'bg-green-100 text-green-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-4 h-4" />;
            case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />;
            case 'PREPARING': return <ChefHat className="w-4 h-4" />;
            case 'DELIVERED': return <Package className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    // Filter orders based on active tab
    const filteredOrders = orders.filter(order => order.type === activeTab);

    const subscriptionCount = orders.filter(o => o.type === 'SUBSCRIPTION').length;
    const trialCount = orders.filter(o => o.type === 'TRIAL').length;

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <Package className="w-10 h-10 text-orange-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Login to view orders</h2>
                    <p className="text-gray-500 text-center mb-6">Sign in to see your order history and track deliveries</p>
                    <Link
                        href="/login"
                        className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />
            <div className="max-w-2xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h1>

                {/* Order Type Tabs */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setActiveTab('SUBSCRIPTION')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'SUBSCRIPTION'
                            ? 'bg-purple-500 text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <CalendarCheck className="w-5 h-5" />
                        Subscriptions
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'SUBSCRIPTION' ? 'bg-purple-400' : 'bg-gray-100'
                            }`}>
                            {subscriptionCount}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('TRIAL')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'TRIAL'
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Trial Orders
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'TRIAL' ? 'bg-green-400' : 'bg-gray-100'
                            }`}>
                            {trialCount}
                        </span>
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-500">Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {activeTab === 'SUBSCRIPTION' ? (
                                <CalendarCheck className="w-10 h-10 text-gray-400" />
                            ) : (
                                <ShoppingBag className="w-10 h-10 text-gray-400" />
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {activeTab === 'SUBSCRIPTION'
                                ? 'No subscriptions yet'
                                : 'No trial orders yet'}
                        </h2>
                        <p className="text-gray-500 mb-6">
                            {activeTab === 'SUBSCRIPTION'
                                ? 'Subscribe to a kitchen for daily tiffin delivery'
                                : 'Start ordering delicious tiffins from nearby kitchens'}
                        </p>
                        <Link
                            href="/kitchens"
                            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                        >
                            Browse Kitchens
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const deliveryAddress = order.items?.deliveryAddress;
                            const menuItems = order.items?.menuItems || [];
                            const mealType = order.items?.mealType || 'N/A';

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                                >
                                    {/* Order Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${order.type === 'SUBSCRIPTION'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {order.type === 'SUBSCRIPTION' ? '📅 Subscription' : '🛒 Trial'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            <p className="font-bold text-gray-900">
                                                {order.vendor?.businessName || order.vendor?.kitchenName || 'Kitchen'}
                                            </p>
                                        </div>
                                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="bg-gray-50 p-3 rounded-xl mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Items</span>
                                            <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded font-medium">
                                                {mealType}
                                            </span>
                                        </div>
                                        {menuItems.length > 0 ? (
                                            <div className="text-sm text-gray-700">
                                                {menuItems.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between py-0.5">
                                                        <span>{item.name} {item.quantity > 1 && `× ${item.quantity}`}</span>
                                                        <span className="font-medium">₹{item.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {order.type === 'SUBSCRIPTION' ? 'Monthly Meal Plan' : 'Trial Meal'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Delivery Address */}
                                    {deliveryAddress && (
                                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-1">
                                                {deliveryAddress.address}, {deliveryAddress.city}
                                            </span>
                                        </div>
                                    )}

                                    {/* Order Total */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <span className="text-sm text-gray-500">
                                            {order.type === 'SUBSCRIPTION' ? 'Monthly Plan' : 'One-time Order'}
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
