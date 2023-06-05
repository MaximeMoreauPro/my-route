#!/usr/bin/env node

import * as path from 'path';

import { Command } from 'commander';

import {
  PostRideCommand,
  PostRideUseCase,
} from '../application/use-cases/PostRide.use-case';
import {
  ViewUserRidesUseCase,
  ViewUserRidesQuery,
} from '../application/use-cases/ViewUserRides.use-case';

import { FileSystemRideRepository } from '../infrastructure/RideRepository/RideRepository.file-system';
import { RealDateProvider } from '../infrastructure/DateProvider/DateProvider.real';
import { UUIDv4IdProvider } from '../infrastructure/IdProvider/IdProvider.uuidv4';

const rideRepository = new FileSystemRideRepository(
  path.join(__dirname, 'rides.json')
);
const dateProvider = new RealDateProvider();
const idProvider = new UUIDv4IdProvider();

const postRideUseCase = new PostRideUseCase(
  rideRepository,
  dateProvider,
  idProvider
);
const viewUserRidesUseCase = new ViewUserRidesUseCase(rideRepository);
const cli = new Command();

cli
  .description('My Route CLI')
  .version('0.0.1')
  .addCommand(
    new Command('post-ride')
      .description('post a ride')
      .argument('<user>', 'the current user')
      .argument('<departure-place>', 'the departure place')
      .argument('<destination-place>', 'the destination place')
      .action(async (user, departurePlace, destinationPlace) => {
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
      })
  )
  .addCommand(
    new Command('view-user-rides')
      .description('view user rides')
      .argument('<user>', 'the user to view the rides of')
      .action(async user => {
        const viewUserRidesQuery: ViewUserRidesQuery = {
          user,
        };

        try {
          const rides = await viewUserRidesUseCase.handle(viewUserRidesQuery);
          console.log(`The ${user}'s rides are:`);
          console.dir(rides);
          process.exit(0);
        } catch (e) {
          console.error(e);
          process.exit(1);
        }
      })
  );

async function main() {
  await cli.parseAsync();
}

main();
