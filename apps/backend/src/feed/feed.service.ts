import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prismaService: PrismaService) {}
  async getLatest() {
    const result = await this.prismaService.video.findMany({
      take: 10,
      include: {
        thumbnail: {
          select: {
            medium: true,
          },
        },
        author: {
          select: {
            id: true,
            nickname: true,
            picture: {
              include: {
                small: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        AND: [
          {
            status: 'READY',
          },
          {
            visibility: 'PUBLIC',
          },
        ],
      },
    });

    return { data: result };
  }

  async getSubscriptionsFeed(userId: string) {
    const { subscriptions } = await this.prismaService.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        subscriptions: {
          select: {
            id: true,
          },
        },
      },
    });

    const subIds = subscriptions.map((sub) => sub.id);

    const result = await this.prismaService.video.findMany({
      take: 10,
      include: {
        thumbnail: {
          select: {
            medium: true,
          },
        },
        author: {
          select: {
            id: true,
            nickname: true,
            picture: {
              include: {
                small: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        AND: [
          {
            status: 'READY',
          },
          {
            visibility: 'PUBLIC',
          },
          {
            authorId: {
              in: subIds,
            },
          },
        ],
      },
    });

    return { data: result };
  }
}
