import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for frontend access
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0'); // Listen on all interfaces
}

// Check if running in Vercel environment
if (process.env.VERCEL) {
  // Do nothing, let the export default handle it
} else {
  bootstrap();
}

// Export specific handler for Vercel
export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.init();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};
