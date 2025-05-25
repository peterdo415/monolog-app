// apps/api/src/api.service.ts
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { db }                from '@monolog/db/client';
import { users }             from '@monolog/db/schema';
import type { CreateUserDto } from '../../dto/create-user.dto.js';
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
    this.logger.log(
      `create: creating user with payload ${JSON.stringify(dto)}`,
    );
    try {
      const [created] = await db
        .insert(users)
        .values([{ name: dto.name, email: dto.email, password: dto.password }])
        .returning();
    
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
