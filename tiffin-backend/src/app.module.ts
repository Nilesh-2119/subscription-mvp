import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VendorModule } from './vendor/vendor.module';
import { PublicModule } from './public/public.module';
import { OrdersModule } from './orders/orders.module';
import { UploadsModule } from './uploads/uploads.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, VendorModule, PublicModule, OrdersModule, UploadsModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
