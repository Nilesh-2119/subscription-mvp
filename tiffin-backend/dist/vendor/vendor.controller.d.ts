import { VendorService } from './vendor.service';
export declare class VendorController {
    private readonly vendorService;
    constructor(vendorService: VendorService);
    private getVendorId;
    getMenu(req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        vendorId: string;
    }[]>;
    createMenuItem(req: any, data: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        vendorId: string;
    }>;
    updateMenuItem(id: string, data: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        vendorId: string;
    }>;
    deleteMenuItem(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        vendorId: string;
    }>;
    getWeeklyMenu(req: any): Promise<{
        day: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        vendorId: string;
        lunch: string;
        dinner: string | null;
        isVeg: boolean;
    }[]>;
    updateWeeklyMenu(req: any, data: {
        days: any[];
    }): Promise<{
        day: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        vendorId: string;
        lunch: string;
        dinner: string | null;
        isVeg: boolean;
    }[]>;
    getSubscribers(req: any): Promise<({
        customer: {
            user: {
                email: string;
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
        status: string;
        vendorId: string;
        customerId: string;
        startDate: Date;
        endDate: Date;
    })[]>;
}
