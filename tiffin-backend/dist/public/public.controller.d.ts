import { VendorService } from '../vendor/vendor.service';
export declare class PublicController {
    private readonly vendorService;
    constructor(vendorService: VendorService);
    getVendors(): Promise<({
        user: {
            email: string;
            fullName: string;
        };
        menuItems: {
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        businessName: string;
        phone: string;
        address: string | null;
        fssaiLicense: string | null;
        isVerified: boolean;
        userId: string;
    })[]>;
    getVendorById(id: string): Promise<({
        user: {
            email: string;
            fullName: string;
        };
        menuItems: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            imageUrl: string | null;
            isAvailable: boolean;
            vendorId: string;
        }[];
        weeklyMenus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: string;
            vendorId: string;
            lunch: string;
            dinner: string | null;
            isVeg: boolean;
        }[];
    } & {
        id: string;
        businessName: string;
        phone: string;
        address: string | null;
        fssaiLicense: string | null;
        isVerified: boolean;
        userId: string;
    }) | null>;
}
