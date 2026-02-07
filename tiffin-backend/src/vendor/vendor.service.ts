import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VendorService {
    constructor(private prisma: PrismaService) { }

    // --- Menu Items ---

    async createMenuItem(data: Prisma.MenuItemCreateInput) {
        return this.prisma.menuItem.create({ data });
    }

    async findAllMenuItems(vendorId: string) {
        return this.prisma.menuItem.findMany({
            where: { vendorId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateMenuItem(id: string, data: Prisma.MenuItemUpdateInput) {
        return this.prisma.menuItem.update({
            where: { id },
            data,
        });
    }

    async deleteMenuItem(id: string) {
        return this.prisma.menuItem.delete({
            where: { id },
        });
    }

    // --- Weekly Menu ---

    async getWeeklyMenu(vendorId: string) {
        return this.prisma.weeklyMenu.findMany({
            where: { vendorId },
        });
    }

    async updateWeeklyMenu(vendorId: string, days: { day: string; lunch: string; dinner?: string; isVeg?: boolean }[]) {
        const upserts = days.map(dayData =>
            this.prisma.weeklyMenu.upsert({
                where: {
                    vendorId_day: {
                        vendorId,
                        day: dayData.day
                    }
                },
                update: {
                    lunch: dayData.lunch,
                    dinner: dayData.dinner,
                    isVeg: dayData.isVeg
                },
                create: {
                    vendorId,
                    day: dayData.day,
                    lunch: dayData.lunch,
                    dinner: dayData.dinner,
                    isVeg: dayData.isVeg ?? true
                }
            })
        );
        return this.prisma.$transaction(upserts);
    }

    // --- Subscriptions ---

    async getSubscribers(vendorId: string) {
        // Get active subscriptions for this vendor
        return this.prisma.subscription.findMany({
            where: {
                vendorId,
                status: 'ACTIVE'
            },
            include: {
                customer: {
                    include: {
                        user: {
                            select: { fullName: true, email: true }
                        }
                    }
                }
            }
        });
    }

    // Helper to find vendor profile from user ID
    async findVendorProfileByUserId(userId: string) {
        return this.prisma.vendorProfile.findUnique({
            where: { userId }
        });
    }

    // Public: Find all vendors for listing
    async findAllVendors() {
        return this.prisma.vendorProfile.findMany({
            where: { isVerified: false }, // For MVP show all, or filter by isVerified: true
            include: {
                user: { select: { fullName: true, email: true } },
                menuItems: { select: { name: true, price: true } } // Show some menu previews
            }
        });
    }

    async findOne(id: string) {
        return this.prisma.vendorProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: { fullName: true, email: true }
                },
                menuItems: true,
                weeklyMenus: {
                    orderBy: { createdAt: 'asc' } // Or by a custom order helper if needed
                }
            }
        });
    }
}
