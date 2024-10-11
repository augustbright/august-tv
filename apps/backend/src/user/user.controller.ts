import {
  Controller,
  Post,
  Req,
  Res,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { firebaseApp } from '../firebase';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { UPLOAD_PATH } from 'src/common/fs-utils';
import { TCrop } from 'src/image/image.service';
import * as path from 'path';
import { Guard } from 'src/common/guard';
import { User } from './user.decorator';

type TCropParams = { width: string; height: string; x: string; y: string };

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly expiresIn = 1000 * 60 * 60 * 24 * 14;

  @Post('sessionLogin')
  @Guard.scope('public')
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
      return res.json({});
    } catch (error) {
      console.error(error);
      return { error: 'UNAUTHORIZED_REQUEST' };
    }
  }

  @Get('current')
  @Guard.scope('public')
  async getCurrentUser(@Req() req: Request) {
    const decoded = req.user;

    const user = decoded
      ? await this.userService.getUserById(decoded.uid)
      : null;

    return {
      data: user,
      decoded,
    };
  }

  @Post('sign-out')
  @Guard.scope('public')
  async signOut(@Res() res: Response) {
    res.clearCookie('session');
    return res.json({ status: 'success' });
  }

  @Post('uploadProfilePicture')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req, file, callback) {
        if (!file.mimetype.includes('image')) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: UPLOAD_PATH,
        filename: (req, file, cb) => {
          cb(null, `${randomUUID()}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Guard.scope('user')
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: TCropParams,
    @User({ required: true }) user: DecodedIdToken,
  ) {
    const image = await this.userService.uploadProfilePicture(user.uid, file, {
      x: parseInt(body.x),
      y: parseInt(body.y),
      width: parseInt(body.width),
      height: parseInt(body.height),
    });
    return image;
  }

  @Post('updateProfilePicture')
  @Guard.scope('user')
  async updateProfilePicture(
    @User({ required: true }) user: DecodedIdToken,
    @Body() body: { imageId: string; crop: TCrop },
  ) {
    const image = await this.userService.updateProfilePicture(
      user.uid,
      body.imageId,
      body.crop,
    );

    return image;
  }

  @Post('unsetProfilePicture')
  @Guard.scope('user')
  async unsetProfilePicture(@User({ required: true }) user: DecodedIdToken) {
    await this.userService.unsetProfilePicture(user.uid);
    return {};
  }

  @Get('profilePictures')
  @Guard.scope('user')
  async getProfilePictures(@User({ required: true }) user: DecodedIdToken) {
    const images = await this.userService.getProfilePictures(user.uid);
    return images;
  }
}
