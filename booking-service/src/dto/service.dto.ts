import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsUrl,
  IsBoolean,
  IsObject,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ServiceType, ServiceStatus } from "../entities/service.entity";

class TimeSlot {
  @IsString()
  start: string;

  @IsString()
  end: string;
}

class Schedule {
  @IsObject()
  @ValidateNested()
  @Type(() => TimeSlot)
  monday: TimeSlot[];

  @IsObject()
  @ValidateNested()
  @Type(() => TimeSlot)
  tuesday: TimeSlot[];

  @IsObject()
  @ValidateNested()
  @Type(() => TimeSlot)
  wednesday: TimeSlot[];

  @IsObject()
  @ValidateNested()
  @Type(() => TimeSlot)
  thursday: TimeSlot[];

  @IsObject()
  @ValidateNested()
  @Type(() => TimeSlot)
  friday: TimeSlot[];

  @IsObject()
  @ValidateNested()
  @Type(() => TimeSlot)
  saturday: TimeSlot[];

  @IsObject()
  @ValidateNested()
  @Type(() => TimeSlot)
  sunday: TimeSlot[];
}

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ServiceType)
  @IsNotEmpty()
  type: ServiceType;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountPrice?: number;

  @IsNumber()
  @Min(0)
  duration: number;

  @IsArray()
  @IsString({ each: true })
  includedItems: string[];

  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => Schedule)
  schedule: Schedule;

  @IsNumber()
  @Min(1)
  maxPetsPerBooking: number;

  @IsNumber()
  @Min(1)
  maxBookingsPerSlot: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsEnum(ServiceType)
  @IsOptional()
  type?: ServiceType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  basePrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  includedItems?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => Schedule)
  @IsOptional()
  schedule?: Schedule;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxPetsPerBooking?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxBookingsPerSlot?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;
}
