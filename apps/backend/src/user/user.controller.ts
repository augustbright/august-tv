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
import { getAuth } from 'firebase-admin/auth';
import { firebaseApp } from '../firebase';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { UPLOAD_PATH } from 'src/common/fs-utils';
import { TCrop } from 'src/image/image.service';
import * as path from 'path';

type TCropParams = { width: string; height: string; x: string; y: string };

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly expiresIn = 1000 * 60 * 60 * 24 * 14;

  @Post('sessionLogin')
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
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: TCropParams,
    @Req() req: Request,
  ) {
    const image = await this.userService.uploadProfilePicture(
      req.user.uid,
      file,
      {
        x: parseInt(body.x),
        y: parseInt(body.y),
        width: parseInt(body.width),
        height: parseInt(body.height),
      },
    );
    return image;
  }

  @Post('updateProfilePicture')
  async updateProfilePicture(
    @Req() req: Request,
    @Body() body: { imageId: string; crop: TCrop },
  ) {
    const image = await this.userService.updateProfilePicture(
      req.user.uid,
      body.imageId,
      body.crop,
    );

    return image;
  }

  @Post('unsetProfilePicture')
  async unsetProfilePicture(@Req() req: Request) {
    await this.userService.unsetProfilePicture(req.user.uid);
    return {};
  }

  @Get('profilePictures')
  async getProfilePictures(@Req() req: Request) {
    const images = await this.userService.getProfilePictures(req.user.uid);
    return images;
  }
}
