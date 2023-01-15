/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrdersDocument = Orders & Document;

/**
 * @description OrdersSchema defined model structre in db and used to query Orders collection from database.
 */

class Services {
  @Prop({ required: true })
  _id: string;
}

@Schema()
export class Orders {

  @Prop({ required: true })
  totalfee: number;

  @Prop({ required: true })
  datetime: string;

  @Prop({ required: true })
  services: Services;

  @Prop({ default: new Date().toISOString() })
  created_at: string;

  @Prop({ default: new Date().toISOString() })
  updated_at: string;
}


export const OrdersSchema = SchemaFactory.createForClass(Orders);
