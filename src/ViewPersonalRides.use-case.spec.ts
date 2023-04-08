import { Ride } from './PostRide.use-case';
import {
  ViewPersonalRidesUseCase,
  ViewPersonalRidesQuery,
} from './ViewPersonalRides.use-case';
import { InMemoryRideRepository } from './RideRepository.in-memory';

describe('Feature: view personal rides', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe('Rule: the rides are displayed by departure date and time in chronological order', () => {
    test('Alex can view his 3 personal rides', async () => {
      fixture.givenTheseRidesExist([
        {
          driver: 'Alex',
          departurePlace: 'London',
          departureTime: new Date('2023-01-01T12:30:00.000Z'),
          destinationPlace: 'Brighton',
          destinationTime: new Date('2023-01-01T14:30:00.000Z'),
          postedAt: new Date('2023-01-01T08:30:00.000Z'),
        },
        {
          driver: 'Zoe',
          departurePlace: 'Manchester',
          departureTime: new Date('2023-01-01T10:30:00.000Z'),
          destinationPlace: 'Liverpool',
          destinationTime: new Date('2023-01-01T12:30:00.000Z'),
          postedAt: new Date('2023-01-01T09:30:00.000Z'),
        },
        {
          driver: 'Alex',
          departurePlace: 'Brighton',
          departureTime: new Date('2022-12-01T12:30:00.000Z'),
          destinationPlace: 'London',
          destinationTime: new Date('2022-12-01T14:30:00.000Z'),
          postedAt: new Date('2022-12-01T08:30:00.000Z'),
        },
        {
          driver: 'Alex',
          departurePlace: 'London',
          departureTime: new Date('2023-02-01T12:30:00.000Z'),
          destinationPlace: 'Liverpool',
          destinationTime: new Date('2023-02-01T18:30:00.000Z'),
          postedAt: new Date('2022-02-01T08:30:00.000Z'),
        },
      ]);

      await fixture.whenUserViewTheirPersonalRides({ user: 'Alex' });

      fixture.thenDisplayedRidesShouldBe([
        {
          driver: 'Alex',
          departurePlace: 'Brighton',
          departureTime: new Date('2022-12-01T12:30:00.000Z'),
          destinationPlace: 'London',
          destinationTime: new Date('2022-12-01T14:30:00.000Z'),
          postedAt: new Date('2022-12-01T08:30:00.000Z'),
        },
        {
          driver: 'Alex',
          departurePlace: 'London',
          departureTime: new Date('2023-01-01T12:30:00.000Z'),
          destinationPlace: 'Brighton',
          destinationTime: new Date('2023-01-01T14:30:00.000Z'),
          postedAt: new Date('2023-01-01T08:30:00.000Z'),
        },
        {
          driver: 'Alex',
          departurePlace: 'London',
          departureTime: new Date('2023-02-01T12:30:00.000Z'),
          destinationPlace: 'Liverpool',
          destinationTime: new Date('2023-02-01T18:30:00.000Z'),
          postedAt: new Date('2022-02-01T08:30:00.000Z'),
        },
      ]);
    });
  });
});

type Fixture = ReturnType<typeof createFixture>;

const createFixture = () => {
  const rideRepository = new InMemoryRideRepository();
  const viewPersonalRidesUseCase = new ViewPersonalRidesUseCase(rideRepository);
  let personalRides: Ride[];

  return {
    async givenTheseRidesExist(existingRides: Ride[]) {
      rideRepository.givenTheseRidesExist(existingRides);
    },
    async whenUserViewTheirPersonalRides(
      viewPersonalRidesQuery: ViewPersonalRidesQuery
    ) {
      personalRides = await viewPersonalRidesUseCase.handle(
        viewPersonalRidesQuery
      );
    },
    thenDisplayedRidesShouldBe(expectedRides: Ride[]) {
      expect(personalRides).toEqual(expectedRides);
    },
  };
};
