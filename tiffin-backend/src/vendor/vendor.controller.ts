import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vendor')
export class VendorController {
    constructor(private readonly vendorService: VendorService) { }

    // Helper to get vendor ID from Request (assuming JWT payload has userId)
    private async getVendorId(req: any): Promise<string> {
        // In a real app, JWT strategy attaches 'user' to req.
        // We need to look up the VendorProfile id from the User id.
        const userId = req.user.userId;
        const profile = await this.vendorService.findVendorProfileByUserId(userId);
        if (!profile) throw new ForbiddenException('User is not a vendor');
        return profile.id;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('menu')
    async getMenu(@Request() req) {
        const vendorId = await this.getVendorId(req);
        return this.vendorService.findAllMenuItems(vendorId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('menu')
    async createMenuItem(@Request() req, @Body() data: any) {
        const vendorId = await this.getVendorId(req);
        return this.vendorService.createMenuItem({
            name: data.name,
            description: data.description,
            price: data.price,
            imageUrl: data.imageUrl,
            vendor: { connect: { id: vendorId } }
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('menu/:id')
    async updateMenuItem(@Param('id') id: string, @Body() data: any) {
        return this.vendorService.updateMenuItem(id, {
            name: data.name,
            description: data.description,
            price: data.price,
            isAvailable: data.isAvailable
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('menu/:id')
    async deleteMenuItem(@Param('id') id: string) {
        return this.vendorService.deleteMenuItem(id);
    }

    // --- Weekly Menu ---

    @UseGuards(JwtAuthGuard)
    @Get('weekly-menu')
    async getWeeklyMenu(@Request() req) {
        const vendor = await this.vendorService.findVendorProfileByUserId(req.user.userId);
        if (!vendor) return [];
        return this.vendorService.getWeeklyMenu(vendor.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('weekly-menu')
    async updateWeeklyMenu(@Request() req, @Body() data: { days: any[] }) {
        const vendor = await this.vendorService.findVendorProfileByUserId(req.user.userId);
        if (!vendor) throw new Error("Vendor profile not found");
        return this.vendorService.updateWeeklyMenu(vendor.id, data.days);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('subscribers')
    async getSubscribers(@Request() req) {
        const vendorId = await this.getVendorId(req);
        return this.vendorService.getSubscribers(vendorId);
    }
}
