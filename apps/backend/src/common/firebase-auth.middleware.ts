import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { firebaseApp } from '../firebase';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    req.user = null;
    const sessionCookie = req.cookies?.session || '';

    if (!sessionCookie) {
      next();
      return;
    }

    try {
      const decodedClaims = await getAuth(firebaseApp).verifySessionCookie(
        sessionCookie,
        true,
      );

      req.user = decodedClaims;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
