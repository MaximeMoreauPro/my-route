#!/usr/bin/env node

import { Command } from 'commander';

import { PostRideCommand, PostRideUseCase } from './PostRide.use-case';
import { InMemoryRideRepository } from './RideRepository.in-memory';
import { RealDateProvider } from './DateProvider.real';

const rideRepository = new InMemoryRideRepository();
const dateProvider = new RealDateProvider();

const postRideUseCase = new PostRideUseCase(rideRepository, dateProvider);

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
      .action((user, departurePlace, destinationPlace) => {
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
          postRideUseCase.handle(postRideCommand);
          console.log('ride posted!');
          console.dir(rideRepository.ride);
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
