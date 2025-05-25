import { IsString, IsNotEmpty, IsNumber, IsEmail } from 'class-validator';

export class CreateHouseholdDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  categoryId!: number;

  @IsNumber()
  unitId!: number;

  @IsNumber()
  locationId!: number;

  @IsNumber()
  quantity!: number;

  @IsEmail()
  userEmail!: string;
} 