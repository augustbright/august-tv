import { Injectable } from '@nestjs/common';
import { getAuth } from 'firebase-admin/auth';
import { firebaseApp } from 'src/firebase';
import { ImageService, TCrop } from 'src/image/image.service';
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
          pictureSet: {
            create: {},
          },
        },
      });
    }
  }

  async setProfilePicture(userId: string, imageId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        pictureId: imageId,
      },
    });
  }

  async unsetProfilePicture(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        pictureId: null,
      },
    });
  }

  async uploadProfilePicture(
    userId: string,
    file: Express.Multer.File,
    crop: TCrop,
  ) {
    const { pictureSetId } = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const newImage = await this.imageService.upload(file.filename, {
      ownerId: userId,
      isProfilePicture: true,
      crop,
      setId: pictureSetId,
    });
    await this.setProfilePicture(userId, newImage.id);

    return newImage;
  }

  async updateProfilePicture(userId: string, imageId: string, crop: TCrop) {
    const newImage = await this.imageService.changeCrop(imageId, crop);
    await this.setProfilePicture(userId, newImage.id);

    return newImage;
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        picture: {
          include: {
            small: true,
            medium: true,
            large: true,
            original: true,
          },
        },
      },
    });
  }

  async getProfilePictures(userId: string) {
    const { pictureSet } = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        pictureSet: {
          include: {
            images: {
              include: {
                small: true,
                medium: true,
                large: true,
                original: true,
              },
            },
          },
        },
      },
    });

    return pictureSet;
  }
}
