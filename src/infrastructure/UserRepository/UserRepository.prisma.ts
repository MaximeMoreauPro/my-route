import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../application/UserRepository';
import { User } from '../../domain/User';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly _prisma: PrismaClient) {}

  async save(userToSave: User): Promise<void> {
    await this._prisma.user.create({
      data: userToSave,
    });
  }

  async getUser(userId: string): Promise<User | undefined> {
    const user = await this._prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async getUserByName(userName: string): Promise<User | undefined> {
    const user = await this._prisma.user.findUniqueOrThrow({
      where: {
        name: userName,
      },
    });
    return user;
  }
}
