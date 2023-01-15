import { Orders, OrdersSchema } from './../../shared/schema/orders.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order/controllers/order.controller';
import { OrderService } from './order/services/order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Orders.name, schema: OrdersSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
