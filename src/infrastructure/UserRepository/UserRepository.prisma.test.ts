import { exec } from 'child_process';

import { PrismaClient } from '@prisma/client';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';
import { promisify } from 'util';
import { PrismaUserRepository } from './UserRepository.prisma';

const asyncExec = promisify(exec);

describe('PrismaUserRepository', () => {
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;
  beforeAll(async () => {
    const database = 'my-route-test';
    const username = 'test-user';
    const password = 'test';
    container = await new PostgreSqlContainer()
      .withDatabase(database)
      .withUsername(username)
      .withPassword(password)
      .withExposedPorts(5432)
      .start();

    const databaseUrl = `postgresql://${username}:${password}@${container.getHost()}:${container.getMappedPort(
      5432
    )}/${database}`;

    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    await asyncExec(`DATABASE_URL=${databaseUrl} npx prisma migrate deploy`);

    return prismaClient.$connect();
  });

  afterAll(async () => {
    await container.stop({ timeout: 1000 });
    return prismaClient.$disconnect();
  });

  beforeEach(() => {
    return prismaClient.user.deleteMany();
  });

  test('save a User', async () => {
    const userRepository = new PrismaUserRepository(prismaClient);
    await userRepository.save({ id: '1', name: 'Alice' });

    const userByName = await userRepository.getUserByName('Alice');

    expect(userByName?.id).toEqual('1');

    const userById = await userRepository.getUser('1');
    expect(userById?.name).toEqual('Alice');
  });
});
