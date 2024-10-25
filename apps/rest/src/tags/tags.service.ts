import { CreateTagDto } from '@august-tv/server/dto';
import { PrismaService } from '@august-tv/server/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) {}

  async searchTags(query: string) {
    return this.prismaService.tag.findMany({
      where: {
        name: {
          contains: query.trim().toLowerCase(),
        },
      },
      take: 10,
      select: {
        id: true,
        name: true,
      },
    });
  }

  async createTag({ name }: CreateTagDto) {
    return this.prismaService.tag.create({
      data: {
        name: name.trim().toLowerCase(),
      },
    });
  }
}
