"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// apps/api/src/main.ts
require("tsconfig-paths/register");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    // AppModule を渡すことで ConfigModule も読み込まれる
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const port = config.get('API_PORT', 3001);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    await app.listen(port);
}
bootstrap();
