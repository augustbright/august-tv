import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';

export const User = createParamDecorator(
  (
    data: {
      required?: boolean;
    },
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    if (data?.required && !request.user) {
      throw new UnauthorizedException('User is required');
    }
    return request.user as DecodedIdToken; // Assuming req.user is populated, e.g., by a JWT auth guard
  },
);
