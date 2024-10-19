import { Injectable } from '@nestjs/common';

import { ImageService } from '@august-tv/server/modules';
import { DbFileService } from '@august-tv/server/modules';
import { PrismaService } from '@august-tv/server/modules';
import { IWithPermissions, TActionType } from 'src/common/IWithPermissions';
import { UserService } from 'src/user/user.service';
import { PatchMedia } from './media.dto';

export type TTempFile = {
  originalname: string;
  path: string;
};

@Injectable()
export class MediaService implements IWithPermissions {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
    private readonly dbFileService: DbFileService,
    private readonly userService: UserService,
  ) {}

  async getPermissionsForUser(
    id: string,
    userId: string | undefined,
  ): Promise<readonly TActionType[]> {
    if (userId && (await this.userService.isAdmin(userId))) {
      return ['READ', 'WRITE', 'DELETE'];
    }
    const video = await this.prisma.video.findFirstOrThrow({
      where: { id },
    });
    if (video.authorId === userId) {
      return ['READ', 'WRITE', 'DELETE'];
    }

    if (video.visibility === 'PUBLIC' && video.status === 'READY') {
      return ['READ'];
    }

    return [];
  }

  async assertPermissionsForUser(
    objectId: string,
    userId: string | undefined,
    action: TActionType,
  ): Promise<void> {
    const permissions = await this.getPermissionsForUser(objectId, userId);
    if (!permissions.includes(action)) {
      throw new Error('Permission denied');
    }
  }

  async getMediaById(id: string, userId: string | undefined) {
    return this.prisma.video.findUniqueOrThrow({
      where: { id },
      include: {
        master: true,
        author: {
          select: {
            id: true,
            nickname: true,
            subscribersCount: true,
            picture: {
              include: {
                small: true,
              },
            },
          },
        },
        rates: {
          where: {
            userId: userId ?? 'NO_USER',
          },
        },
      },
    });
  }

  async patch(id: string, data: PatchMedia.Body) {
    return this.prisma.video.update({
      where: { id },
      data: {
        description: data.description,
        title: data.title,
        visibility: data.visibility,
      },
    });
  }

  async getUserMedia(user: any) {
    return this.prisma.video.findMany({
      where: {
        AND: [
          { authorId: user.uid },
          {
            status: {
              not: 'DELETED',
            },
          },
        ],
      },
      include: {
        thumbnail: {
          include: {
            large: true,
            medium: true,
            small: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(id: string) {
    const {
      fileSet: { files },
      thumbnailSet: { images },
    } = await this.prisma.video.findUniqueOrThrow({
      where: { id },
      include: {
        fileSet: {
          include: {
            files: true,
          },
        },
        thumbnailSet: {
          include: {
            images: {
              include: {
                large: true,
                medium: true,
                small: true,
                original: true,
              },
            },
          },
        },
      },
    });

    await Promise.all(files.map((file) => this.dbFileService.delete(file)));

    await Promise.all(
      images.map((image) => this.imageService.delete(image.id)),
    );

    this.prisma.imported.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return this.prisma.video.update({
      where: { id },
      data: {
        status: 'DELETED',
      },
    });
  }

  async rate(id: string, userId: string, type: 'LIKE' | 'DISLIKE' | null) {
    return this.prisma.$transaction(async (tx) => {
      const prevRating = await tx.rating.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId: id,
          },
        },
      });

      await tx.rating.upsert({
        where: {
          userId_videoId: {
            userId,
            videoId: id,
          },
        },
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
          video: {
            connect: {
              id,
            },
          },
          type,
        },
        update: {
          type,
        },
      });

      let incrementLikes = 0;
      let incrementDislikes = 0;

      if (prevRating) {
        if (prevRating.type === 'LIKE') {
          if (type === 'LIKE') {
            incrementLikes = 0;
          } else if (type === 'DISLIKE') {
            incrementLikes -= 1;
            incrementDislikes += 1;
          } else {
            incrementLikes -= 1;
          }
        } else if (prevRating.type === 'DISLIKE') {
          if (type === 'DISLIKE') {
            incrementDislikes = 0;
          } else if (type === 'LIKE') {
            incrementDislikes -= 1;
            incrementLikes += 1;
          } else {
            incrementDislikes -= 1;
          }
        } else {
          if (type === 'LIKE') {
            incrementLikes += 1;
          } else if (type === 'DISLIKE') {
            incrementDislikes += 1;
          }
        }
      } else {
        if (type === 'LIKE') {
          incrementLikes += 1;
        } else if (type === 'DISLIKE') {
          incrementDislikes += 1;
        }
      }

      const { likesCount, dislikesCount } = await tx.video.update({
        where: { id },
        data: {
          likesCount: {
            increment: incrementLikes,
          },
          dislikesCount: {
            increment: incrementDislikes,
          },
        },
      });

      return { likesCount, dislikesCount, type };
    });
  }
}
