import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prismaService: PrismaService) {}
  async getLatest() {
    const result = await this.prismaService.video.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: result };
  }
}
