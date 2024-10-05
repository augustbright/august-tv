import { Controller, Post, Req, Res, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { firebaseApp } from '../firebase';

@Controller('user')
export class UserController {
  private readonly expiresIn = 1000 * 60 * 60 * 24 * 14;

  @Post('sessionLogin')
  async sessionLogin(@Req() req: Request, @Res() res: Response) {
    const idToken = req.body.idToken.toString();

    try {
      const sessionCookie = await getAuth(firebaseApp).createSessionCookie(
        idToken,
        { expiresIn: this.expiresIn },
      );
      const options = { maxAge: this.expiresIn, httpOnly: true, secure: true };

      // Set the session cookie
      res.cookie('session', sessionCookie, options);
      return res.json({ status: 'success' });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'UNAUTHORIZED_REQUEST' });
    }
  }

  @Get('current')
  async getCurrentUser(@Req() req: Request, @Res() res: Response) {
    // Assuming req.user is populated by some Firebase Auth middleware or guard
    return res.json(req.user);
  }

  @Post('sign-out')
  async signOut(@Res() res: Response) {
    res.clearCookie('session');
    return res.json({ status: 'success' });
  }
}
