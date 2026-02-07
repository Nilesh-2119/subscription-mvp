"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Clock, MapPin, Phone, Bell, User, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const previousOrderCountRef = useRef(0);

    // Check if there are any pending orders
    const hasPendingOrders = orders.some(order => order.status === 'PENDING');

    // Initialize audio for notification
    useEffect(() => {
        // Create audio element for notification sound - using a longer, more noticeable sound
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleVgHNpzj4JqXdl5djK7DuZl1UDtPcZ6yuo18WTM1Wp2xwLSSalY2NkZ0sNDNxbCSemc3NjVJcLLPzrqhfV5MOTFDcrHHxKeJXDQfLFGCpcK3mn9eLyQpTHqbsa+RcU0yKi9JcpqwrYpnSDMsN0hxm6ywjGxKNSgxQW2crq2LbEw0Jy9BaqGvq4lvTDElND9np66ni3FPNScwPWils6qKck4xKjI7YqSyp4h0TzAnNThfoLGniHRRMSg2Nl2ftaWGdFEuJTYzW6G0ooRzUC0nODJZo7GghXNPLCU2MFmjsp+CcU4rJTcuV6SynYJxTismNixWprOdgW9NKSc3K1SmspuAbk0nKDksU6WxmoBuTCUqOSpRpbGZf2xLJCw5KFGmsJeAbEolLTknUKewln9qSSQvOCZQp6+VfmlIIzE3JVCnrpN+aUchMzYkT6iulH1pRiE0NSNOqa2SfGdGIDY0IU+prY99ZkQfODMfUKqsjn1lQx45MR1PqqyNfGVCHjswG0+rq4x8ZEEdPDAbTqusintjQBs/LxpNrKuKemI/GkEtGU2sqol5Yj4ZQysXTaypiHhhPRdFKhZMrKmHeGE8F0YpFEyrqIZ4YDsWSSgTTKunh3hgOhVLJxFMq6eFdl84FE4mEEyqpoR2XzgTUCQPTKqmg3VeNxJSIw5MqqWCdF02EVQiDEyqpIF0XDQQVSEKA0upoz9zWzIPViEKQ6mjPXJaMQ5XIwhDqaI8cVkxDlgiBkOoojpxWDANWSEFQqihOHBXLwxaIANCpqE3b1YuC1sfAkKmoTZuVC0LXR4AQqWgNW5TLApdHQBBpZ80bVIsCV0cAEGknzRtUisJXRsAQaSeM2xSKghdGwBApJ4ybFEpB10aAECknjJsUSgHXRkAQKOdMmtRKAddGQA/o50ya1AoB10YAD+jnDFqTycHXRgAP6KbMGpPJwddFwA/opswak8mBl0XAD+imjBpTiYGXBcAPqGaMGlOJQZcFgA+oZkvaU4lBlsWAD6hmS9pTSQGWxUAPaCZL2hNJAZaFAA9oJgvaE0jBlkUAD2gmC5nTCMGWRQAPJ+YLmdMIgZZEwA8n5ctZkwhBVgTADyely1mTCEFWBIAO56XLGZLIAVXEgA7npYsZUsgBVcRADudlixlSx8FVhEAO52WK2VKHwVWEAA7nJUrZEofBFUQADqclStjSR4EVA8AOZyUKmNJHgRUDwA5m5QqY0keBFMPADmblCpjSB0EUw4AOJuTKWJIHQRSDgA4mpMpYkcbBFEOADiakilhRxsEUQ0ANpqRKGFHGgRQDQA2mZAoYEYaBE8NADaZkChgRhkETg0ANZiPJ19FGARNDAAxmI8nX0UYBE0LADGYjydfRRgETQsAMJiPJl9EFwRMCgAwl48mXkQXBEwKAC+XjiZeQxcESwkAL5aNJl1DFgRKCQAulo0mXUMVBEoIAC2WjCVcQxUESQgALZWMJVxCFQRJBwAtlYslXEIUBEgHAC2ViyVcQRQESAYALJWKJVtBFARHBgAslYolW0ETBEcFACuUiSVbQBMERgUAK5SJJFpAEwRGBAAqlIkkWj8SBEUEACqTiCRaPxIERQMAKZOIJFk/EgREAwApk4ckWT4RBEQCACiThyRZPhEEQwIAKJKHI1g+EARDAgAnkoYjWD0QBEIBACeShiNYPRAEQgEAJpGFI1c9DwRBAQAmkYUjVzwPBEEAAJZBFAQ=');
        audioRef.current.volume = 0.7;

        return () => {
            if (soundIntervalRef.current) {
                clearInterval(soundIntervalRef.current);
            }
        };
    }, []);

    // Play sound continuously while there are pending orders
    useEffect(() => {
        if (hasPendingOrders) {
            // Play immediately
            playNotificationSound();

            // Then play every 3 seconds while there are pending orders
            soundIntervalRef.current = setInterval(() => {
                playNotificationSound();
            }, 3000);
        } else {
            // Stop playing when no pending orders
            if (soundIntervalRef.current) {
                clearInterval(soundIntervalRef.current);
                soundIntervalRef.current = null;
            }
        }

        return () => {
            if (soundIntervalRef.current) {
                clearInterval(soundIntervalRef.current);
            }
        };
    }, [hasPendingOrders]);

    const playNotificationSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
    }, []);

    const fetchOrders = useCallback(async (isInitialLoad = false) => {
        try {
            const res = await api.get('/orders/vendor');
            const newOrders = res.data;
            previousOrderCountRef.current = newOrders.length;
            setOrders(newOrders);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(true);

        // Poll for new orders every 10 seconds
        const interval = setInterval(() => fetchOrders(false), 10000);

        return () => clearInterval(interval);
    }, []);

    const handleAcceptOrder = async (orderId: string) => {
        setAcceptingOrderId(orderId);
        try {
            await api.patch(`/orders/${orderId}/accept`);
            // Update local state
            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status: 'ACCEPTED' } : order
            ));
        } catch (error) {
            console.error('Failed to accept order:', error);
            alert('Failed to accept order. Please try again.');
        } finally {
            setAcceptingOrderId(null);
        }
    };

    const getDeliveryAddress = (items: any) => {
        if (items?.deliveryAddress) return items.deliveryAddress;
        return null;
    };

    const getMealType = (items: any) => {
        return items?.mealType || 'N/A';
    };

    const getMenuItems = (items: any) => {
        if (items?.menuItems) return items.menuItems;
        if (Array.isArray(items)) return items;
        return [];
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* <Header /> */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
                        {hasPendingOrders && (
                            <div className="flex items-center gap-2 mt-2 text-orange-600 animate-pulse">
                                <Volume2 className="w-4 h-4" />
                                <span className="text-sm font-medium">New order waiting - Accept to stop sound</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Bell className="w-4 h-4" />
                        Auto-refreshing every 10s
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📦</div>
                        <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
                        <p className="text-gray-500 mt-2">Orders will appear here when customers book.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {orders.map((order) => {
                                const deliveryAddress = getDeliveryAddress(order.items);
                                const menuItems = getMenuItems(order.items);
                                const mealType = getMealType(order.items);
                                const isPending = order.status === 'PENDING';

                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className={`bg-white p-6 rounded-2xl border-2 shadow-sm transition-all ${isPending
                                            ? 'border-orange-400 ring-2 ring-orange-100 animate-pulse'
                                            : 'border-gray-100'
                                            }`}
                                    >
                                        {/* Header with customer name and status */}
                                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                                    {deliveryAddress?.fullName?.charAt(0) || order.customer?.user?.fullName?.charAt(0) || 'C'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-gray-900 text-lg">
                                                            {deliveryAddress?.fullName || order.customer?.user?.fullName || 'Customer'}
                                                        </h3>
                                                        {isPending && (
                                                            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full animate-bounce">
                                                                PENDING
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                    ${order.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                        order.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                                            'bg-gray-100 text-gray-600'}`}>
                                                    {order.status}
                                                </span>
                                                <p className="text-lg font-bold text-gray-900 mt-1">₹{order.totalAmount}</p>
                                                <p className="text-xs text-gray-500">{order.type === 'SUBSCRIPTION' ? 'Monthly Plan' : 'Trial Meal'}</p>
                                            </div>
                                        </div>

                                        {/* Customer Contact & Delivery Info */}
                                        {deliveryAddress && (
                                            <div className="bg-blue-50 p-4 rounded-xl mb-4">
                                                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                                                    <User className="w-3 h-3" /> Customer Details
                                                </h4>
                                                <div className="grid md:grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <Phone className="w-4 h-4 text-blue-600 mt-0.5" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{deliveryAddress.phone}</p>
                                                            <p className="text-xs text-gray-500">Contact Number</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {deliveryAddress.address}
                                                                {deliveryAddress.landmark && `, ${deliveryAddress.landmark}`}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {deliveryAddress.city} - {deliveryAddress.pincode} ({deliveryAddress.type || 'Home'})
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {deliveryAddress.instructions && (
                                                    <p className="mt-2 text-sm text-gray-600 bg-white p-2 rounded">
                                                        <span className="font-medium">Instructions:</span> {deliveryAddress.instructions}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Order Items */}
                                        <div className="bg-gray-50 p-4 rounded-xl mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Items</h4>
                                                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                                                    {mealType}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-700 font-medium">
                                                {menuItems.length > 0 ? (
                                                    menuItems.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between py-1">
                                                            <span>{item.name} {item.quantity > 1 && `× ${item.quantity}`}</span>
                                                            <span>₹{item.price}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500">Items data unavailable</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Accept Button - Only show for pending orders */}
                                        {isPending && (
                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={() => handleAcceptOrder(order.id)}
                                                    disabled={acceptingOrderId === order.id}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-bold"
                                                >
                                                    {acceptingOrderId === order.id ? (
                                                        'Accepting...'
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-5 h-5 mr-2" /> Accept Order
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        )}

                                        {/* Accepted status indicator */}
                                        {order.status === 'ACCEPTED' && (
                                            <div className="flex justify-end">
                                                <span className="flex items-center gap-2 text-green-600 font-medium">
                                                    <CheckCircle className="w-5 h-5" /> Order Accepted
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
