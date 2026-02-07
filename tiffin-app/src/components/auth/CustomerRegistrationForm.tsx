"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const formSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function CustomerRegistrationForm() {
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            console.log("Submitting customer registration:", data);

            // Register with backend
            const response = await api.post('/auth/register', {
                email: data.email,
                password: data.password,
                fullName: data.fullName,
                phone: data.phone,
                role: 'CUSTOMER',
            });

            console.log("Registration successful:", response.data);

            // Auto-login
            const { access_token, user } = response.data;
            login(access_token, user);

            // Show success animation
            setIsSuccess(true);

            // Redirect after delay
            setTimeout(() => {
                router.push("/");
            }, 2000);

        } catch (error: any) {
            console.error("Registration failed:", error);
            alert(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-green-50 rounded-3xl border border-green-100"
            >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Welcome to Tiffin Code!</h3>
                <p className="text-green-700 mb-6">
                    Your account has been created. Redirecting you to home...
                </p>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Create Account</h2>
            <p className="text-gray-500 mb-8">Sign up to order delicious home-cooked meals.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                    <Input
                        {...register("fullName")}
                        placeholder="John Doe"
                        className={cn(errors.fullName && "border-red-500")}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 ml-1">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500 text-sm font-medium">+91</span>
                        <Input
                            {...register("phone")}
                            placeholder="9876543210"
                            className={cn("pl-10", errors.phone && "border-red-500")}
                        />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                    <Input
                        {...register("email")}
                        type="email"
                        placeholder="john@example.com"
                        className={cn(errors.email && "border-red-500")}
                    />
                    {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                    <Input
                        {...register("password")}
                        type="password"
                        placeholder="********"
                        className={cn(errors.password && "border-red-500")}
                    />
                    {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                </Button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
                Already have an account? <a href="/login" className="text-primary font-bold hover:underline">Sign In</a>
            </p>
        </div>
    );
}
