import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    async onModuleInit() {
        // Connect to the database when the module is initialized
        await this.$connect();

        process.on("SIGTERM", this.shutdown.bind(this));
        process.on("SIGINT", this.shutdown.bind(this));

        await this.ensureAdminUser();
    }

    async onModuleDestroy() {
        // Disconnect from the database when the module is destroyed (app shuts down)
        await this.shutdown();
    }

    private async shutdown() {
        await this.$disconnect();
    }

    private async ensureAdminUser() {
        let adminRole = await this.role.findFirst({
            where: {
                name: "admin",
            },
        });

        if (!adminRole) {
            adminRole = await this.role.create({
                data: {
                    name: "admin",
                },
            });
        }

        const users = await this.user.findMany({
            include: {
                roles: true,
            },
            take: 2,
        });

        if (
            users.length === 1 &&
            users[0].roles.every((role) => role.name !== "admin")
        ) {
            await this.user.update({
                where: {
                    id: users[0].id,
                },
                data: {
                    roles: {
                        connect: {
                            id: adminRole.id,
                        },
                    },
                },
            });
        }
    }
}
