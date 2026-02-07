import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class VendorService {
    private prisma;
    constructor(prisma: PrismaService);
    createMenuItem(data: Prisma.MenuItemCreateInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: Prisma.Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        vendorId: string;
    }>;
    findAllMenuItems(vendorId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: Prisma.Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        vendorId: string;
    }[]>;
    updateMenuItem(id: string, data: Prisma.MenuItemUpdateInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: Prisma.Decimal;
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
        price: Prisma.Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        vendorId: string;
    }>;
    getWeeklyMenu(vendorId: string): Promise<{
        day: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        vendorId: string;
        lunch: string;
        dinner: string | null;
        isVeg: boolean;
    }[]>;
    updateWeeklyMenu(vendorId: string, days: {
        day: string;
        lunch: string;
        dinner?: string;
        isVeg?: boolean;
    }[]): Promise<{
        day: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        vendorId: string;
        lunch: string;
        dinner: string | null;
        isVeg: boolean;
    }[]>;
    getSubscribers(vendorId: string): Promise<({
        customer: {
            user: {
                email: string;
                fullName: string;
            };
        } & {
            id: string;
            phone: string | null;
            userId: string;
            preferences: Prisma.JsonValue | null;
        };
    } & {
        id: string;
        status: string;
        vendorId: string;
        customerId: string;
        startDate: Date;
        endDate: Date;
    })[]>;
    findVendorProfileByUserId(userId: string): Promise<{
        id: string;
        businessName: string;
        phone: string;
        address: string | null;
        fssaiLicense: string | null;
        isVerified: boolean;
        userId: string;
    } | null>;
    findAllVendors(): Promise<({
        user: {
            email: string;
            fullName: string;
        };
        menuItems: {
            name: string;
            price: Prisma.Decimal;
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
    findOne(id: string): Promise<({
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
            price: Prisma.Decimal;
            imageUrl: string | null;
            isAvailable: boolean;
            vendorId: string;
        }[];
        weeklyMenus: {
            day: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
