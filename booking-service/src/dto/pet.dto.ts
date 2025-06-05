import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUrl,
  IsUUID,
} from "class-validator";
import { PetType } from "../entities/pet.entity";

export class CreatePetDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string; // Assuming userId is required when creating a pet for a specific user

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(PetType)
  @IsNotEmpty()
  type: PetType;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsString()
  specialNeeds?: string;

  @IsOptional()
  @IsString()
  dietaryRestrictions?: string;

  @IsOptional()
  @IsString()
  behaviorNotes?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

export class UpdatePetDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEnum(PetType)
  type?: PetType;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsString()
  specialNeeds?: string;

  @IsOptional()
  @IsString()
  dietaryRestrictions?: string;

  @IsOptional()
  @IsString()
  behaviorNotes?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
