"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
/**
 * DTO: 新規アイテム作成時のリクエストボディ定義
 */
class CreateUserDto {
    name;
    email;
    constructor(data) {
        // 必須プロパティを明示的に初期化
        this.name = data.name;
        this.email = data.email;
    }
}
exports.CreateUserDto = CreateUserDto;
