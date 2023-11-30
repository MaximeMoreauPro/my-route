import { exec } from 'child_process';

import { PrismaClient } from '@prisma/client';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { promisify } from 'util';

import { Alex } from '../tests/User.test-data';

import { PrismaUserRepository } from './UserRepository.prisma';

const asyncExec = promisify(exec);

describe('PrismaUserRepository', () => {
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    const database = 'my-route-test';
    const username = 'test-user';
    const password = 'test';
    container = await new PostgreSqlContainer('postgres:15.3')
      .withDatabase(database)
      .withUsername(username)
      .withPassword(password)
      .withExposedPorts(5432)
      .start();

    const databaseUrl = `postgresql://${username}:${password}@${container.getHost()}:${container.getMappedPort(
      5432,
    )}/${database}`;

    const { stderr: stderrDeploy, stdout: stdoutDeploy } = await asyncExec(
      `DATABASE_URL=${databaseUrl}  prisma migrate deploy`,
    );

    if (stderrDeploy) {
      console.error(stderrDeploy);
    }
    if (stdoutDeploy) {
      console.log(stdoutDeploy);
    }

    const { stderr: stderrGenerate, stdout: stdoutGenerate } =
      await asyncExec(`prisma generate`);

    if (stderrGenerate) {
      console.error(stderrGenerate);
    }
    if (stdoutGenerate) {
      console.log(stdoutGenerate);
    }

    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    return prismaClient.$connect();
  }, 1000 * 30);

  afterAll(async () => {
    await container.stop({ timeout: 1000 });
    return prismaClient.$disconnect();
  });

  beforeEach(() => {
    return prismaClient.user.deleteMany();
  });

  test('save a User', async () => {
    const userRepository = new PrismaUserRepository(prismaClient);
    await userRepository.save(Alex);

    const userByEmail = await userRepository.getUserByEmail(Alex.email);

    expect(userByEmail?.id).toEqual(Alex.id);

    const userById = await userRepository.getUser(Alex.id);
    expect(userById?.email).toEqual(Alex.email);
  });
});
