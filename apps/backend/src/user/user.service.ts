import { Injectable } from '@nestjs/common';
import { getAuth } from 'firebase-admin/auth';
import { firebaseApp } from 'src/firebase';
import { ImageService } from 'src/image/image.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
  ) {}
  async ensureUser(idToken: string) {
    const decodedIdToken = await getAuth(firebaseApp).verifyIdToken(idToken);
    const userRecord = await getAuth(firebaseApp).getUser(decodedIdToken.uid);

    const existingUser = await this.prisma.user.findUnique({
      where: { id: userRecord.uid },
      select: { id: true },
    });

    if (!existingUser) {
      await this.prisma.user.create({
        data: {
          id: userRecord.uid,
          email: userRecord.email,
          nickname: userRecord.displayName,
          // TODO: avatar from userRecord.photoURL
        },
      });
    }
  }

  async updateProfilePicture(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const image = await this.imageService.uploadImage(file, {
      ownerId: userId,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarId: image.id,
      },
    });

    return image;
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
