import { StorageService } from "../storage/storage.service";
import { PrismaService } from "../prisma/prisma.service";
import { DbFileService } from "../db-file/db-file.service";
export type TCrop = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare class ImageService {
    private readonly storageService;
    private readonly prisma;
    private readonly dbFileService;
    constructor(storageService: StorageService, prisma: PrismaService, dbFileService: DbFileService);
    getImagesSet(setId: string): Promise<({
        images: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            deleted: boolean;
            ownerId: string;
            setId: string | null;
            originalHeight: number;
            originalWidth: number;
            smallId: string;
            mediumId: string;
            largeId: string;
            originalId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deleted: boolean;
    }) | null>;
    upload(filename: string, { crop, ownerId, isProfilePicture, setId, }: {
        ownerId: string;
        isProfilePicture?: boolean;
        crop?: TCrop;
        setId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deleted: boolean;
        ownerId: string;
        setId: string | null;
        originalHeight: number;
        originalWidth: number;
        smallId: string;
        mediumId: string;
        largeId: string;
        originalId: string;
    }>;
    changeCrop(imageId: string, crop: TCrop): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deleted: boolean;
        ownerId: string;
        setId: string | null;
        originalHeight: number;
        originalWidth: number;
        smallId: string;
        mediumId: string;
        largeId: string;
        originalId: string;
    }>;
    preprocess(filename: string, imageId: string, crop?: TCrop): Promise<void>;
    delete(imageId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deleted: boolean;
        ownerId: string;
        setId: string | null;
        originalHeight: number;
        originalWidth: number;
        smallId: string;
        mediumId: string;
        largeId: string;
        originalId: string;
    } | null>;
    private uploadToStorage;
    private createInDatabase;
    private updateInDatabase;
}
