import {
  IsString,
  IsUUID,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { BookingStatus, PaymentStatus } from "../entities/booking.entity";
import { ServiceType } from "../entities/service.entity";

export class CreateBookingDto {
  @IsUUID()
  serviceId: string;

  @IsUUID()
  petId: string;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpecialInstructionsDto)
  specialInstructions?: SpecialInstructionsDto;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startTime?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endTime?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpecialInstructionsDto)
  specialInstructions?: SpecialInstructionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotesDto)
  notes?: NotesDto;
}

export class CancelBookingDto {
  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReviewBookingDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}

export class SpecialInstructionsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietary?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medical?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  behavioral?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  other?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pets?: string[];
}

export class NotesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  staff?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customer?: string[];
}

export class ServiceFilterDto {
  @IsOptional()
  @IsEnum(ServiceType)
  type?: ServiceType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;
}

export class BookingFilterDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
