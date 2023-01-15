/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceRecordsDocument = ServiceRecords & Document;

/**
 * @description ServiceRecordsSchema defined model structre in db and used to query ServiceRecords collection from database.
 */

@Schema()
export class ServiceRecords {


    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ default: new Date().toISOString() })
    created_at: string;

    @Prop({ default: new Date().toISOString() })
    updated_at: string;
}


export const ServiceRecordsSchema = SchemaFactory.createForClass(ServiceRecords);
