import { Injectable } from '@nestjs/common';
import { getAuth } from 'firebase-admin/auth';
import { firebaseApp } from 'src/firebase';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async ensureUser(idToken: string) {
    const decodedIdToken = await getAuth(firebaseApp).verifyIdToken(idToken);
    const userRecord = await getAuth(firebaseApp).getUser(decodedIdToken.uid);

    const existingUser = await this.prisma.user.findUnique({
      where: { id: userRecord.uid },
      select: { id: true },
    });

    if (!existingUser) {
      await this.prisma.user.create({
        data: {
          id: userRecord.uid,
          email: userRecord.email,
          nickname: userRecord.displayName,
          // TODO: avatar from userRecord.photoURL
        },
      });
    }
  }
}
