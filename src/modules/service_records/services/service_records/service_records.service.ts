import { LoggerService } from './../../../../shared/services/logger/logger.service';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ServiceRecords,
  ServiceRecordsDocument,
} from 'src/shared/schema/service-records.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddServiceRecordDTO,
  UpdateServiceRecordDTO,
} from '../../dto/service_record.dto';

/**
 * @description ServiceRecordsService consist all business login for servce-record data.
 */
@Injectable()
export class ServiceRecordsService {
  private readonly loggerService: LoggerService = new LoggerService(
    ServiceRecordsService.name,
  );

  constructor(
    @InjectModel(ServiceRecords.name)
    private serviceRecordModel: Model<ServiceRecordsDocument>,
  ) {}

  async getAllRecords() {
    try {
      const res = await this.serviceRecordModel.find({});
      if (res.length > 0) {
        const response = {};
        response['message'] = 'Success';
        response['data'] = res;
        return response;
      } else {
        this.loggerService.log(`Data Not Found.`);
        const response = {};
        response['message'] = 'Data Not Found.';
        response['data'] = [];
        return response;
      }
    } catch (err) {
      this.loggerService.log(
        `Error while fetching all record details`,
        JSON.stringify(err),
      );
      const errorCode = err?.response?.statusCode || err?.status || 500;
      const messege = err?.response?.message || 'Something went wrong';
      throw new HttpException(messege, errorCode);
    }
  }

  async getServiceRecordDetails(_id: string) {
    try {
      const res = await this.serviceRecordModel.find({ _id: _id });
      if (res.length > 0) {
        const response = {};
        response['message'] = 'Success';
        response['data'] = res;
        return response;
      } else {
        this.loggerService.log(`Data Not Found. for Record _id ${_id}`);
        const response = {};
        response['message'] = 'Data Not Found.';
        response['data'] = [];
        return response;
      }
    } catch (err) {
      this.loggerService.log(
        `Error while fetching Record details for Record _id ${_id}`,
        JSON.stringify(err),
      );
      const errorCode = err?.response?.statusCode || err?.status || 500;
      const messege = err?.response?.message || 'Something went wrong';
      throw new HttpException(messege, errorCode);
    }
  }

  async addServiceRecord(data: AddServiceRecordDTO) {
    try {
      let addRecord = true;
      if (data?.['_id']) {
        const id = data?.['_id'];
        const existingRecord = await this.serviceRecordModel.find({
          _id: id,
        });
        if (!(existingRecord.length > 0)) {
          addRecord = false;
        }
      }
      console.log('addRecord ', addRecord);

      if (!addRecord) {
        const response = {};
        response['message'] = 'Record already exist for same _id.';
        response['data'] = [];
        throw new BadRequestException(response);
      } else {
        const res = await this.serviceRecordModel.create(data);
        if (res?._id) {
          const response = {};
          response['message'] = 'Data Added Successfully.';
          response['data'] = res;
          return response;
        } else {
          this.loggerService.log('Something went wrong in adding record');
          throw new InternalServerErrorException('Something went wrong');
        }
      }
    } catch (err) {
      this.loggerService.log(
        `Error while addServiceRecord`,
        JSON.stringify(err),
      );
      const errorCode = err?.response?.statusCode || err?.status || 500;
      const messege = err?.response?.message || 'Something went wrong';
      throw new HttpException(messege, errorCode);
    }
  }

  async deleteRecord(_id: string) {
    try {
      const res = await this.getServiceRecordDetails(_id);
      const obj = res?.['data'][0];
      if (obj && obj._id) {
        await this.serviceRecordModel.deleteOne({ _id: obj._id });
        const response = {};
        response['message'] = 'Record deleted Successfully.';
        response['data'] = [];
        return response;
      } else {
        this.loggerService.log(`Data Not Found for Record _id ${_id}`);
        const response = {};
        response['message'] = 'Data Not Found.';
        response['data'] = [];
        return response;
      }
    } catch (err) {
      this.loggerService.log(
        `Error while fetching record details for record _id ${_id}`,
        JSON.stringify(err),
      );
      const errorCode = err?.response?.statusCode || err?.status || 500;
      const messege = err?.response?.message || 'Something went wrong';
      throw new HttpException(messege, errorCode);
    }
  }

  async updateRecord(_id: string, data: UpdateServiceRecordDTO) {
    try {
      const res = await this.serviceRecordModel.findOneAndUpdate(
        { _id: _id },
        data,
      );
      if (res?._id) {
        const response = {};
        response['message'] = 'Data Updated Successfully.';
        response['data'] = [];
        return response;
      } else {
        this.loggerService.log(`Data Not Found. for Record _id ${_id}`);
        const response = {};
        response['message'] = 'Data Not Found for update.';
        response['data'] = [];
        return response;
      }
    } catch (err) {
      console.log(err);
      this.loggerService.log('Error from updateRecord ', JSON.stringify(err));
      const errorCode = err?.response?.statusCode || err?.status || 500;
      const messege = err?.response?.message || 'Something went wrong';
      throw new HttpException(messege, errorCode);
    }
  }
}
