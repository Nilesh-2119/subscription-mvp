"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
if (process.env.VERCEL) {
}
else {
    bootstrap();
}
exports.default = async (req, res) => {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    await app.init();
    const instance = app.getHttpAdapter().getInstance();
    return instance(req, res);
};
//# sourceMappingURL=main.js.map