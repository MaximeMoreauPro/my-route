import { InMemoryRideRepository } from '../../infrastructure/RideRepository/RideRepository.in-memory';
import { Ride } from '../../domain/Ride';
import {
  ViewUserRidesUseCase,
  ViewUserRidesQuery,
} from './ViewUserRides.use-case';

describe('Feature: view user rides', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe('Rule: the rides are displayed by departure date and time in chronological order', () => {
    test("A user can view the 3 Alex's rides", async () => {
      fixture.givenTheseRidesExist([
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
          id: '2',
          driver: 'Zoe',
          departurePlace: 'Manchester',
          departureTime: '2023-01-01T10:30:00.000Z',
          destinationPlace: 'Liverpool',
          destinationTime: '2023-01-01T12:30:00.000Z',
          postedAt: '2023-01-01T09:30:00.000Z',
        },
        {
          id: '3',
          driver: 'Alex',
          departurePlace: 'Brighton',
          departureTime: '2022-12-01T12:30:00.000Z',
          destinationPlace: 'London',
          destinationTime: '2022-12-01T14:30:00.000Z',
          postedAt: '2022-12-01T08:30:00.000Z',
        },
        {
          id: '4',
          driver: 'Alex',
          departurePlace: 'London',
          departureTime: '2023-02-01T12:30:00.000Z',
          destinationPlace: 'Liverpool',
          destinationTime: '2023-02-01T18:30:00.000Z',
          postedAt: '2022-02-01T08:30:00.000Z',
        },
      ]);

      await fixture.whenViewUserRides({ user: 'Alex' });

      fixture.thenDisplayedRidesShouldBe([
        {
          id: '3',
          driver: 'Alex',
          departurePlace: 'Brighton',
          departureTime: '2022-12-01T12:30:00.000Z',
          destinationPlace: 'London',
          destinationTime: '2022-12-01T14:30:00.000Z',
          postedAt: '2022-12-01T08:30:00.000Z',
        },
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
          id: '4',
          driver: 'Alex',
          departurePlace: 'London',
          departureTime: '2023-02-01T12:30:00.000Z',
          destinationPlace: 'Liverpool',
          destinationTime: '2023-02-01T18:30:00.000Z',
          postedAt: '2022-02-01T08:30:00.000Z',
        },
      ]);
    });
  });

  describe('Rule: the user is informed if a user has no ride', () => {
    test('Alex can view the message "There is no ride"', async () => {
      fixture.givenTheseRidesExist([
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
          id: '2',
          driver: 'Zoe',
          departurePlace: 'Manchester',
          departureTime: '2023-01-01T10:30:00.000Z',
          destinationPlace: 'Liverpool',
          destinationTime: '2023-01-01T12:30:00.000Z',
          postedAt: '2023-01-01T09:30:00.000Z',
        },
        {
          id: '3',
          driver: 'Alex',
          departurePlace: 'Brighton',
          departureTime: '2022-12-01T12:30:00.000Z',
          destinationPlace: 'London',
          destinationTime: '2022-12-01T14:30:00.000Z',
          postedAt: '2022-12-01T08:30:00.000Z',
        },
        {
          id: '4',
          driver: 'Alex',
          departurePlace: 'London',
          departureTime: '2023-02-01T12:30:00.000Z',
          destinationPlace: 'Liverpool',
          destinationTime: '2023-02-01T18:30:00.000Z',
          postedAt: '2022-02-01T08:30:00.000Z',
        },
      ]);

      await fixture.whenViewUserRides({ user: 'Tom' });

      fixture.thenDisplayedMessageShouldBe('Tom has no ride');
    });
  });

  describe("Rule: the user is informed if the user's rides cannot be fetched", () => {
    test('Alex can view the message "Tom\'s rides cannot be fetched. Please try later"', async () => {
      fixture = createFixture({
        rideRepository: new ErrorInMemoryRideRepository(),
      });

      fixture.givenTheseRidesExist([
        {
          id: '1',
          driver: 'Tom',
          departurePlace: 'London',
          departureTime: '2023-01-01T12:30:00.000Z',
          destinationPlace: 'Brighton',
          destinationTime: '2023-01-01T14:30:00.000Z',
          postedAt: '2023-01-01T08:30:00.000Z',
        },
      ]);

      await fixture.whenViewUserRides({ user: 'Tom' });

      fixture.thenDisplayedMessageShouldBe(
        "Tom's rides cannot be fetched. Please try later"
      );
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
  const viewUserRidesUseCase = new ViewUserRidesUseCase(rideRepository);
  let userRides: Ride[];
  let message: string;

  return {
    async givenTheseRidesExist(existingRides: Ride['data'][]) {
      rideRepository.givenTheseRidesExist(existingRides);
    },
    async whenViewUserRides(viewUserRidesQuery: ViewUserRidesQuery) {
      const viewUserRidesQueryResult = await viewUserRidesUseCase.handle(
        viewUserRidesQuery
      );
      if (viewUserRidesQueryResult instanceof Array) {
        userRides = viewUserRidesQueryResult;
      } else {
        message = viewUserRidesQueryResult.message;
      }
    },
    thenDisplayedRidesShouldBe(expectedRides: Ride['data'][]) {
      expect(userRides.map(ride => ride.data)).toEqual(expectedRides);
    },
    thenDisplayedMessageShouldBe(expectedMessage: string) {
      expect(message).toEqual(expectedMessage);
    },
  };
};

class ErrorInMemoryRideRepository extends InMemoryRideRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getRidesByUser(user: string): Promise<Ride[]> {
    throw new Error('getRidesByUser error for testing purpose');
  }
}
