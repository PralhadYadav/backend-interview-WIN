/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddServiceRecordDTO {

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}

export class UpdateServiceRecordDTO {

    @IsOptional()
    @Exclude()
    _id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;
}
