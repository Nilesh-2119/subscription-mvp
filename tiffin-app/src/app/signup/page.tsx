"use client";
import { Header } from "@/components/layout/Header";
import { CustomerRegistrationForm } from "@/components/auth/CustomerRegistrationForm";

export default function SignupPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="pt-10 pb-20 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex">
                    {/* Left Side - Image/Branding */}
                    <div className="hidden md:flex w-1/2 bg-orange-100 flex-col justify-center p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-200 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

                        <div className="relative z-10">
                            <h2 className="text-3xl font-extrabold text-orange-900 mb-4">Join Tiffin Code</h2>
                            <p className="text-lg text-orange-800/80 mb-8">
                                Discover authentic home-cooked meals from kitchens near you.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">🍲</div>
                                    <span className="font-semibold text-orange-900">Fresh daily menus</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">🛵</div>
                                    <span className="font-semibold text-orange-900">Reliable delivery</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">🥗</div>
                                    <span className="font-semibold text-orange-900">Customizable plans</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center">
                        <CustomerRegistrationForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
