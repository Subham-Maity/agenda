import { CookieOptions } from 'express';
import {isProduction} from "../../../isProduction";


const cookieBaseOptions: CookieOptions = {
  httpOnly: true,
  sameSite: isProduction() ? 'strict' : 'lax',
};

const accessTokenExpirationTime = isProduction()
  ? 30 * 60 * 1000
  : 15 * 60 * 1000; // 30 minutes in production, 15 minutes in development
const refreshTokenExpirationTime = 7 * 24 * 60 * 60 * 1000; // 7 days

export const cookieOptionsAt: CookieOptions = {
  ...cookieBaseOptions,
  maxAge: accessTokenExpirationTime,
  expires: new Date(Date.now() + accessTokenExpirationTime),
  secure: isProduction(),
};

export const cookieOptionsRt: CookieOptions = {
  ...cookieBaseOptions,
  maxAge: refreshTokenExpirationTime,
  expires: new Date(Date.now() + refreshTokenExpirationTime),
  secure: isProduction(),
};
