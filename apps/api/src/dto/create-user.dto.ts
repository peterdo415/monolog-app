import { IsString, IsOptional } from 'class-validator';

/**
 * DTO: 新規アイテム作成時のリクエストボディ定義
 */
export class CreateUserDto {
  name: string;
  email: string;

  constructor(data: { name: string; email: string }) {
    // 必須プロパティを明示的に初期化
    this.name = data.name;
    this.email = data.email;
  }
}
