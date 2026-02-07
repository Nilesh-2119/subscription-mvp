"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const orders_service_1 = require("../orders/orders.service");
const passport_1 = require("@nestjs/passport");
let PaymentsController = class PaymentsController {
    paymentsService;
    ordersService;
    constructor(paymentsService, ordersService) {
        this.paymentsService = paymentsService;
        this.ordersService = ordersService;
    }
    async createOrder(body, req) {
        try {
            console.log('Creating Razorpay order:', body);
            const razorpayOrder = await this.paymentsService.createOrder(body.amount);
            return {
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                keyId: process.env.RAZORPAY_KEY_ID,
            };
        }
        catch (error) {
            console.error('Error creating payment order:', error);
            throw new common_1.HttpException('Failed to create payment order', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyPayment(body, req) {
        try {
            const isValid = this.paymentsService.verifyPayment(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature);
            if (!isValid) {
                throw new common_1.HttpException('Invalid payment signature', common_1.HttpStatus.BAD_REQUEST);
            }
            const customerId = req.user.role === 'CUSTOMER' ? req.user.profileId : body.orderDetails.customerId;
            if (!customerId) {
                throw new common_1.HttpException('Customer profile not found. Please log out and log back in.', common_1.HttpStatus.BAD_REQUEST);
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
        }
        catch (error) {
            console.error('Payment verification failed:', error);
            throw new common_1.HttpException(error.message || 'Payment verification failed', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('create-order'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createOrder", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verifyPayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        orders_service_1.OrdersService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map