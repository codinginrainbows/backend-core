import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsInt,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsNotEmpty()
  @IsInt()
  companyId: number;
}
