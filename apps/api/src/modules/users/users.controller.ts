import { Controller, Get } from '@nestjs/common';
import { UserService } from './users.service';
import type { User } from '@monolog/db/types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
