import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { RedisService } from '../../../redis';
import { check_user_exists_guard_key_prefix_for_redis } from '../constant';

@Injectable()
export class CheckUserExistsGuard implements CanActivate {
  private readonly logger = new Logger(CheckUserExistsGuard.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const dto = request.body;

    if (dto && dto.email) {
      const cacheKey: string = `${check_user_exists_guard_key_prefix_for_redis}${dto.email}`;

      try {
        const cachedUser = await this.redisService.get(cacheKey);

        if (cachedUser) {
          this.logger.log(
            `fn: CheckUserExistsGuard, Cache hit for ${cacheKey}`,
          );
          return true;
        }
      } catch (error) {
        this.logger.error(
          `fn: CheckUserExistsGuard, Error getting data from Redis for key ${cacheKey}`,
          error,
        );
      }

      this.logger.log(`fn: canActivate, Cache miss for ${cacheKey}`);

      const existUser = await this.prismaService
        .user.findUnique({
          where: { email: dto.email },
        });

      if (!existUser) {
        throw new NotFoundException('User not found with this email!');
      }

      try {
        await this.redisService.set(cacheKey, existUser, 5000);
      } catch (error) {
        this.logger.error(
          'fn: CheckUserExistsGuard, Error setting data to Redis',
          error,
        );
      }
    }

    return true;
  }
}
