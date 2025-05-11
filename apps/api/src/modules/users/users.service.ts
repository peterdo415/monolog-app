// apps/api/src/api.service.ts
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { db }                from '@monolog/db/client';
import { users }             from '@monolog/db/schema';
import type { CreateUserDto } from '@monolog/api/dto/create-user.dto';
import type { User }         from '@monolog/db/types';


@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  /** 全件取得 */
  async findAll(): Promise<User[]> {
    this.logger.log('findAll: retrieving all users');
    try {
      const result = await db.select().from(users);
      this.logger.log(`findAll: retrieved ${result.length} users`);
      return result;
    } catch (err) {
      this.logger.error(
        'findAll: failed to retrieve users',
        err instanceof Error ? err.stack : JSON.stringify(err),
      );
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  /** 新規作成 */
  async create(dto: CreateUserDto): Promise<User> {
    // console.log({ dto });   // todo: 削除
    // console.log(users);   // todo: 削除
    this.logger.log(
      `create: creating user with payload ${JSON.stringify(dto)}`,
    );
    try {
      // ── デバッグ用に一旦 builder を分ける
      const insertBuilder = db
        .insert(users)
        .values([{ name: dto.name, email: dto.email, password: dto.password }]);
    
      // ここで生成される SQL をログに出力
      this.logger.log('🔍 Generated SQL:', insertBuilder.toSQL());
    
      // ── 元の values／returning
      // const [created] = await db
      //   .insert(users)
      //   .values([{ name: dto.name, email: dto.email, password: dto.password }])
      //   .returning();
    
      const [created] = await insertBuilder.returning();
      this.logger.log(`create: successfully created user id=${created.id}`);
      return created;
    } catch (err) {
      this.logger.error(
        'create: failed to create user',
        err instanceof Error ? err.stack : JSON.stringify(err),
      );
      throw new InternalServerErrorException('Error creating user');
    }
  }  
}
