import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CategoriesService {
    constructor(private readonly prismaService: PrismaService) {}

    async getCategories() {
        return this.prismaService.category.findMany({
            where: {
                deleted: false,
            },
            select: {
                id: true,
                name: true,
            },
        });
    }

    async createCategory(data: { name: string }) {
        return this.prismaService.category.create({
            data: {
                name: data.name,
            },
        });
    }

    async findOrCreateCategory(data: { name: string }) {
        return this.prismaService.category.upsert({
            where: {
                name: data.name,
            },
            update: {},
            create: {
                name: data.name,
            },
        });
    }

    async updateCategory(id: number, data: { name: string }) {
        return this.prismaService.category.update({
            where: {
                id,
            },
            data: {
                name: data.name,
            },
        });
    }

    async deleteCategory(id: number) {
        return this.prismaService.category.update({
            where: {
                id,
            },
            data: {
                deleted: true,
                deletedAt: new Date(),
            },
        });
    }
}
