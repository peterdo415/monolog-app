import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import type { User } from '@monolog/db/types';
import { CreateUserDto } from './../../dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    console.log('🐛 NestJS received DTO:', dto);  // todo: 削除
    // await this.userService.create(dto);
    return this.userService.create(dto);
  }
}
