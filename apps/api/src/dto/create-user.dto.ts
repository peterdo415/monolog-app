// apps/api/src/users/dto/create-user.dto.ts
import { IsString, IsEmail, Length, IsPassportNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()               // 文字列であることを保証
  @Length(1, 255)           // 長さ制約
  readonly name!: string;

  @IsEmail()                // メール形式を保証
  @Length(5, 255)
  readonly email!: string;

  @IsString()
  @Length(4, 255)
  readonly password!: string;
}
