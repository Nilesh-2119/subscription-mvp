export declare class PaymentsService {
    private razorpay;
    constructor();
    createOrder(amount: number, currency?: string, receipt?: string): Promise<import("razorpay/dist/types/orders").Orders.RazorpayOrder>;
    verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): boolean;
}
