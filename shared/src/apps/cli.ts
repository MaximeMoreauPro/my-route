#!/usr/bin/env node

import { Command } from 'commander';
import { PrismaClient } from '@prisma/client';

import {
  PostRideCommand,
  PostRideUseCase,
} from '../application/use-cases/PostRide.use-case';
import {
  ViewUserRidesUseCase,
  ViewUserRidesQuery,
} from '../application/use-cases/ViewUserRides/ViewUserRides.use-case';

import { PrismaRideRepository } from '../infrastructure/RideRepository/RideRepository.prisma';
import { RealDateProvider } from '../infrastructure/DateProvider/DateProvider.real';
import { UUIDv4IdProvider } from '../infrastructure/IdProvider/IdProvider.uuidv4';
import {
  CreateUserCommand,
  CreateUserUseCase,
} from '../application/use-cases/CreateUser.use-case';
import { PrismaUserRepository } from '../infrastructure/UserRepository/UserRepository.prisma';

const prismaClient = new PrismaClient();

const userRepository = new PrismaUserRepository(prismaClient);

const rideRepository = new PrismaRideRepository(prismaClient);
const dateProvider = new RealDateProvider();
const idProvider = new UUIDv4IdProvider();

const createUserUseCase = new CreateUserUseCase(userRepository, idProvider);

const postRideUseCase = new PostRideUseCase(
  rideRepository,
  dateProvider,
  idProvider,
);
const viewUserRidesUseCase = new ViewUserRidesUseCase(rideRepository);
const cli = new Command();

cli
  .description('My Route CLI')
  .version('0.0.1')
  .addCommand(
    new Command('create-user')
      .description('create a user')
      .argument('<user-first-name>', 'the user first name')
      .argument('<user-last-name>', 'the user last name')
      .argument('<email>', 'the user email')
      .action(async (firstName, lastName, email) => {
        const createUserCommand: CreateUserCommand = {
          firstName,
          lastName,
          email,
        };

        try {
          await createUserUseCase.handle(createUserCommand);
          console.log('user created!');
          const user = await userRepository.getUserByEmail(email);
          console.dir(user);
          process.exit(0);
        } catch (e) {
          console.error(e);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('post-ride')
      .description('post a ride')
      .argument('<user-name>', 'the current user name')
      .argument('<departure-place>', 'the departure place')
      .argument('<destination-place>', 'the destination place')
      .action(async (userName, departurePlace, destinationPlace) => {
        const user = await userRepository.getUserByEmail(userName);
        if (user) {
          const nowTimestamp = new Date().getTime();
          const H = 1000 * 60 * 60;
          const departureTime = new Date(nowTimestamp + 1 * H).toISOString();
          const destinationTime = new Date(nowTimestamp + 2 * H).toISOString();

          const postRideCommand: PostRideCommand = {
            driver: user,
            departurePlace,
            departureTime,
            destinationPlace,
            destinationTime,
          };

          try {
            await postRideUseCase.handle(postRideCommand);
            console.log('ride posted!');
            console.dir(postRideCommand);
            process.exit(0);
          } catch (e) {
            console.error(e);
            process.exit(1);
          }
        } else {
          console.error(`The user ${userName} does not exist!`);
        }
      }),
  )
  .addCommand(
    new Command('view-user-rides')
      .description('view user rides')
      .argument('<user-name>', 'the user name to view the rides of')
      .action(async userName => {
        const user = await userRepository.getUserByEmail(userName);

        if (user) {
          const viewUserRidesQuery: ViewUserRidesQuery = { user };

          try {
            const rides = await viewUserRidesUseCase.handle(viewUserRidesQuery);
            console.log(`The ${userName}'s rides are:`);
            console.dir(rides);
            process.exit(0);
          } catch (e) {
            console.error(e);
            process.exit(1);
          }
        } else {
          console.error(`The user ${userName} does not exist!`);
        }
      }),
  );

async function main() {
  await prismaClient.$connect();
  await cli.parseAsync();
  await prismaClient.$disconnect();
}

main();
