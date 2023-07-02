import { exec } from 'child_process';

import { PrismaClient } from '@prisma/client';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';
import { promisify } from 'util';
import { PrismaRideRepository } from './RideRepository.prisma';
import { PrismaUserRepository } from '../UserRepository/UserRepository.prisma';

const asyncExec = promisify(exec);

describe('PrismaRideRepository', () => {
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
    return prismaClient.ride.deleteMany();
  });

  test('save a Ride', async () => {
    const userRepository = new PrismaUserRepository(prismaClient);

    await userRepository.save({
      id: '1',
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex@johnson.com',
    });
    await userRepository.save({
      id: '2',
      firstName: 'Alice',
      lastName: 'Davies',
      email: 'alice@davies.com',
    });

    const rideRepository = new PrismaRideRepository(prismaClient);
    await rideRepository.save({
      id: '1',
      driver: {
        id: '1',
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@johnson.com',
      },
      departurePlace: 'London',
      departureTime: '2023-01-01T12:30:00.000Z',
      destinationPlace: 'Brighton',
      destinationTime: '2023-01-01T14:30:00.000Z',
      postedAt: '2023-01-01T04:30:00.000Z',
    });
    await rideRepository.save({
      id: '2',
      driver: {
        id: '2',
        firstName: 'Alice',
        lastName: 'Davies',
        email: 'alice@davies.com',
      },
      departurePlace: 'Liverpool',
      departureTime: '2023-01-01T12:30:00.000Z',
      destinationPlace: 'Manchester',
      destinationTime: '2023-01-01T14:30:00.000Z',
      postedAt: '2023-01-01T04:30:00.000Z',
    });

    const rides = await rideRepository.getRidesByUser('1');

    expect(rides).toStrictEqual([
      {
        id: '1',
        driver: { id: '1', name: 'Alex' },
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T14:30:00.000Z',
        postedAt: '2023-01-01T04:30:00.000Z',
      },
    ]);
  });
});
