import { InMemoryRideRepository } from '@/infrastructure/RideRepository/RideRepository.in-memory.js';
import { RideData } from '@/domain/Ride.js';
import { Alex, Bob } from '@/infrastructure/tests/User.test-data.js';
import { rideBuilder } from '@/infrastructure/tests/Ride.builder.js';

import { BookRideCommand, BookRideUseCase } from './BookRide.use-case.js';

describe('Feature: a User books a Ride', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  test('Alex can book a ride', async () => {
    const ride = rideBuilder().drivenBy(Bob).build();

    fixture.givenTheseRidesExist([ride]);

    fixture.whenUserBookRide({
      user: Alex,
      ride,
    });

    fixture.thenRideShouldBeBookedByUser({
      userId: Alex.id,
    });
  });
});

type Fixture = ReturnType<typeof createFixture>;

type CreateFixtureParams = {
  rideRepository: InMemoryRideRepository;
};

const createFixture = (
  { rideRepository }: CreateFixtureParams = {
    rideRepository: new InMemoryRideRepository(),
  }
) => {
  const bookRideUseCase = new BookRideUseCase(rideRepository);

  return {
    async givenTheseRidesExist(existingRides: RideData[]) {
      rideRepository.givenTheseRidesExist(existingRides);
    },

    async whenUserBookRide(bookRideCommand: BookRideCommand) {
      await bookRideUseCase.handle(bookRideCommand);
    },

    async thenRideShouldBeBookedByUser({ userId }: { userId: string }) {
      const bookedRides = await rideRepository.getRidesBookedByPassenger(
        userId
      );
      expect(bookedRides).toHaveLength(1);
      const ride = bookedRides[0];
      expect(ride.passengers).toHaveLength(1);
      expect(ride.passengers[0].id).toContain(userId);
    },
  };
};
