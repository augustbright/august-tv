import { TCursorQueryParams } from "@august-tv/common/types";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { getAuth } from "firebase-admin/auth";
import { IWithPermissions } from "src/utils";
import { PrismaService } from "../prisma/prisma.service";
import { ImageService } from "../image/image.service";
import { TActionType } from "src/utils/IWithPermissions";
import { firebaseApp } from "../../firebase";
import { ImageCropDto } from "src/dto";
import { EmailService } from "../email/email.service";

@Injectable()
export class UserService implements IWithPermissions {
    private readonly logger = new Logger(UserService.name);
    constructor(
        private readonly prisma: PrismaService,
        private readonly imageService: ImageService,
        private readonly emailService: EmailService
    ) {}

    async getPermissionsForUser(
        id: string,
        userId: string | undefined
    ): Promise<readonly TActionType[]> {
        if (userId && (await this.isAdmin(userId))) {
            return ["READ", "WRITE", "DELETE"];
        }
        const object = await this.prisma.user.findFirstOrThrow({
            where: { id },
        });
        if (object.id === userId) {
            return ["READ", "WRITE", "DELETE"];
        }

        return [];
    }

    async isEmailVerified(uid: string): Promise<boolean> {
        const userRecord = await getAuth(firebaseApp).getUser(uid);
        return userRecord.emailVerified;
    }

    async sendEmailVerification(uid: string) {
        const userRecord = await getAuth(firebaseApp).getUser(uid);
        if (userRecord.emailVerified) {
            throw new Error("Email is already verified");
        }
        const userEmail = userRecord.email;
        if (!userEmail) {
            throw new Error("User does not have an email");
        }

        try {
            const link =
                await getAuth(firebaseApp).generateEmailVerificationLink(
                    userEmail
                );

            await this.emailService.sendMail({
                to: userEmail,
                subject: "Verify your email",
                text: `Please verify your email by clicking on this link: ${link}`,
                html: `<p>Please verify your email by clicking on this link: <a href="${link}">${link}</a></p>`,
            });
        } catch (error) {
            this.logger.error(error);
            throw new Error("Failed to send email verification");
        }
    }

    async assertPermissionsForUser(
        objectId: string,
        userId: string | undefined,
        action: TActionType
    ): Promise<void> {
        const permissions = await this.getPermissionsForUser(objectId, userId);
        if (!permissions.includes(action)) {
            throw new Error("Permission denied");
        }
    }

    async ensureUser(idToken: string) {
        const decodedIdToken =
            await getAuth(firebaseApp).verifyIdToken(idToken);
        const userRecord = await getAuth(firebaseApp).getUser(
            decodedIdToken.uid
        );

        let user = await this.prisma.user.findUnique({
            where: { id: userRecord.uid },
            select: {
                id: true,
                nickname: true,
                email: true,
            },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    id: userRecord.uid,
                    email: userRecord.email,
                    nickname:
                        userRecord.displayName ?? `User ${userRecord.uid}`,
                    pictureSet: {
                        create: {},
                    },
                },
                select: {
                    id: true,
                    nickname: true,
                    email: true,
                },
            });
        }

        return user;
    }

    async setProfilePicture(userId: string, imageId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                pictureId: imageId,
            },
        });
    }

    async unsetProfilePicture(userId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                pictureId: null,
            },
        });
    }

    async uploadProfilePicture(
        userId: string,
        file: Express.Multer.File,
        crop: ImageCropDto
    ) {
        const { pictureSetId } = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
        });

        const newImage = await this.imageService.upload(file.filename, {
            ownerId: userId,
            isProfilePicture: true,
            crop,
            setId: pictureSetId,
        });
        await this.setProfilePicture(userId, newImage.id);

        return newImage;
    }

    async updateProfilePicture(
        userId: string,
        imageId: string,
        crop: ImageCropDto
    ) {
        const newImage = await this.imageService.changeCrop(imageId, crop);
        await this.setProfilePicture(userId, newImage.id);

        return newImage;
    }

    async getUserById(userId: string) {
        return this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: {
                picture: {
                    include: {
                        small: true,
                        medium: true,
                        large: true,
                        original: true,
                    },
                },
            },
        });
    }

    async getProfilePictures(userId: string) {
        const { pictureSet } = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: {
                pictureSet: {
                    include: {
                        images: {
                            include: {
                                small: true,
                                medium: true,
                                large: true,
                                original: true,
                            },
                        },
                    },
                },
            },
        });

        return pictureSet;
    }

    async getRoles(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { roles: true },
        });

        return user?.roles ?? [];
    }

    async isAdmin(userId: string) {
        const roles = await this.getRoles(userId);
        return roles.some((role) => role.name === "admin");
    }

    async getUserSubscriptions(userId: string) {
        return this.prisma.user.findFirstOrThrow({
            where: { id: userId },
            select: {
                subscriptions: {
                    select: {
                        id: true,
                        nickname: true,
                        subscribersCount: true,
                        picture: {
                            select: {
                                small: true,
                                medium: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async subscribe(userId: string, targetId: string) {
        if (userId === targetId) {
            throw new BadRequestException("Cannot subscribe to yourself");
        }

        await this.prisma.$transaction([
            this.prisma.user.update({
                where: {
                    id: userId,
                    AND: [
                        { id: userId },
                        { subscriptions: { none: { id: targetId } } },
                    ],
                },
                data: {
                    subscriptions: {
                        connect: { id: targetId },
                    },
                },
            }),
            this.prisma.user.update({
                where: { id: targetId },
                data: {
                    subscribersCount: {
                        increment: 1,
                    },
                },
            }),
        ]);
    }

    async unsubscribe(userId: string, targetId: string) {
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: userId },
                data: {
                    subscriptions: {
                        disconnect: { id: targetId },
                    },
                },
            }),
            this.prisma.user.update({
                where: { id: targetId },
                data: {
                    subscribersCount: {
                        decrement: 1,
                    },
                },
            }),
        ]);
    }

    async find(
        params: {
            query: string;
        } & TCursorQueryParams
    ) {
        const limit = params.limit ?? 10;
        const users = await this.prisma.user.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { nickname: { contains: params.query } },
                            { email: { contains: params.query } },
                        ],
                    },
                    ...(params.cursor
                        ? [{ cursor: { gt: params.cursor } }]
                        : []),
                ],
            },
            include: {
                picture: {
                    select: {
                        small: {
                            select: {
                                publicUrl: true,
                            },
                        },
                    },
                },
            },
            take: limit + 1,
        });

        return {
            data: users.slice(0, limit),
            cursor: users[users.length - 1]?.cursor ?? null,
            hasMore: users.length > limit,
        };
    }
}
