import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEnum,
  Matches,
  IsObject,
} from "class-validator";
import { AuthProvider, UserProfile, PetProfile } from "../entities/user.entity";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsEnum(AuthProvider)
  provider?: AuthProvider;

  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @IsObject()
  profile?: Partial<UserProfile>;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class SocialLoginDto {
  @IsString()
  token: string;

  @IsEnum(AuthProvider)
  provider: AuthProvider;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class VerifyEmailDto {
  @IsString()
  token: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsObject()
  profile: Partial<UserProfile>;
}

export class AddPetDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  breed: string;

  @IsString()
  age: number;

  @IsString()
  weight: number;

  @IsOptional()
  @IsString()
  specialNeeds?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string[];
}

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  age?: number;

  @IsOptional()
  @IsString()
  weight?: number;

  @IsOptional()
  @IsString()
  specialNeeds?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string[];
}
