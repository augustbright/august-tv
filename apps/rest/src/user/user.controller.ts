import {
  Controller,
  Post,
  Req,
  Res,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { UPLOAD_PATH } from '@august-tv/server/fs-utils';
import * as path from 'path';
import { Guard } from '@august-tv/server/utils';
import { User } from './user.decorator';
import { JobsService, UserService } from '@august-tv/server/modules';
import { ImageCropDto } from '@august-tv/server/dto';
import { firebaseApp } from '@august-tv/server';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly jobsService: JobsService,
  ) {}
  private readonly expiresIn = 1000 * 60 * 60 * 24 * 14;

  @Post('sessionLogin')
  @Guard.scope('public')
  async sessionLogin(@Req() req: Request, @Res() res: Response) {
    const idToken = req.body.idToken.toString();

    const sessionCookie = await getAuth(firebaseApp).createSessionCookie(
      idToken,
      { expiresIn: this.expiresIn },
    );

    const user = await this.userService.ensureUser(idToken);

    const options = { maxAge: this.expiresIn, httpOnly: true, secure: true };

    // Set the session cookie
    res.cookie('session', sessionCookie, options);
    res.json(user);
    return user;
  }

  @Get('current')
  @Guard.scope('public')
  async getCurrentUser(@Req() req: Request) {
    const decoded = req.user;

    if (decoded) {
      const promiseUser = this.userService.getUserById(decoded.uid);
      const promiseRoles = this.userService.getRoles(decoded.uid);

      return {
        data: await promiseUser,
        roles: await promiseRoles,
        decoded,
        emailVerified:
          decoded.email_verified ||
          (await this.userService.isEmailVerified(decoded.uid)),
      };
    } else {
      return null;
    }
  }

  @Post('send-verification-email')
  @Guard.scope('user')
  async sendVerificationEmail(@User({ required: true }) user: DecodedIdToken) {
    await this.userService.sendEmailVerification(user.uid);
    return {};
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
    @Body() body: ImageCropDto,
    @User({ required: true }) user: DecodedIdToken,
  ) {
    const image = await this.userService.uploadProfilePicture(
      user.uid,
      file,
      body,
    );
    return image;
  }

  @Post('updateProfilePicture')
  @Guard.scope('user')
  async updateProfilePicture(
    @User({ required: true }) user: DecodedIdToken,
    @Body() body: { imageId: string; crop: ImageCropDto },
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

  @Get('mySubscriptions')
  @Guard.scope('user')
  async getMySubscriptions(@User({ required: true }) user: DecodedIdToken) {
    const subscriptions = await this.userService.getUserSubscriptions(user.uid);
    return subscriptions;
  }

  @Post('subscribe')
  @Guard.scope('user')
  async subscribe(
    @User({ required: true }) user: DecodedIdToken,
    @Body() body: { authorId: string },
  ) {
    await this.userService.subscribe(user.uid, body.authorId);
    return {};
  }

  @Post('unsubscribe')
  @Guard.scope('user')
  async unsubscribe(
    @User({ required: true }) user: DecodedIdToken,
    @Body() body: { authorId: string },
  ) {
    await this.userService.unsubscribe(user.uid, body.authorId);
    return {};
  }

  @Get('myJobs')
  @Guard.scope('user')
  async getMyJobs(@User({ required: true }) user: DecodedIdToken) {
    return this.jobsService.getJobsObservedByUser(user.uid);
  }

  @Post('unobserveJob')
  @Guard.scope('user')
  async unobserveJob(
    @User({ required: true }) user: DecodedIdToken,
    @Body() body: { jobId: string },
  ) {
    return this.jobsService.unobserveJob(body.jobId, user.uid);
  }

  @Get('/search')
  @Guard.scope('admin')
  async searchUsers(
    @Param('q') query: string,
    @Param('limit') limit?: string,
    @Param('cursor') cursor?: string,
  ) {
    return this.userService.find({
      query,
      cursor: cursor ? parseInt(cursor) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }
}
