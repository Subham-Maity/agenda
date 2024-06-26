import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtVerifyService {
  constructor(private jwtService: JwtService) {}

  verify(token: string, secret: string): any {
    try {
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
