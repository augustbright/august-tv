import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTagDto } from "src/dto";

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

    async createOrFindTags({ tags }: { tags: string[] }) {
        const tagNames = tags.map((tag) => tag.trim().toLowerCase());
        const existingTags = await this.prismaService.tag.findMany({
            where: {
                name: {
                    in: tagNames,
                },
            },
            select: {
                id: true,
                name: true,
            },
        });
        const existingTagNames = existingTags.map((tag) => tag.name);
        const newTags = tagNames.filter(
            (tagName) => !existingTagNames.includes(tagName)
        );
        const createdTags = await Promise.all(
            newTags.map((tagName) => this.createTag({ name: tagName }))
        );
        return [...existingTags, ...createdTags];
    }
}
