import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import {
  AllExceptionsFilter,
  ApiDocReady,
  logApplicationDetails,
  logServerReady,
  setupGlobalPipes,
  setupSecurity
} from './common';
const port = 3333;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSecurity(app);
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());
  setupGlobalPipes(app);
  const configService = app.get(ConfigService);
  await app.listen(port);
  return configService;
}

bootstrap().then((configService) => {
  logServerReady(port);
  logApplicationDetails(configService);
  ApiDocReady(port, configService);
});
