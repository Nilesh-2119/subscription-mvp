import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
    private razorpay: Razorpay;

    constructor() {
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (key_id && key_secret) {
            this.razorpay = new Razorpay({
                key_id,
                key_secret,
            });
        } else {
            console.warn('WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Payment features will not work.');
        }
    }

    async createOrder(amount: number, currency: string = 'INR', receipt?: string) {
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: receipt || `order_${Date.now()}`,
        };

        if (!this.razorpay) {
            throw new Error('Razorpay is not initialized. Check environment variables.');
        }
        try {
            const order = await this.razorpay.orders.create(options);
            return order;
        } catch (error) {
            console.error('Razorpay order creation failed:', error);
            throw error;
        }
    }

    verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): boolean {
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const secret = process.env.RAZORPAY_KEY_SECRET || '';
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        return expectedSignature === razorpaySignature;
    }
}
