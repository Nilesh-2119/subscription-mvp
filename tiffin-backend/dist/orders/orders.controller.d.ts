import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: any, req: any): Promise<{
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
    findAllForVendor(req: any): Promise<({
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
    acceptOrder(id: string, req: any): Promise<{
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
    findAllForCustomer(req: any): Promise<({
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
}
