import { RideRepository } from '../../application/repositories/RideRepository';
import { Ride } from '../../domain/Ride';
import { Alex, Zoe } from '../tests/User.test-data';
import { rideBuilder } from '../tests/Ride.builder';

import { InMemoryRideRepository } from './RideRepository.in-memory';

describe('RideRepository', () => {
  runRideRepositoryTests(
    'InMemoryRideRepository',
    () => new InMemoryRideRepository(),
  );
});

function runRideRepositoryTests(
  rideRepositoryImplementation:
    | 'FileSystemRideRepository'
    | 'InMemoryRideRepository',
  rideRepositoryFactory: () => RideRepository,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reset: () => Promise<void> = async () => {},
) {
  describe(rideRepositoryImplementation, () => {
    let rideRepository: RideRepository;

    beforeEach(async () => {
      rideRepository = rideRepositoryFactory();
    });

    afterEach(async () => {
      await reset();
    });

    it('should save a Ride', async () => {
      expect(async () => {
        await rideRepository.postRide(Ride.fromData(rideBuilder().build()));
      }).not.toThrow();
    });

    it('should get the saved ride of a User', async () => {
      const alexRide = rideBuilder().build();
      await rideRepository.postRide(Ride.fromData(alexRide));

      await rideRepository.postRide(
        Ride.fromData(rideBuilder().withId('2').drivenBy(Zoe).build()),
      );

      const alexRides2 = rideBuilder().withId('3').build();
      await rideRepository.postRide(Ride.fromData(alexRides2));

      const userRides = await rideRepository.getRidesPostedByDriver(Alex.id);

      userRides;

      alexRide;
      alexRides2;

      expect(userRides).toEqual([alexRide, alexRides2]);
    });
  });
}
