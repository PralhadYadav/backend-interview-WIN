import {
  ServiceRecords,
  ServiceRecordsSchema,
} from './../../shared/schema/service-records.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceRecordsController } from './controllers/service_records/service_records.controller';
import { ServiceRecordsService } from './services/service_records/service_records.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceRecords.name, schema: ServiceRecordsSchema },
    ]),
  ],
  controllers: [ServiceRecordsController],
  providers: [ServiceRecordsService],
})
export class ServiceRecordsModule {}
