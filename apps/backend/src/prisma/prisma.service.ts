import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // Connect to the database when the module is initialized
    await this.$connect();
  }

  async onModuleDestroy() {
    // Disconnect from the database when the module is destroyed (app shuts down)
    await this.$disconnect();
  }
}
