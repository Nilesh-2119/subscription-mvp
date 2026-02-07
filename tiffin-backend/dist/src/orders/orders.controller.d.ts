import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: any, req: any): Promise<{
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
    findAllForVendor(req: any): Promise<({
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
    acceptOrder(id: string, req: any): Promise<{
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
    findAllForCustomer(req: any): Promise<({
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
}
