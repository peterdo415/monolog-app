"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// apps/api/src/api.service.ts
const common_1 = require("@nestjs/common");
const client_1 = require("@monolog/db/client");
const schema_1 = require("@monolog/db/schema");
let UserService = UserService_1 = class UserService {
    logger = new common_1.Logger(UserService_1.name);
    /** 全件取得 */
    async findAll() {
        this.logger.log('findAll: retrieving all users');
        try {
            const result = await client_1.db.select().from(schema_1.users);
            this.logger.log(`findAll: retrieved ${result.length} users`);
            return result;
        }
        catch (err) {
            this.logger.error('findAll: failed to retrieve users', err instanceof Error ? err.stack : JSON.stringify(err));
            throw new common_1.InternalServerErrorException('Error fetching users');
        }
    }
    /** 新規作成 */
    async create(dto) {
        this.logger.log(`create: creating user with payload ${JSON.stringify(dto)}`);
        try {
            const [created] = await client_1.db
                .insert(schema_1.users)
                .values([{ name: dto.name, email: dto.email }])
                .returning();
            this.logger.log(`create: successfully created user id=${created.id}`);
            return created;
        }
        catch (err) {
            this.logger.error('create: failed to create user', err instanceof Error ? err.stack : JSON.stringify(err));
            throw new common_1.InternalServerErrorException('Error creating user');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)()
], UserService);
