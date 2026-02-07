import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for frontend access
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0'); // Listen on all interfaces
}
bootstrap();
