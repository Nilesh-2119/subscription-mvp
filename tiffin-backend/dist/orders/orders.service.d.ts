import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        customerId: string;
        type: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
    }>;
    findAllByVendor(vendorId: string): Promise<({
        customer: {
            user: {
                fullName: string;
            };
        } & {
            id: string;
            phone: string | null;
            userId: string;
            preferences: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        customerId: string;
        type: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
    })[]>;
    findAllByCustomer(customerId: string): Promise<({
        vendor: {
            id: string;
            businessName: string;
            phone: string;
            address: string | null;
            fssaiLicense: string | null;
            isVerified: boolean;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        customerId: string;
        type: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
    })[]>;
    acceptOrder(orderId: string, vendorId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        customerId: string;
        type: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
    }>;
}
