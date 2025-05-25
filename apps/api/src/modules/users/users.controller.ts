import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service.js';
import type { User } from '@monolog/db/types';
import { CreateUserDto } from './../../dto/create-user.dto.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }
}
