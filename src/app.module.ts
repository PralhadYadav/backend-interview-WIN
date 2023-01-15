import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { OrdersModule } from './modules/orders/orders.module';
import { ServiceRecordsModule } from './modules/service_records/service_records.module';

dotenv.config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.CONNECTION_STRING),
    OrdersModule,
    ServiceRecordsModule,
  ],
})
export class AppModule {}
