import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Orders,
  OrdersDocument,
} from '../../../../shared/schema/orders.schema';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { AddOrderDTO, UpdateOrderDTO } from '../dto/order.dto';

/**
 * @description OrderService consist all business login for order data.
 */
@Injectable()
export class OrderService {
  private readonly loggerService: LoggerService = new LoggerService(
    OrderService.name,
  );

  constructor(
    @InjectModel(Orders.name) private orderModel: Model<OrdersDocument>,
  ) {}

  async getAllOrders() {
    try {
      const res = await this.orderModel.find({});
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
        `Error while fetching all order details`,
        JSON.stringify(err),
      );
      const errorCode = err.response.statusCode || 500;
      const messege = err.response.message || 'Something went wrong';
      throw new HttpException(messege, errorCode);
    }
  }

  async getOrderDetails(_id: string) {
    try {
      const res = await this.orderModel.find({ _id: _id });
      if (res.length > 0) {
        const response = {};
        response['message'] = 'Success';
        response['data'] = res;
        return response;
      } else {
        this.loggerService.log(`Data Not Found. for order _id ${_id}`);
        const response = {};
        response['message'] = 'Data Not Found.';
        response['data'] = [];
        return response;
      }
    } catch (err) {
      this.loggerService.log(
        `Error while fetching order details for order _id ${_id}`,
        JSON.stringify(err),
      );
      const errorCode = err.response.statusCode || 500;
      const messege = err.response.message || 'Something went wrong';
      throw new HttpException(messege, errorCode);
    }
  }

  async addOrder(data: AddOrderDTO) {
    try {
      const serviceIds = [];
      data.services.map((x) => serviceIds.push(x._id));
      const existingOrder = await this.orderModel.find({
        'services._id': { $in: serviceIds },
      });
      let validOrder = true;
      if (existingOrder && existingOrder.length > 0) {
        validOrder = this.validateOrderTime(existingOrder);
      }
      if (validOrder) {
        const res = await this.orderModel.create(data);
        if (res?._id) {
          const response = {};
          response['message'] = 'Data Added Successfully.';
          response['data'] = res;
          return response;
        } else {
          this.loggerService.log('Something went wrong in adding order');
          throw new InternalServerErrorException('Something went wrong');
        }
      } else {
        this.loggerService.log(
          'Order Already exist for same service with data ',
          JSON.stringify(data),
        );
        throw new BadRequestException('Order Already exist for same service.');
      }
    } catch (err) {
      const errorCode = err.response.statusCode || 500;
      const messege = err.response.message || 'Something went wrong';
      throw new HttpException(messege, errorCode);
    }
  }

  async cancelOrder(_id: string) {
    try {
      const res = await this.getOrderDetails(_id);
      const obj = res?.['data'][0];
      if (obj && obj._id) {
        await this.orderModel.deleteOne({ _id: obj._id });
        const response = {};
        response['message'] = 'Order Canceled Successfully.';
        response['data'] = [];
        return response;
      } else {
        this.loggerService.log(`Data Not Found for order _id ${_id}`);
        const response = {};
        response['message'] = 'Data Not Found.';
        response['data'] = [];
        return response;
      }
    } catch (err) {
      this.loggerService.log(
        `Error while fetching order details for order _id ${_id}`,
        JSON.stringify(err),
      );
      const errorCode = err.response.statusCode || 500;
      const messege = err.response.message || 'Something went wrong';
      throw new HttpException(messege, errorCode);
    }
  }

  async updateOrder(_id: string, data: UpdateOrderDTO) {
    try {
      const validOrder = this.validateOrderTime([data]);
      console.log('validOrder ', validOrder);
      if (validOrder) {
        const res = await this.orderModel.findOneAndUpdate({ _id: _id }, data);
        console.log('res ', res);
        if (res?._id) {
          const response = {};
          response['message'] = 'Data Updated Successfully.';
          response['data'] = [];
          return response;
        } else {
          this.loggerService.log(`Data Not Found. for order _id ${_id}`);
          const response = {};
          response['message'] = 'Data Not Found for update.';
          response['data'] = [];
          return response;
        }
      } else {
        this.loggerService.log(
          'Order Already exist for same service with data ',
          JSON.stringify(data),
        );
        throw new BadRequestException('Order Already exist for same service.');
      }
    } catch (err) {
      console.log(err);
      this.loggerService.log('Error from UpdateOrder ', JSON.stringify(err));
      const errorCode = err.response.statusCode || 500;
      const messege = err.response.message || 'Something went wrong';
      throw new HttpException(messege, errorCode);
    }
  }

  validateOrderTime(orders) {
    try {
      let validOrder = true;
      orders.map((order) => {
        const orderDate = new Date();
        orderDate.setHours(orderDate.getHours() - 3);
        if (
          new Date(order.datetime) < new Date() &&
          new Date(order.datetime) > orderDate
        ) {
          validOrder = false;
        }
      });
      return validOrder;
    } catch (err) {
      this.loggerService.log(
        'Error from validateOrderTime ',
        JSON.stringify(err),
      );
      console.log(JSON.stringify(err));
    }
  }
}
