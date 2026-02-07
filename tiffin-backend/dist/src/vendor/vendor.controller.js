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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const common_1 = require("@nestjs/common");
const vendor_service_1 = require("./vendor.service");
const passport_1 = require("@nestjs/passport");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let VendorController = class VendorController {
    vendorService;
    constructor(vendorService) {
        this.vendorService = vendorService;
    }
    async getVendorId(req) {
        const userId = req.user.userId;
        const profile = await this.vendorService.findVendorProfileByUserId(userId);
        if (!profile)
            throw new common_1.ForbiddenException('User is not a vendor');
        return profile.id;
    }
    async getMenu(req) {
        const vendorId = await this.getVendorId(req);
        return this.vendorService.findAllMenuItems(vendorId);
    }
    async createMenuItem(req, data) {
        const vendorId = await this.getVendorId(req);
        return this.vendorService.createMenuItem({
            name: data.name,
            description: data.description,
            price: data.price,
            imageUrl: data.imageUrl,
            vendor: { connect: { id: vendorId } }
        });
    }
    async updateMenuItem(id, data) {
        return this.vendorService.updateMenuItem(id, {
            name: data.name,
            description: data.description,
            price: data.price,
            isAvailable: data.isAvailable
        });
    }
    async deleteMenuItem(id) {
        return this.vendorService.deleteMenuItem(id);
    }
    async getWeeklyMenu(req) {
        const vendor = await this.vendorService.findVendorProfileByUserId(req.user.userId);
        if (!vendor)
            return [];
        return this.vendorService.getWeeklyMenu(vendor.id);
    }
    async updateWeeklyMenu(req, data) {
        const vendor = await this.vendorService.findVendorProfileByUserId(req.user.userId);
        if (!vendor)
            throw new Error("Vendor profile not found");
        return this.vendorService.updateWeeklyMenu(vendor.id, data.days);
    }
    async getSubscribers(req) {
        const vendorId = await this.getVendorId(req);
        return this.vendorService.getSubscribers(vendorId);
    }
};
exports.VendorController = VendorController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('menu'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getMenu", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('menu'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "createMenuItem", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)('menu/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateMenuItem", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)('menu/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "deleteMenuItem", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('weekly-menu'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getWeeklyMenu", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('weekly-menu'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateWeeklyMenu", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('subscribers'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getSubscribers", null);
exports.VendorController = VendorController = __decorate([
    (0, common_1.Controller)('vendor'),
    __metadata("design:paramtypes", [vendor_service_1.VendorService])
], VendorController);
//# sourceMappingURL=vendor.controller.js.map