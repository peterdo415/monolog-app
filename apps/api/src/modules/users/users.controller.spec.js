"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
describe('UserController', () => {
    let userController;
    beforeEach(async () => {
        const app = await testing_1.Test.createTestingModule({
            controllers: [users_controller_1.UserController],
            providers: [users_service_1.UserService],
        }).compile();
        userController = app.get(users_controller_1.UserController);
    });
    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(userController.getHello()).toBe('Hello World!');
        });
    });
});
