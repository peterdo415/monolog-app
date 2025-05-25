import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UsersService],
    }).compile();

    userController = app.get<UserController>(UserController);
  });
});
