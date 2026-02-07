"use client";
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const res = await api.get('/vendor/subscribers');
                setSubscribers(res.data);
            } catch (error) {
                console.error("Failed to fetch subscribers", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubscribers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Subscribers</h2>
                    <p className="text-gray-500">View and manage your active subscriptions.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search subscribers..." className="pl-10 w-64 bg-white" />
                    </div>
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                        <tr>
                            <th className="p-4 pl-6">Customer</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4 text-right pr-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading subscribers...</td></tr>
                        ) : subscribers.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No active subscribers yet.</td></tr>
                        ) : (
                            subscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {sub.customer?.user?.fullName?.charAt(0) || 'C'}
                                            </div>
                                            <span className="font-semibold text-gray-900">{sub.customer?.user?.fullName || 'Customer'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{sub.customer?.phone || sub.customer?.user?.email}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                </tr>
                            )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
