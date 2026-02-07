import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly ordersService: OrdersService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('create-order')
    async createOrder(@Body() body: { amount: number; orderDetails: any }, @Request() req) {
        try {
            console.log('Creating Razorpay order:', body);
            const razorpayOrder = await this.paymentsService.createOrder(body.amount);

            return {
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                keyId: process.env.RAZORPAY_KEY_ID,
            };
        } catch (error) {
            console.error('Error creating payment order:', error);
            throw new HttpException('Failed to create payment order', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('verify')
    async verifyPayment(
        @Body() body: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
            orderDetails: any;
        },
        @Request() req
    ) {
        try {
            const isValid = this.paymentsService.verifyPayment(
                body.razorpay_order_id,
                body.razorpay_payment_id,
                body.razorpay_signature
            );

            if (!isValid) {
                throw new HttpException('Invalid payment signature', HttpStatus.BAD_REQUEST);
            }

            // Create the order in database after successful payment
            const customerId = req.user.role === 'CUSTOMER' ? req.user.profileId : body.orderDetails.customerId;

            if (!customerId) {
                throw new HttpException('Customer profile not found. Please log out and log back in.', HttpStatus.BAD_REQUEST);
            }

            const order = await this.ordersService.create({
                ...body.orderDetails,
                customerId,
                paymentId: body.razorpay_payment_id,
                paymentStatus: 'PAID',
            });

            return {
                success: true,
                message: 'Payment verified and order created successfully',
                order,
            };
        } catch (error) {
            console.error('Payment verification failed:', error);
            throw new HttpException(
                error.message || 'Payment verification failed',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
