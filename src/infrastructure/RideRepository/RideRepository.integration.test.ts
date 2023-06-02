import * as path from 'path';
import * as fs from 'fs';

import { RideRepository } from '../../application/RideRepository';
import { Ride } from '../../domain/Ride';

import { FileSystemRideRepository } from './RideRepository.file-system';
import { InMemoryRideRepository } from './RideRepository.in-memory';

const RIDE_TEST_FILE = path.join(__dirname, 'rides-test.json');

describe('RideRepository', () => {
  runRideRepositoryTests(
    'FileSystemRideRepository',
    () => new FileSystemRideRepository(RIDE_TEST_FILE),
    () => {
      try {
        return fs.promises.rm(RIDE_TEST_FILE, { force: true });
      } catch (e) {
        console.error(e);
      }
      return Promise.resolve();
    }
  );
  runRideRepositoryTests(
    'InMemoryRideRepository',
    () => new InMemoryRideRepository()
  );
});

function runRideRepositoryTests(
  rideRepositoryImplementation:
    | 'FileSystemRideRepository'
    | 'InMemoryRideRepository',
  rideRepositoryFactory: () => RideRepository,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reset: () => Promise<void> = async () => {}
) {
  describe(rideRepositoryImplementation, () => {
    let rideRepository: RideRepository;

    beforeEach(async () => {
      await reset();

      rideRepository = rideRepositoryFactory();
    });

    afterAll(async () => {
      await reset();
    });

    it('should save a Ride', async () => {
      await rideRepository.save(
        Ride.fromData({
          id: '1',
          driver: 'Alex',
          departurePlace: 'London',
          departureTime: '2023-01-01T12:30:00.000Z',
          destinationPlace: 'Brighton',
          destinationTime: '2023-01-01T14:30:00.000Z',
          postedAt: '2023-01-01T08:30:00.000Z',
        })
      );
    });

    it('should get the saved ride of a User', async () => {
      await rideRepository.save(
        Ride.fromData({
          id: '1',
          driver: 'Alex',
          departurePlace: 'London',
          departureTime: '2023-01-01T12:30:00.000Z',
          destinationPlace: 'Brighton',
          destinationTime: '2023-01-01T14:30:00.000Z',
          postedAt: '2023-01-01T08:30:00.000Z',
        })
      );

      await rideRepository.save(
        Ride.fromData({
          id: '2',
          driver: 'Zoe',
          departurePlace: 'Manchester',
          departureTime: '2023-01-01T10:30:00.000Z',
          destinationPlace: 'Liverpool',
          destinationTime: '2023-01-01T12:30:00.000Z',
          postedAt: '2023-01-01T09:30:00.000Z',
        })
      );

      await rideRepository.save(
        Ride.fromData({
          id: '3',
          driver: 'Alex',
          departurePlace: 'Brighton',
          departureTime: '2023-01-02T12:30:00.000Z',
          destinationPlace: 'London',
          destinationTime: '2023-01-02T14:30:00.000Z',
          postedAt: '2023-01-01T08:45:00.000Z',
        })
      );

      const userRides = await rideRepository.getRidesByUser('Alex');

      expect(userRides.map(ride => ride.data)).toStrictEqual([
        {
          id: '1',
          driver: 'Alex',
          departurePlace: 'London',
          departureTime: '2023-01-01T12:30:00.000Z',
          destinationPlace: 'Brighton',
          destinationTime: '2023-01-01T14:30:00.000Z',
          postedAt: '2023-01-01T08:30:00.000Z',
        },
        {
          id: '3',
          driver: 'Alex',
          departurePlace: 'Brighton',
          departureTime: '2023-01-02T12:30:00.000Z',
          destinationPlace: 'London',
          destinationTime: '2023-01-02T14:30:00.000Z',
          postedAt: '2023-01-01T08:45:00.000Z',
        },
      ]);
    });
  });
}
