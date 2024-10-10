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
          include: {
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
}
