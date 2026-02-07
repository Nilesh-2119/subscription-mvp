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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VendorService = class VendorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMenuItem(data) {
        return this.prisma.menuItem.create({ data });
    }
    async findAllMenuItems(vendorId) {
        return this.prisma.menuItem.findMany({
            where: { vendorId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateMenuItem(id, data) {
        return this.prisma.menuItem.update({
            where: { id },
            data,
        });
    }
    async deleteMenuItem(id) {
        return this.prisma.menuItem.delete({
            where: { id },
        });
    }
    async getWeeklyMenu(vendorId) {
        return this.prisma.weeklyMenu.findMany({
            where: { vendorId },
        });
    }
    async updateWeeklyMenu(vendorId, days) {
        const upserts = days.map(dayData => this.prisma.weeklyMenu.upsert({
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
        }));
        return this.prisma.$transaction(upserts);
    }
    async getSubscribers(vendorId) {
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
    async findVendorProfileByUserId(userId) {
        return this.prisma.vendorProfile.findUnique({
            where: { userId }
        });
    }
    async findAllVendors() {
        return this.prisma.vendorProfile.findMany({
            where: { isVerified: false },
            include: {
                user: { select: { fullName: true, email: true } },
                menuItems: { select: { name: true, price: true } }
            }
        });
    }
    async findOne(id) {
        return this.prisma.vendorProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: { fullName: true, email: true }
                },
                menuItems: true,
                weeklyMenus: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
    }
};
exports.VendorService = VendorService;
exports.VendorService = VendorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VendorService);
//# sourceMappingURL=vendor.service.js.map