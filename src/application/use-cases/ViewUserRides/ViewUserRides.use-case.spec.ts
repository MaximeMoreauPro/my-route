import {
  ErrorInMemoryRideRepository,
  Fixture,
  createFixture,
} from './ViewUserRides.use-case.test-fixture';
import { Alex, Zoe } from '../../../infrastructure/tests/User.test-data';

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
          driver: Alex,
          departurePlace: 'London',
          departureTime: '2023-01-01T12:30:00.000Z',
          destinationPlace: 'Brighton',
          destinationTime: '2023-01-01T14:30:00.000Z',
          postedAt: '2023-01-01T08:30:00.000Z',
          passengers: [],
        },
        {
          id: '2',
          driver: Zoe,
          departurePlace: 'Manchester',
          departureTime: '2023-01-01T10:30:00.000Z',
          destinationPlace: 'Liverpool',
          destinationTime: '2023-01-01T12:30:00.000Z',
          postedAt: '2023-01-01T09:30:00.000Z',
          passengers: [],
        },
        {
          id: '3',
          driver: Alex,
          departurePlace: 'Brighton',
          departureTime: '2022-12-01T12:30:00.000Z',
          destinationPlace: 'London',
          destinationTime: '2022-12-01T14:30:00.000Z',
          postedAt: '2022-12-01T08:30:00.000Z',
          passengers: [],
        },
        {
          id: '4',
          driver: Alex,
          departurePlace: 'London',
          departureTime: '2023-02-01T12:30:00.000Z',
          destinationPlace: 'Liverpool',
          destinationTime: '2023-02-01T18:30:00.000Z',
          postedAt: '2022-02-01T08:30:00.000Z',
          passengers: [],
        },
      ]);

      await fixture.whenViewUserRides({
        user: Alex,
      });

      fixture.thenDisplayedRidesShouldBe([
        {
          id: '3',
          driver: Alex,
          departurePlace: 'Brighton',
          departureTime: '2022-12-01T12:30:00.000Z',
          destinationPlace: 'London',
          destinationTime: '2022-12-01T14:30:00.000Z',
          postedAt: '2022-12-01T08:30:00.000Z',
          passengers: [],
        },
        {
          id: '1',
          driver: Alex,
          departurePlace: 'London',
          departureTime: '2023-01-01T12:30:00.000Z',
          destinationPlace: 'Brighton',
          destinationTime: '2023-01-01T14:30:00.000Z',
          postedAt: '2023-01-01T08:30:00.000Z',
          passengers: [],
        },
        {
          id: '4',
          driver: Alex,
          departurePlace: 'London',
          departureTime: '2023-02-01T12:30:00.000Z',
          destinationPlace: 'Liverpool',
          destinationTime: '2023-02-01T18:30:00.000Z',
          postedAt: '2022-02-01T08:30:00.000Z',
          passengers: [],
        },
      ]);
    });
  });

  describe('Rule: the user is informed if a user has no ride', () => {
    test('Alex can view the message "Zoe Davies has no ride"', async () => {
      fixture.givenTheseRidesExist([
        {
          id: '1',
          driver: Alex,
          departurePlace: 'London',
          departureTime: '2023-01-01T12:30:00.000Z',
          destinationPlace: 'Brighton',
          destinationTime: '2023-01-01T14:30:00.000Z',
          postedAt: '2023-01-01T08:30:00.000Z',
          passengers: [],
        },
        {
          id: '2',
          driver: Alex,
          departurePlace: 'Manchester',
          departureTime: '2023-01-01T10:30:00.000Z',
          destinationPlace: 'Liverpool',
          destinationTime: '2023-01-01T12:30:00.000Z',
          postedAt: '2023-01-01T09:30:00.000Z',
          passengers: [],
        },
        {
          id: '3',
          driver: Alex,
          departurePlace: 'Brighton',
          departureTime: '2022-12-01T12:30:00.000Z',
          destinationPlace: 'London',
          destinationTime: '2022-12-01T14:30:00.000Z',
          postedAt: '2022-12-01T08:30:00.000Z',
          passengers: [],
        },
        {
          id: '4',
          driver: Alex,
          departurePlace: 'London',
          departureTime: '2023-02-01T12:30:00.000Z',
          destinationPlace: 'Liverpool',
          destinationTime: '2023-02-01T18:30:00.000Z',
          postedAt: '2022-02-01T08:30:00.000Z',
          passengers: [],
        },
      ]);

      await fixture.whenViewUserRides({
        user: Zoe,
      });

      fixture.thenDisplayedMessageShouldBe('Zoe Davies has no ride');
    });
  });

  describe("Rule: the user is informed if the user's rides cannot be fetched", () => {
    test('Alex can view the message "Zoe Davies\'s rides cannot be fetched. Please try later"', async () => {
      fixture = createFixture({
        rideRepository: new ErrorInMemoryRideRepository(),
      });

      fixture.givenTheseRidesExist([
        {
          id: '1',
          driver: Zoe,
          departurePlace: 'London',
          departureTime: '2023-01-01T12:30:00.000Z',
          destinationPlace: 'Brighton',
          destinationTime: '2023-01-01T14:30:00.000Z',
          postedAt: '2023-01-01T08:30:00.000Z',
          passengers: [],
        },
      ]);

      await fixture.whenViewUserRides({
        user: Zoe,
      });

      fixture.thenDisplayedMessageShouldBe(
        "Zoe Davies's rides cannot be fetched. Please try later"
      );
    });
  });
});
