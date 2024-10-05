import { Controller, Post, Req, Res, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { firebaseApp } from '../firebase';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionLoginDto } from './dto/sessionLogin.dto';
import { UserService } from './user.service';

@ApiTags('Auth')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly expiresIn = 1000 * 60 * 60 * 24 * 14;

  @Post('sessionLogin')
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: SessionLoginDto }) // Swagger will pick this up automatically
  async sessionLogin(@Req() req: Request, @Res() res: Response) {
    const idToken = req.body.idToken.toString();

    try {
      const sessionCookie = await getAuth(firebaseApp).createSessionCookie(
        idToken,
        { expiresIn: this.expiresIn },
      );

      await this.userService.ensureUser(idToken);

      const options = { maxAge: this.expiresIn, httpOnly: true, secure: true };

      // Set the session cookie
      res.cookie('session', sessionCookie, options);
      return res.status(200).end();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'UNAUTHORIZED_REQUEST' });
    }
  }

  @Get('current')
  @ApiResponse({ status: 200, description: 'Current user or null.' })
  async getCurrentUser(@Req() req: Request, @Res() res: Response) {
    return res.json(req.user);
  }

  @Post('sign-out')
  @ApiResponse({ status: 200, description: 'Sign out successful.' })
  async signOut(@Res() res: Response) {
    res.clearCookie('session');
    return res.status(200).end();
  }
}
