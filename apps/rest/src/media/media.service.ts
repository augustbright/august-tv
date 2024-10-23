import { Injectable } from '@nestjs/common';

import {
  ImageService,
  DbFileService,
  PrismaService,
} from '@august-tv/server/modules';
import { IWithPermissions, TActionType } from 'src/common/IWithPermissions';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';
import { ImageCropDto, PatchMediaDto } from '@august-tv/server/dto';

export type TTempFile = {
  originalName: string;
  filename: string;
  path: string;
};

@Injectable()
export class MediaService implements IWithPermissions {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
    private readonly dbFileService: DbFileService,
    private readonly userService: UserService,
  ) { }

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

  async createDraft(data: Prisma.VideoCreateInput) {
    return this.prisma.video.create({ data });
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

  async getThumbnails(id: string) {
    return this.prisma.video.findFirstOrThrow({
      where: { id },
      select: {
        thumbnailSet: {
          select: {
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
        customThumbnailSet: {
          select: {
            images: {
              include: {
                large: true,
                medium: true,
                small: true,
                original: true,
              },
            },
          },
        }
      }
    });
  }

  async patch(id: string, data: PatchMediaDto) {
    let thumbnailId = data.thumbnailImageId;

    if (!thumbnailId) {
      const { images } = await this.prisma.imageSet.findFirstOrThrow({
        where: {
          video: {
            id,
          }
        },
        select: {
          images: {
            select: {
              id: true,
            },
          },
        },
      });
      thumbnailId = images[0]?.id;
    }

    return this.prisma.video.update({
      where: { id },
      data: {
        description: data.description,
        title: data.title,
        visibility: data.visibility,
        ...(thumbnailId ? {
          thumbnail: {
            connect: {
              id: thumbnailId,
            },
          }
        } : {}),
      },
    });
  }

  async uploadThumbnail({ videoId, crop, file, userId }: {
    videoId: string;
    crop: ImageCropDto;
    userId: string;
    file: TTempFile;
  }) {
    let { customThumbnailSetId } = await this.prisma.video.findFirstOrThrow({
      where: { id: videoId },
      select: {
        customThumbnailSetId: true,
      }
    });

    if (!customThumbnailSetId) {
      customThumbnailSetId = (await this.prisma.imageSet.create({
        data: {
          videoWithCustomThumbnails: {
            connect: {
              id: videoId,
            },
          },
        },
      })).id;
    }

    const newImage = await this.imageService.upload(file.filename, {
      ownerId: userId,
      isProfilePicture: false,
      crop,
      setId: customThumbnailSetId,
    });

    return newImage;
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
