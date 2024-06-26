import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../type';
import { Request } from 'express';

export interface RequestWithAccessToken extends Request {
  access_token?: string;
}

const extractToken = (request: RequestWithAccessToken): string | null => {
  let token = null;
  if (request.cookies) {
    token = request.cookies['access_token'];
  } else if (request) {
    token = request.access_token;
  }
  return token;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestWithAccessToken) => {
          const token = extractToken(request);
          if (!token) {
            throw new UnauthorizedException('No access_token provided');
          }
          return token;
        },
      ]),
      secretOrKey: config.get<string>('JWT_LOCAL_AT_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
