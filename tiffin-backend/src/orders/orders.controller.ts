import { Controller, Post, Body, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createOrderDto: any, @Request() req) {
        try {
            console.log('Order request:', {
                body: createOrderDto,
                user: req.user
            });

            const customerId = req.user.role === 'CUSTOMER' ? req.user.profileId : createOrderDto.customerId;

            if (!customerId) {
                throw new Error('Customer profile ID is required. Please log out and log back in.');
            }

            return await this.ordersService.create({
                ...createOrderDto,
                customerId
            });
        } catch (error) {
            console.error('Order creation failed:', error);
            throw error;
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('vendor')
    findAllForVendor(@Request() req) {
        return this.ordersService.findAllByVendor(req.user.profileId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/accept')
    async acceptOrder(@Param('id') id: string, @Request() req) {
        console.log(`Accepting order ${id} by vendor ${req.user.profileId}`);
        return this.ordersService.acceptOrder(id, req.user.profileId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('customer')
    findAllForCustomer(@Request() req) {
        return this.ordersService.findAllByCustomer(req.user.profileId);
    }
}
