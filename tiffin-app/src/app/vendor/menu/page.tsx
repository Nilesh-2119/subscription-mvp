"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { AddMenuItemModal } from "@/components/vendor/AddMenuItemModal";
import { WeeklyMenuEditor } from "@/components/vendor/WeeklyMenuEditor";
import api from "@/lib/api"; // Assuming api utility is available here

export default function MenuPage() {
    const [activeTab, setActiveTab] = useState<'items' | 'weekly'>('items');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMenu = async () => {
        try {
            const res = await api.get('/vendor/menu');
            setMenuItems(res.data);
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/vendor/menu/${id}`);
            fetchMenu();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Menu Management</h2>
                    <p className="text-gray-500">Manage your offerings and weekly plan.</p>
                </div>
            </div>

            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('items')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'items' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Menu Items
                </button>
                <button
                    onClick={() => setActiveTab('weekly')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'weekly' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Weekly Plan
                </button>
            </div>

            {activeTab === 'items' ? (
                <>
                    <div className="flex justify-end">
                        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                            <Plus className="w-4 h-4" /> Add Item
                        </Button>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-500">Loading menu...</div>
                        ) : menuItems.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No items found. Add one!</div>
                        ) : (
                            menuItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl.startsWith('http') ? item.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${item.imageUrl}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">🥘</div>
                                            )}
                                        </div>
                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate mt-1">{item.description || '-'}</p>
                                            <p className="font-bold text-gray-900 mt-2">₹{item.price}</p>
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                                <tr>
                                    <th className="p-4 pl-6">Item Name</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Image</th>
                                    <th className="p-4 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading menu...</td></tr>
                                ) : menuItems.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">No items found. Add one!</td></tr>
                                ) : (
                                    menuItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 pl-6 font-semibold text-gray-900">{item.name}</td>
                                            <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{item.description}</td>
                                            <td className="p-4 font-bold text-gray-900">₹{item.price}</td>
                                            <td className="p-4">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {item.imageUrl ? (
                                                    <a href={item.imageUrl.startsWith('http') ? item.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${item.imageUrl}`} target="_blank" rel="noreferrer" className="text-blue-500 underline text-xs">View</a>
                                                ) : <span className="text-gray-400 text-xs">-</span>}
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )))
                                }
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <WeeklyMenuEditor />
            )}

            <AddMenuItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchMenu}
            />
        </div>
    );
}
