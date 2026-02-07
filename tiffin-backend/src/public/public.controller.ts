import { Controller, Get, Param } from '@nestjs/common';
import { VendorService } from '../vendor/vendor.service';

@Controller('public')
export class PublicController {
    constructor(private readonly vendorService: VendorService) { }

    @Get('vendors')
    async getVendors() {
        return this.vendorService.findAllVendors();
    }

    @Get('vendors/:id')
    async getVendorById(@Param('id') id: string) {
        console.log(`PublicController: Fetching vendor with id: ${id}`);
        const vendor = await this.vendorService.findOne(id);
        if (!vendor) console.log(`PublicController: Vendor not found for id: ${id}`);
        return vendor;
    }
}
