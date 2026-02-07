"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";

interface WeeklyMenuDay {
    day: string;
    lunch: string;
    dinner: string;
    isVeg: boolean;
}

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export function WeeklyMenuEditor() {
    const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenuDay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchWeeklyMenu();
    }, []);

    const fetchWeeklyMenu = async () => {
        try {
            const res = await api.get('/vendor/weekly-menu');
            // Merge fetched data with default structure
            const merged = DAYS.map(day => {
                const existing = res.data.find((d: any) => d.day === day);
                return existing || { day, lunch: "", dinner: "", isVeg: true };
            });
            setWeeklyMenu(merged);
        } catch (error) {
            console.error("Failed to fetch weekly menu", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (index: number, field: keyof WeeklyMenuDay, value: string | boolean) => {
        const newMenu = [...weeklyMenu];
        newMenu[index] = { ...newMenu[index], [field]: value };
        setWeeklyMenu(newMenu);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.post('/vendor/weekly-menu', { days: weeklyMenu });
            alert("Weekly menu saved successfully!");
        } catch (error) {
            console.error("Failed to save weekly menu", error);
            alert("Failed to save. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="text-center py-10">Loading schedule...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Weekly Meal Plan</h2>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
            </div>

            <div className="grid gap-4">
                {weeklyMenu.map((dayData, index) => (
                    <div key={dayData.day} className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg text-primary">{dayData.day}</h3>
                            <label className="flex items-center cursor-pointer gap-2 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    checked={dayData.isVeg}
                                    onChange={(e) => handleChange(index, 'isVeg', e.target.checked)}
                                    className="accent-green-600 w-4 h-4"
                                />
                                Veg Only
                            </label>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Lunch</label>
                                <Input
                                    value={dayData.lunch}
                                    onChange={(e) => handleChange(index, 'lunch', e.target.value)}
                                    placeholder="e.g. Rice, Dal, Bhindi Fry"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Dinner (Optional)</label>
                                <Input
                                    value={dayData.dinner || ""}
                                    onChange={(e) => handleChange(index, 'dinner', e.target.value)}
                                    placeholder="e.g. Roti, Paneer Masala"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
