/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class ServiceId {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  _id: string;
}

export class AddOrderDTO {

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  datetime: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  totalfee: number;

  @ValidateNested()
  @IsNotEmpty()
  @ApiProperty({ type: ()=> [ServiceId] })
  services: [ServiceId];
}

export class UpdateOrderDTO {
    @IsOptional()
    @Exclude()
    _id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    datetime: string;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    totalfee: number;

    @ValidateNested()
    @IsOptional()
    @ApiPropertyOptional({ type: () => [ServiceId] })
    services: [ServiceId];
}
