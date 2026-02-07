"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.login);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(loginSchema),
    });
    const [error, setError] = useState("");

    const onSubmit = async (data: FormData) => {
        try {
            setError("");
            // Call Backend API
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password
            });

            // Store Token & User
            const { access_token, user } = response.data;
            setAuth(access_token, user);

            // Redirect based on role
            if (user.role === 'VENDOR') {
                router.push('/vendor/orders');
            } else {
                router.push('/');
            }

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed. Please check credentials.");
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
            {/* Left Side: Branding */}
            <div className="hidden lg:flex flex-col justify-center p-12 bg-orange-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-orange-600 mb-2">Tiffin Code</h1>
                        <p className="text-xl text-gray-600">Delicious home-cooked meals, delivered.</p>
                    </div>
                    <blockquote className="text-2xl font-medium text-gray-800 italic border-l-4 border-orange-500 pl-6 py-2">
                        "The easiest way to manage your kitchen and reach thousands of hungry customers."
                    </blockquote>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
                        <p className="mt-2 text-gray-600">
                            Or <Link href="/partner-with-us" className="text-orange-600 font-bold hover:underline">register as a partner</Link>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <Input
                                {...register("email")}
                                placeholder="you@example.com"
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <Input
                                {...register("password")}
                                type="password"
                                placeholder="••••••••"
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
