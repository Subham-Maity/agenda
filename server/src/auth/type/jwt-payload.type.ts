export type JwtPayload = {
  email: string;
  sub: string;
  roleId: string;
  permissionIds: string[];
};

export interface TokenUser {
  sub: string;
  email: string;
  roleId: string;
  permissionIds: string[];
  iat: number;
  exp: number;
}
