import { LoggerService } from './../../../../shared/services/logger/logger.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AddServiceRecordDTO,
  UpdateServiceRecordDTO,
} from '../../dto/service_record.dto';
import { ServiceRecordsService } from '../../services/service_records/service_records.service';

/**
 * @description ServiceRecordsController defined all entry points for service-record data.
 */
@ApiTags('Service Records')
@Controller('records')
export class ServiceRecordsController {
  private readonly loggerService: LoggerService = new LoggerService(
    ServiceRecordsController.name,
  );
  constructor(private serviceRecordService: ServiceRecordsService) {}

  @Get('')
  async getAllrecords() {
    this.loggerService.log('controller called for getAllrecords');
    return await this.serviceRecordService.getAllRecords();
  }

  @Get('/:_id')
  async getrecordDetails(@Param('_id') _id: string) {
    this.loggerService.log('controller called for getrecordDetails');
    return await this.serviceRecordService.getServiceRecordDetails(_id);
  }

  @Post('/save')
  async addrecord(@Body() data: AddServiceRecordDTO) {
    this.loggerService.log('controller called for addrecord');
    return await this.serviceRecordService.addServiceRecord(data);
  }

  @Put('/update/:_id')
  async Updaterecord(
    @Param('_id') _id: string,
    @Body() data: UpdateServiceRecordDTO,
  ) {
    this.loggerService.log('controller called for Updaterecord');
    return await this.serviceRecordService.updateRecord(_id, data);
  }

  @Delete('/:_id')
  async deleterecord(@Param('_id') _id: string) {
    this.loggerService.log('controller called for deleterecord');
    return await this.serviceRecordService.deleteRecord(_id);
  }
}
