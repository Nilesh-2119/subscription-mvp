import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly ordersService;
    constructor(paymentsService: PaymentsService, ordersService: OrdersService);
    createOrder(body: {
        amount: number;
        orderDetails: any;
    }, req: any): Promise<{
        orderId: string;
        amount: string | number;
        currency: string;
        keyId: string | undefined;
    }>;
    verifyPayment(body: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        orderDetails: any;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        order: {
            id: string;
            status: string;
            type: string;
            items: import("@prisma/client/runtime/library").JsonValue;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            date: Date;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            vendorId: string;
        };
    }>;
}
