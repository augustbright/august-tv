import { StorageService } from "../storage/storage.service";
import { PrismaService } from "../prisma/prisma.service";
import { File } from "@prisma/client";
export declare class DbFileService {
    private readonly storageService;
    private readonly prisma;
    constructor(storageService: StorageService, prisma: PrismaService);
    delete(file: File): Promise<{
        filename: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deleted: boolean;
        fileSetId: string | null;
        path: string;
        publicUrl: string;
    }>;
}
