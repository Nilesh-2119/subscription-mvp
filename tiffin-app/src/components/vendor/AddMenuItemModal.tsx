"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X } from "lucide-react";
import api from "@/lib/api";

const schema = z.object({
    name: z.string().min(2, "Name is required"),
    description: z.string().optional(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price"),
    category: z.string().min(2, "Category is required"),
});

type FormData = z.infer<typeof schema>;

export function AddMenuItemModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            reset();
            setImageFile(null);
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            setIsUploading(true);
            let imageUrl = "";

            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                const uploadRes = await api.post('/uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadRes.data.url;
            }

            await api.post('/vendor/menu', {
                ...data,
                price: parseFloat(data.price),
                imageUrl: imageUrl || undefined,
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to add item", error);
            alert("Failed to add item");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-4">Add Menu Item</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Item Name</label>
                        <Input {...register("name")} placeholder="e.g. Deluxe Veg Thali" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <Input {...register("description")} placeholder="Includes 3 Rotis, Rice, Dal..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                            <Input {...register("price")} placeholder="120" />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select {...register("category")} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                                <option value="Thali">Thali</option>
                                <option value="Mini Meal">Mini Meal</option>
                                <option value="Beverage">Beverage</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Item Image</label>
                        <div className="mt-1 flex items-center gap-4">
                            <div className="relative w-full">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setImageFile(e.target.files[0]);
                                        }
                                    }}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-600 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </div>
                        {imageFile && (
                            <p className="text-xs text-green-600 mt-1">
                                Selected: {imageFile.name}
                            </p>
                        )}
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
                            {isSubmitting || isUploading ? "Adding..." : "Add Item"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
