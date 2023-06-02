import { PostRideCommand, PostRideUseCase } from './PostRide.use-case';
import { Ride } from '../../domain/Ride';
import { MyRouteError, MyRouteErrorCode } from '../../MyRouteError';
import { StubDateProvider } from '../../infrastructure/DateProvider/DateProvider.stub';
import { InMemoryRideRepository } from '../../infrastructure/RideRepository/RideRepository.in-memory';
import { FakeIdProvider } from '../../infrastructure/IdProvider/IdProvider.fake';

describe('Feature: post a ride', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  test('Alex can post a ride', async () => {
    fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

    await fixture.whenUserPostRide({
      driver: 'Alex',
      departurePlace: 'London',
      departureTime: new Date('2023-01-01T12:30:00.000Z'),
      destinationPlace: 'Brighton',
      destinationTime: new Date('2023-01-01T14:30:00.000Z'),
    });

    fixture.thenPostedRideShouldBe({
      id: fixture.getIdByIndex(0),
      driver: 'Alex',
      departurePlace: 'London',
      departureTime: new Date('2023-01-01T12:30:00.000Z'),
      destinationPlace: 'Brighton',
      destinationTime: new Date('2023-01-01T14:30:00.000Z'),
      postedAt: new Date('2023-01-01T08:00:00.000Z'),
    });
  });

  describe('Rule: the departure time must be before the destination time', () => {
    test('Alex cannot post a ride with the same departure and arrival time', async () => {
      fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

      await fixture.whenUserPostRide({
        driver: 'Alex',
        departurePlace: 'London',
        departureTime: new Date('2023-01-01T12:30:00.000Z'),
        destinationPlace: 'Brighton',
        destinationTime: new Date('2023-01-01T12:30:00.000Z'),
      });

      fixture.thenErrorShouldBe(
        'DepartureTimeAfterDestinationTimeError',
        'the departure time must be before the destination time'
      );
    });

    test('Alex cannot post a ride with the departure time after the arrival time', async () => {
      fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

      await fixture.whenUserPostRide({
        driver: 'Alex',
        departurePlace: 'London',
        departureTime: new Date('2023-01-01T12:30:00.000Z'),
        destinationPlace: 'Brighton',
        destinationTime: new Date('2023-01-01T11:30:00.000Z'),
      });

      fixture.thenErrorShouldBe(
        'DepartureTimeAfterDestinationTimeError',
        'the departure time must be before the destination time'
      );
    });
  });

  describe('Rule: the departure time must be in the future', () => {
    test('Alex cannot post a ride with the departure time in the past', async () => {
      fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

      await fixture.whenUserPostRide({
        driver: 'Alex',
        departurePlace: 'London',
        departureTime: new Date('2023-01-01T07:30:00.000Z'),
        destinationPlace: 'Brighton',
        destinationTime: new Date('2023-01-01T11:30:00.000Z'),
      });

      fixture.thenErrorShouldBe(
        'PassedDepartureTimeError',
        'the departure time must be in the future'
      );
    });

    test('Alex cannot post a ride with the departure time set at the current time', async () => {
      fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

      await fixture.whenUserPostRide({
        driver: 'Alex',
        departurePlace: 'London',
        departureTime: new Date('2023-01-01T08:00:00.000Z'),
        destinationPlace: 'Brighton',
        destinationTime: new Date('2023-01-01T11:30:00.000Z'),
      });

      fixture.thenErrorShouldBe(
        'PassedDepartureTimeError',
        'the departure time must be in the future'
      );
    });
  });

  describe('Rule: the place must not be empty', () => {
    test('Alex cannot post a ride with an empty departure place', async () => {
      fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

      await fixture.whenUserPostRide({
        driver: 'Alex',
        departurePlace: '   ',
        departureTime: new Date('2023-01-01T12:30:00.000Z'),
        destinationPlace: 'Brighton',
        destinationTime: new Date('2023-01-01T14:30:00.000Z'),
      });

      fixture.thenErrorShouldBe(
        'EmptyPlaceError',
        'the place must not be empty'
      );
    });

    test('Alex cannot post a ride with an empty destination place', async () => {
      fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

      await fixture.whenUserPostRide({
        driver: 'Alex',
        departurePlace: 'London',
        departureTime: new Date('2023-01-01T12:30:00.000Z'),
        destinationPlace: '   ',
        destinationTime: new Date('2023-01-01T14:30:00.000Z'),
      });

      fixture.thenErrorShouldBe(
        'EmptyPlaceError',
        'the place must not be empty'
      );
    });
  });

  describe('Rule: the departure and destination places must be different', () => {
    test('Alex cannot post a ride the same departure and destination place', async () => {
      fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

      await fixture.whenUserPostRide({
        driver: 'Alex',
        departurePlace: 'London',
        departureTime: new Date('2023-01-01T12:30:00.000Z'),
        destinationPlace: 'London',
        destinationTime: new Date('2023-01-01T14:30:00.000Z'),
      });

      fixture.thenErrorShouldBe(
        'SameDepartureAndDestinationPlaceError',
        'the departure and destination places must be different'
      );
    });
  });
});

type Fixture = ReturnType<typeof createFixture>;

const createFixture = () => {
  const dateProvider = new StubDateProvider();
  const rideRepository = new InMemoryRideRepository();
  const idProvider = new FakeIdProvider();
  const postRideUseCase = new PostRideUseCase(
    rideRepository,
    dateProvider,
    idProvider
  );
  let thrownError: unknown;

  return {
    givenNowIs(datetime: Date) {
      dateProvider.setNow(datetime);
    },
    async whenUserPostRide(postRideCommand: PostRideCommand) {
      try {
        await postRideUseCase.handle(postRideCommand);
      } catch (e) {
        thrownError = e;
      }
    },
    thenPostedRideShouldBe(expectedRide: Ride['data']) {
      expect(expectedRide).toEqual(rideRepository.rides[0]);
    },
    thenErrorShouldBe(
      expectedErrorCode: MyRouteErrorCode,
      expectedErrorMessage: string
    ) {
      expect(thrownError).toBeInstanceOf(MyRouteError);
      expect((thrownError as MyRouteError).code).toBe(expectedErrorCode);
      expect((thrownError as MyRouteError).message).toBe(expectedErrorMessage);
    },
    getIdByIndex(index: number): string {
      return idProvider.getIdByIndex(index);
    },
  };
};
