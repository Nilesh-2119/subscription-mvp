import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.order.create({
            data: {
                customerId: data.customerId,
                vendorId: data.vendorId,
                items: {
                    menuItems: data.items,
                    mealType: data.mealType,
                    deliveryAddress: data.deliveryAddress
                },
                totalAmount: data.totalAmount,
                status: 'PENDING',
                type: data.type || 'ONE_TIME',
                date: new Date(data.deliveryDate || data.date || new Date()),
            },
        });
    }

    async findAllByVendor(vendorId: string) {
        return this.prisma.order.findMany({
            where: { vendorId },
            include: {
                customer: {
                    include: { user: { select: { fullName: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findAllByCustomer(customerId: string) {
        return this.prisma.order.findMany({
            where: { customerId },
            include: {
                vendor: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async acceptOrder(orderId: string, vendorId: string) {
        // Verify the order belongs to this vendor
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, vendorId }
        });

        if (!order) {
            throw new Error('Order not found or does not belong to this vendor');
        }

        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'ACCEPTED' }
        });
    }
}
