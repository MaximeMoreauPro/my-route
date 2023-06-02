#!/usr/bin/env node

import { Command } from 'commander';

import {
  PostRideCommand,
  PostRideUseCase,
} from './application/use-cases/PostRide.use-case';
import {
  ViewPersonalRidesUseCase,
  ViewPersonalRidesQuery,
} from './application/use-cases/ViewPersonalRides.use-case';

import { RealDateProvider } from './DateProvider.real';
import { FileSystemRideRepository } from './RideRepository.fs';

const rideRepository = new FileSystemRideRepository();
const dateProvider = new RealDateProvider();

const postRideUseCase = new PostRideUseCase(rideRepository, dateProvider);
const viewPersonalRidesUseCase = new ViewPersonalRidesUseCase(rideRepository);
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
        const departureTime = new Date(nowTimestamp + 1 * H);
        const destinationTime = new Date(nowTimestamp + 2 * H);

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
    new Command('view-personal-rides')
      .description('view personal rides')
      .argument('<user>', 'the current user')
      .action(async user => {
        const viewPersonalRidesQuery: ViewPersonalRidesQuery = {
          user,
        };

        try {
          const rides = await viewPersonalRidesUseCase.handle(
            viewPersonalRidesQuery
          );
          console.log('Your rides are:');
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
