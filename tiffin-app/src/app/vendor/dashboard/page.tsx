"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Users, ShoppingBag, IndianRupee, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function VendorDashboardPage() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({
        totalSubscribers: 0,
        activeOrders: 0,
        totalMenuItems: 0,
        growth: '8.5%'
    });
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch menu items
                const menuRes = await api.get('/vendor/menu');
                setMenuItems(menuRes.data || []);
                setStats(prev => ({ ...prev, totalMenuItems: menuRes.data?.length || 0 }));

                // Fetch orders count
                try {
                    const ordersRes = await api.get('/orders/vendor');
                    setStats(prev => ({ ...prev, activeOrders: ordersRes.data?.length || 0 }));
                } catch (e) {
                    console.log('Orders not available');
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        { label: 'Total Subscribers', value: stats.totalSubscribers, icon: Users, change: '+12%', changeColor: 'text-green-600' },
        { label: 'Active Orders', value: stats.activeOrders, icon: ShoppingBag, change: '+5%', changeColor: 'text-green-600' },
        { label: 'Total Menu Items', value: stats.totalMenuItems, icon: IndianRupee, badge: 'Items', badgeColor: 'bg-purple-100 text-purple-700' },
        { label: 'Growth', value: stats.growth, icon: TrendingUp, change: '+2%', changeColor: 'text-green-600' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <Link href="/vendor/orders">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6">
                        Manage Orders
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-blue-50' :
                                        index === 1 ? 'bg-orange-50' :
                                            index === 2 ? 'bg-purple-50' : 'bg-green-50'
                                    }`}>
                                    <Icon className={`w-6 h-6 ${index === 0 ? 'text-blue-600' :
                                            index === 1 ? 'text-orange-600' :
                                                index === 2 ? 'text-purple-600' : 'text-green-600'
                                        }`} />
                                </div>
                                {stat.change && (
                                    <span className={`text-sm font-bold ${stat.changeColor}`}>{stat.change}</span>
                                )}
                                {stat.badge && (
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.badgeColor}`}>{stat.badge}</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Subscribers */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Subscribers</h2>
                    <div className="text-center py-8 text-gray-400">
                        No subscribers yet.
                    </div>
                </div>

                {/* Popular Menu Items */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Menu Items</h2>
                    {menuItems.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            No menu items yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {menuItems.slice(0, 3).map((item: any, index: number) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                            {item.name?.charAt(0) || 'M'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">₹{item.price}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-green-600">In Stock</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
