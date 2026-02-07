import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
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
    }>;
    findAllByVendor(vendorId: string): Promise<({
        customer: {
            user: {
                fullName: string;
            };
        } & {
            id: string;
            userId: string;
            phone: string | null;
            preferences: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
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
    })[]>;
    findAllByCustomer(customerId: string): Promise<({
        vendor: {
            id: string;
            userId: string;
            phone: string;
            businessName: string;
            address: string | null;
            fssaiLicense: string | null;
            isVerified: boolean;
        };
    } & {
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
    })[]>;
    acceptOrder(orderId: string, vendorId: string): Promise<{
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
    }>;
}
