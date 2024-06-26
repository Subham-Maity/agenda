import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';

import { RedisService } from '../../../redis';
import { check_unique_email_guard_key_prefix_for_redis } from '../constant';
import {PrismaService} from "../../../prisma";

@Injectable()
export class CheckUniqueEmailGuard implements CanActivate {
  private readonly logger = new Logger(CheckUniqueEmailGuard.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const dto = request.body;

    if (dto && dto.email) {
      const cacheKey: string = `${check_unique_email_guard_key_prefix_for_redis}${dto.email}`;

      try {
        const cachedUser = await this.redisService.get(cacheKey);

        if (cachedUser) {
          this.logger.log(
            `fn: CheckUniqueEmailGuard, Cache hit for ${cacheKey}`,
          );
          throw new BadRequestException('User already exists with this email!');
        }
      } catch (error) {
        this.logger.error(
          `fn: CheckUniqueEmailGuard, Error getting data from Redis for key ${cacheKey}`,
          error,
        );
      }

      this.logger.log(`fn: CheckUniqueEmailGuard, Cache miss for ${cacheKey}`);

      const existUser = await this.prismaService
        .user.findUnique({
          where: { email: dto.email },
        });

      if (existUser) {
        try {
          await this.redisService.set(cacheKey, existUser, 5000);
        } catch (error) {
          this.logger.error(
            'fn: CheckUniqueEmailGuard, Error setting data to Redis',
            error,
          );
        }
        throw new BadRequestException('User already exists with this email!');
      }
    }

    return true;
  }
}