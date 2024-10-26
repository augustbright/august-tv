import { Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import sharp from "sharp";
import * as path from "path";
import fs from "fs/promises";
import {
    cleanUp,
    ensureDir,
    ensureUploadPath,
    moveUploadedFile,
    resolveUploadPath,
} from "../../fs-utils";
import { StorageService } from "../storage/storage.service";
import { PrismaService } from "../prisma/prisma.service";
import { DbFileService } from "../db-file/db-file.service";
import type { File } from "@google-cloud/storage";
import { Prisma } from "@prisma/client";

export type TCrop = { x: number; y: number; width: number; height: number };

const IMAGE_SIZES = [
    { width: 200, name: "small" },
    { width: 500, name: "medium" },
    { width: 1000, name: "large" },
] as const;

type TImageSize = (typeof IMAGE_SIZES)[number]["name"];
type TImageSizeWithOriginal = TImageSize | "original";

type TSizeFileMap = Record<TImageSizeWithOriginal, File>;

@Injectable()
export class ImageService {
    private readonly logger = new Logger(ImageService.name);
    constructor(
        private readonly storageService: StorageService,
        private readonly prisma: PrismaService,
        private readonly dbFileService: DbFileService
    ) {}

    async getImagesSet(setId: string) {
        return this.prisma.imageSet.findUnique({
            where: {
                id: setId,
            },
            include: {
                images: true,
            },
        });
    }

    async upload(
        filename: string,
        {
            crop,
            ownerId,
            isProfilePicture,
            setId,
        }: {
            ownerId: string;
            isProfilePicture?: boolean;
            crop?: TCrop;
            setId: string;
        }
    ) {
        const imageId = randomUUID();
        const { originalHeight, originalWidth, sizeFileMap } =
            await this.uploadToStorage({
                filename,
                imageId,
                crop,
                ownerId,
            });

        return this.createInDatabase({
            imageId,
            ownerId,
            originalHeight,
            originalWidth,
            sizeFileMap,
            isProfilePicture,
            setId,
        });
    }

    async changeCrop(imageId: string, crop: TCrop) {
        const { ownerId, original, small, medium, large } =
            await this.prisma.image.findUniqueOrThrow({
                where: { id: imageId },
                include: {
                    original: true,
                    small: true,
                    medium: true,
                    large: true,
                },
            });

        const filename = `${randomUUID()}${path.extname(original.path)}`;
        await this.storageService.downloadFile(
            original.path,
            resolveUploadPath(filename)
        );
        const { originalHeight, originalWidth, sizeFileMap } =
            await this.uploadToStorage({
                filename,
                imageId,
                crop,
                ownerId,
            });

        const newImage = await this.updateInDatabase({
            imageId,
            originalHeight,
            originalWidth,
            sizeFileMap,
        });

        await this.prisma.file.deleteMany({
            where: {
                id: {
                    in: [original.id, small.id, medium.id, large.id],
                },
            },
        });

        this.storageService.deleteFile(original.path);
        this.storageService.deleteFile(small.path);
        this.storageService.deleteFile(medium.path);
        this.storageService.deleteFile(large.path);

        return newImage;
    }

    async preprocess(
        filename: string,
        imageId: string,
        crop?: TCrop
    ): Promise<void> {
        for (const size of IMAGE_SIZES) {
            const resizedImagePath = resolveUploadPath(
                imageId,
                `${size.name}-${filename}`
            );

            let result = sharp(resolveUploadPath(filename));
            if (crop) {
                result = result.extract({
                    left: crop.x,
                    top: crop.y,
                    width: crop.width,
                    height: crop.height,
                });
            }
            result = result.resize({ width: size.width });
            await result.toFile(resizedImagePath);
        }
    }

    async createMultipleSizes({ originalPath }: { originalPath: string }) {
        const originalDir = path.dirname(originalPath);
        const name = path.basename(originalPath);
        const extension = path.extname(name);
        const folderName = path.basename(name, extension);
        const resizedDir = path.join(originalDir, folderName);
        await ensureDir(resizedDir);

        await Promise.all(
            IMAGE_SIZES.map(async (size) => {
                const filename = `${size.name}${extension}`;
                const filePath = path.join(resizedDir, filename);
                await sharp(originalPath)
                    .resize({ width: size.width })
                    .toFile(filePath);
            })
        );

        const { width: originalWidth, height: originalHeight } =
            await sharp(originalPath).metadata();

        await fs.rename(
            originalPath,
            path.join(resizedDir, `original${extension}`)
        );

        return {
            originalHeight: originalHeight!,
            originalWidth: originalWidth!,
            resizedDir,
        };
    }

    async delete(imageId: string) {
        const image = await this.prisma.image.findUnique({
            where: { id: imageId },
            include: {
                original: true,
                medium: true,
                small: true,
                large: true,
            },
        });

        if (!image) {
            return null;
        }

        const deletedImage = await this.prisma.image.update({
            where: { id: imageId },
            data: {
                deleted: true,
                deletedAt: new Date(),
            },
        });

        await Promise.all([
            this.dbFileService.delete(image.original),
            this.dbFileService.delete(image.medium),
            this.dbFileService.delete(image.small),
            this.dbFileService.delete(image.large),
        ]);

        return deletedImage;
    }

    async downloadByUrl(url: string, outputPath: string) {
        const response = await fetch(url);
        if (!response.ok) {
            this.logger.error(`Failed to download image from ${url}`);
            throw new Error(`Failed to download image from ${url}`);
        }

        const buffer = await response.arrayBuffer();
        await fs.writeFile(outputPath, Buffer.from(buffer));
    }

    private async uploadToStorage({
        filename,
        ownerId,
        imageId,
        crop,
    }: {
        filename: string;
        ownerId: string;
        crop?: TCrop;
        imageId: string;
    }) {
        try {
            await ensureUploadPath(imageId);
            const { width: originalWidth, height: originalHeight } =
                await sharp(resolveUploadPath(filename)).metadata();

            await this.preprocess(filename, imageId, crop);
            await moveUploadedFile(filename, imageId, `original-${filename}`);

            const storageFiles = await this.storageService.uploadFromFolder(
                imageId,
                `images/${ownerId}/${imageId}`
            );

            const sizeFileMap = storageFiles.reduce((acc, file) => {
                const filename = path.basename(file.name);
                const size = filename.split("-")[0];
                return { ...acc, [size]: file };
            }, {}) as TSizeFileMap;

            return {
                originalHeight: originalHeight!,
                originalWidth: originalWidth!,
                sizeFileMap,
            };
        } finally {
            cleanUp(imageId);
            cleanUp(filename);
        }
    }

    private async createInDatabase({
        imageId,
        originalHeight,
        originalWidth,
        ownerId,
        sizeFileMap,
        setId,
    }: {
        imageId: string;
        originalWidth: number;
        originalHeight: number;
        ownerId: string;
        isProfilePicture?: boolean;
        sizeFileMap: TSizeFileMap;
        setId: string;
    }) {
        const filesConfigs = Object.fromEntries(
            Object.entries(sizeFileMap).map(([size, file]) => [
                size,
                {
                    create: {
                        filename: path.basename(file.name),
                        path: file.name,
                        publicUrl: file.publicUrl(),
                    },
                },
            ])
        ) as any;

        return this.prisma.image.create({
            data: {
                id: imageId,
                originalWidth,
                originalHeight,
                owner: {
                    connect: {
                        id: ownerId,
                    },
                },
                set: {
                    connect: {
                        id: setId,
                    },
                },
                ...filesConfigs,
            },
        });
    }

    private async updateInDatabase({
        imageId,
        originalHeight,
        originalWidth,
        sizeFileMap,
    }: {
        imageId: string;
        originalWidth: number;
        originalHeight: number;
        sizeFileMap: TSizeFileMap;
    }) {
        const filesConfigs = Object.fromEntries(
            Object.entries(sizeFileMap).map(([size, file]) => [
                size,
                {
                    create: {
                        filename: path.basename(file.name),
                        path: file.name,
                        publicUrl: file.publicUrl(),
                    } satisfies Prisma.FileCreateInput,
                },
            ])
        );

        return this.prisma.image.update({
            where: { id: imageId },
            data: {
                originalWidth,
                originalHeight,
                ...filesConfigs,
            },
        });
    }
}
