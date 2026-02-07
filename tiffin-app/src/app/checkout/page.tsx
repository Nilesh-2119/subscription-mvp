"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { MapPin, Home, Briefcase, ArrowLeft, Check, Minus, Plus } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuthStore();

    // Get data from URL params
    const itemData = searchParams.get('item');
    const planType = searchParams.get('plan') as 'TRIAL' | 'SUBSCRIPTION';
    const vendorId = searchParams.get('vendorId');

    const [item, setItem] = useState<any>(null);
    const [isOrdering, setIsOrdering] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Step 1: Address details
    const [addressData, setAddressData] = useState({
        fullName: user?.fullName || '',
        phone: '',
        address: '',
        instructions: '',
        type: 'HOME' as 'HOME' | 'WORK'
    });

    // Step 2: Meal plan details
    const [mealCount, setMealCount] = useState(30);
    const [mealType, setMealType] = useState<'LUNCH' | 'DINNER' | 'BOTH'>('LUNCH');
    const [quantity, setQuantity] = useState(1);
    const [deliveryFrequency, setDeliveryFrequency] = useState('Mon-Sun');
    const [startDate, setStartDate] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (itemData) {
            try {
                setItem(JSON.parse(decodeURIComponent(itemData)));
            } catch (e) {
                console.error('Failed to parse item data');
                router.push('/');
            }
        }
        // Set default start date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setStartDate(tomorrow.toISOString().split('T')[0]);
    }, [itemData, user, router]);

    const mealOptions = [60, 30, 20, 10, 1];
    const frequencyOptions = ['Mon-Sun', 'Mon-Sat', 'Mon-Fri', 'Custom'];

    const calculatePricing = () => {
        if (!item) return { pricePerMeal: 0, totalPrice: 0, discount: 0, finalPrice: 0 };

        const basePrice = Number(item.price);
        const pricePerMeal = basePrice;

        // Calculate discount based on meal count
        let discountPercent = 0;
        if (mealCount >= 60) discountPercent = 20;
        else if (mealCount >= 30) discountPercent = 15;
        else if (mealCount >= 20) discountPercent = 10;
        else if (mealCount >= 10) discountPercent = 5;

        const totalPrice = pricePerMeal * mealCount * quantity * (mealType === 'BOTH' ? 2 : 1);
        const discount = Math.round(totalPrice * discountPercent / 100);
        const finalPrice = totalPrice - discount;

        return { pricePerMeal, totalPrice, discount, finalPrice, discountPercent };
    };

    const pricing = calculatePricing();

    const canProceed = () => {
        if (currentStep === 1) {
            return addressData.fullName && addressData.phone && addressData.address;
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!razorpayLoaded) {
            alert('Payment system is loading. Please try again in a moment.');
            return;
        }

        setIsOrdering(true);

        const orderDetails = {
            vendorId,
            items: [{ ...item, quantity }],
            totalAmount: pricing.finalPrice,
            type: planType,
            mealType,
            mealCount,
            deliveryFrequency,
            deliveryDate: startDate,
            deliveryAddress: {
                fullName: addressData.fullName,
                phone: addressData.phone,
                address: addressData.address,
                instructions: addressData.instructions,
                type: addressData.type
            }
        };

        try {
            const { data } = await api.post('/payments/create-order', {
                amount: pricing.finalPrice,
                orderDetails
            });

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: 'Tiffin Service',
                description: `${item.name} - ${mealCount} Meals`,
                order_id: data.orderId,
                handler: async function (response: any) {
                    try {
                        await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderDetails
                        });
                        alert('Payment successful! Your subscription has been activated.');
                        router.push('/');
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: addressData.fullName,
                    contact: addressData.phone,
                    email: user?.email || ''
                },
                theme: {
                    color: '#22c55e'
                },
                modal: {
                    ondismiss: function () {
                        setIsOrdering(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Order failed', error);
            alert('Failed to initiate payment. Please try again.');
            setIsOrdering(false);
        }
    };

    if (!item) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
    }

    const totalSteps = planType === 'SUBSCRIPTION' ? 3 : 2;

    return (
        <div className="min-h-screen bg-gray-100 pb-32">
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRazorpayLoaded(true)}
            />

            <Header />

            {/* Progress Steps */}
            <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">
                <div className="flex items-center justify-center gap-0">
                    {Array.from({ length: totalSteps }).map((_, idx) => (
                        <React.Fragment key={idx}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                                currentStep > idx + 1 ? "bg-green-500 text-white" :
                                    currentStep === idx + 1 ? "bg-green-500 text-white" :
                                        "bg-gray-200 text-gray-500"
                            )}>
                                {currentStep > idx + 1 ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            {idx < totalSteps - 1 && (
                                <div className={cn(
                                    "w-20 h-1 transition-all",
                                    currentStep > idx + 1 ? "bg-green-500" : "bg-gray-200"
                                )} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <p className="text-center text-gray-500 text-sm mt-2">Step {currentStep} of {totalSteps}</p>
            </div>

            <div className="max-w-2xl mx-auto px-4">
                {/* Step 1: Address */}
                {currentStep === 1 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Step 1 of {totalSteps}</span>
                            <span className="font-bold text-gray-900">Where should we deliver?</span>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">Delivery Location *</p>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex justify-between items-start mb-3">
                                    <p className="font-bold text-gray-900">Add Delivery Address</p>
                                    <button className="text-green-600 text-sm font-medium">Change Location</button>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span>Pune, Maharashtra, India</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-green-600 font-medium">Full Name*</label>
                                    <input
                                        type="text"
                                        value={addressData.fullName}
                                        onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                                        placeholder="Enter your name"
                                        className="w-full h-12 px-4 mt-1 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-green-600 font-medium">Contact Number*</label>
                                    <input
                                        type="tel"
                                        value={addressData.phone}
                                        onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                                        placeholder="Enter 10-digit number"
                                        className="w-full h-12 px-4 mt-1 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-green-600 font-medium">Full Address*</label>
                                <input
                                    type="text"
                                    value={addressData.address}
                                    onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                                    placeholder="House/Flat No., Building, Street, Area"
                                    className="w-full h-12 px-4 mt-1 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-400">Delivery Instructions (Optional)</label>
                                <input
                                    type="text"
                                    value={addressData.instructions}
                                    onChange={(e) => setAddressData({ ...addressData, instructions: e.target.value })}
                                    placeholder="e.g. Ring the bell twice, hand over to security if unavailable"
                                    className="w-full h-12 px-4 mt-1 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-green-600 font-medium">Address Type*</label>
                                <div className="flex gap-6 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="addressType"
                                            checked={addressData.type === 'HOME'}
                                            onChange={() => setAddressData({ ...addressData, type: 'HOME' })}
                                            className="w-4 h-4 accent-green-500"
                                        />
                                        <span className="text-sm flex items-center gap-1">🏠 Home</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="addressType"
                                            checked={addressData.type === 'WORK'}
                                            onChange={() => setAddressData({ ...addressData, type: 'WORK' })}
                                            className="w-4 h-4 accent-green-500"
                                        />
                                        <span className="text-sm flex items-center gap-1">💼 Work</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Meal Plan (Only for Subscription) */}
                {currentStep === 2 && planType === 'SUBSCRIPTION' && (
                    <div className="space-y-4">
                        {/* Meal Count Selection */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Step 2 of {totalSteps}</span>
                                <span className="font-bold text-gray-900">Select your meal plan</span>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 text-center mb-4">
                                <p className="text-5xl font-bold text-gray-900">{mealCount}</p>
                            </div>

                            <div className="flex justify-center gap-2 mb-4">
                                {mealOptions.map((count) => (
                                    <button
                                        key={count}
                                        onClick={() => setMealCount(count)}
                                        className={cn(
                                            "w-12 h-10 rounded-lg font-bold text-sm transition-all",
                                            mealCount === count ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        )}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>

                            <p className="text-center text-sm text-gray-600">
                                ₹{pricing.pricePerMeal}/meal • <span className="text-green-600 font-bold">₹{pricing.discount}+ OFF</span>
                            </p>
                        </div>

                        {/* Lunch/Dinner Selection */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-900">Choose Lunch, Dinner or Both</p>
                                    <div className="flex gap-2 mt-3">
                                        {(['LUNCH', 'DINNER', 'BOTH'] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setMealType(type)}
                                                className={cn(
                                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1",
                                                    mealType === type ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                )}
                                            >
                                                {type.charAt(0) + type.slice(1).toLowerCase()}
                                                {mealType === type && <Check className="w-3 h-3" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">Quantity per delivery</p>
                                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="text-green-600 font-bold"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold w-4 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(5, quantity + 1))}
                                            className="text-green-600 font-bold"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Frequency */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <p className="font-bold text-gray-900 mb-3">How often do you want deliveries?</p>
                            <div className="flex gap-2 flex-wrap">
                                {frequencyOptions.map((freq) => (
                                    <button
                                        key={freq}
                                        onClick={() => setDeliveryFrequency(freq)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                            deliveryFrequency === freq ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        )}
                                    >
                                        {freq}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Start Date */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <p className="font-bold text-gray-900 mb-1">When do you want to start?</p>
                            <p className="text-sm text-green-600 mb-3">*Tomorrow or later</p>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                className="w-full h-12 px-4 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2/3: Order Summary & Payment */}
                {((currentStep === 2 && planType === 'TRIAL') || (currentStep === 3 && planType === 'SUBSCRIPTION')) && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Step {currentStep} of {totalSteps}</span>
                            <span className="font-bold text-gray-900">Order Summary</span>
                        </div>

                        {/* Item Details */}
                        <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
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
                            <div>
                                <h3 className="font-bold text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500">{planType === 'SUBSCRIPTION' ? `${mealCount} Meals • ${mealType}` : 'Trial Meal'}</p>
                                {planType === 'SUBSCRIPTION' && (
                                    <p className="text-xs text-gray-400">Starts: {new Date(startDate).toLocaleDateString()}</p>
                                )}
                            </div>
                        </div>

                        {/* Delivery Address Summary */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Delivery Address</p>
                            <p className="font-medium text-gray-900">{addressData.fullName}</p>
                            <p className="text-sm text-gray-600">{addressData.address}</p>
                            <p className="text-sm text-gray-600">{addressData.phone}</p>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{pricing.totalPrice}</span>
                            </div>
                            {pricing.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount ({pricing.discountPercent}% off)</span>
                                    <span>-₹{pricing.discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Delivery</span>
                                <span className="text-green-600 font-medium">FREE</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-green-600">₹{pricing.finalPrice}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Bottom Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg">
                <div className="max-w-2xl mx-auto flex gap-3">
                    {currentStep > 1 && (
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="flex-1 h-14 text-lg font-bold rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50"
                        >
                            Back
                        </Button>
                    )}

                    {((currentStep < 2 && planType === 'TRIAL') || (currentStep < 3 && planType === 'SUBSCRIPTION')) ? (
                        <Button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            disabled={!canProceed()}
                            className="flex-1 h-14 text-lg font-bold rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50"
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            onClick={handlePlaceOrder}
                            disabled={isOrdering || !razorpayLoaded}
                            className="flex-1 h-14 text-lg font-bold rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50"
                        >
                            {isOrdering ? 'Processing...' : `Pay ₹${pricing.finalPrice}`}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
