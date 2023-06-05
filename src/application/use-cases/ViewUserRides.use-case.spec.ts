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

  describe('Rule: the user is informed if he has no ride', () => {
    test('Tom can view the message "You have no ride"', async () => {
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

      fixture.thenDisplayedMessageShouldBe('There is no ride');
    });
  });
});

type Fixture = ReturnType<typeof createFixture>;

const createFixture = () => {
  const rideRepository = new InMemoryRideRepository();
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
