import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {LoggerMiddleware, validateConfig} from "./common";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: validateConfig,
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
