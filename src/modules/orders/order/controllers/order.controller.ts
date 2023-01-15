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
import { LoggerService } from 'src/shared/services/logger/logger.service';
import { AddOrderDTO, UpdateOrderDTO } from '../dto/order.dto';
import { OrderService } from '../services/order.service';

/**
 * @description OrderController defined all entry points for order data.
 */
@ApiTags('Orders')
@Controller('order')
export class OrderController {
  private readonly loggerService: LoggerService = new LoggerService(
    OrderController.name,
  );
  constructor(private orderService: OrderService) {}

  @Get('')
  async getAllOrders() {
    this.loggerService.log('controller called for getAllOrders');
    return await this.orderService.getAllOrders();
  }

  @Get('/:_id')
  async getOrderDetails(@Param('_id') _id: string) {
    this.loggerService.log('controller called for getOrderDetails');
    return await this.orderService.getOrderDetails(_id);
  }

  @Post('/save')
  async addOrder(@Body() data: AddOrderDTO) {
    this.loggerService.log('controller called for addOrder');
    return await this.orderService.addOrder(data);
  }

  @Put('/update/:_id')
  async UpdateOrder(@Param('_id') _id: string, @Body() data: UpdateOrderDTO) {
    this.loggerService.log('controller called for UpdateOrder');
    return await this.orderService.updateOrder(_id, data);
  }

  @Delete('/:_id')
  async deleteOrder(@Param('_id') _id: string) {
    this.loggerService.log('controller called for deleteOrder');
    return await this.orderService.cancelOrder(_id);
  }
}
