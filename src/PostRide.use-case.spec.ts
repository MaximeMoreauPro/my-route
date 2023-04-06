import { PostRideCommand, PostRideUseCase, Ride } from './PostRide.use-case';
import { InMemoryRideRepository } from './RideRepository.in-memory';
import { StubDateProvider } from './DateProvider.stub';
import { MyRouteError, MyRouteErrorCode } from './MyRouteError';

describe('Feature: Post a ride', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  test('Alex can post a ride', () => {
    fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

    fixture.whenUserPostRide({
      driver: 'Alex',
      departurePlace: 'London',
      departureTime: new Date('2023-01-01T12:30:00.000Z'),
      destinationPlace: 'Brighton',
      destinationTime: new Date('2023-01-01T14:30:00.000Z'),
    });

    fixture.thenPostedRideShouldBe({
      driver: 'Alex',
      departurePlace: 'London',
      departureTime: new Date('2023-01-01T12:30:00.000Z'),
      destinationPlace: 'Brighton',
      destinationTime: new Date('2023-01-01T14:30:00.000Z'),
      postedAt: new Date('2023-01-01T08:00:00.000Z'),
    });
  });

  describe('Rule: the departure and destination time must be different', () => {
    test('Alex cannot post a ride with the same departure and arrival time', () => {
      fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

      fixture.whenUserPostRide({
        driver: 'Alex',
        departurePlace: 'London',
        departureTime: new Date('2023-01-01T12:30:00.000Z'),
        destinationPlace: 'Brighton',
        destinationTime: new Date('2023-01-01T12:30:00.000Z'),
      });

      fixture.thenErrorShouldBe(
        'SameDepartureAndDestinationTimeError',
        'the departure and destination time must be different'
      );
    });
  });

  describe('Rule: the place must not be empty', () => {
    test('Alex cannot post a ride with an empty departure place', () => {
      fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

      fixture.whenUserPostRide({
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

    test('Alex cannot post a ride with an empty destination place', () => {
      fixture.givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

      fixture.whenUserPostRide({
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
});

type Fixture = ReturnType<typeof createFixture>;

const createFixture = () => {
  const dateProvider = new StubDateProvider();
  const rideRepository = new InMemoryRideRepository();
  const postRideUseCase = new PostRideUseCase(rideRepository, dateProvider);
  let thrownError: MyRouteError;

  return {
    givenNowIs(datetime: Date) {
      dateProvider.setNow(datetime);
    },
    whenUserPostRide(postRideCommand: PostRideCommand) {
      try {
        postRideUseCase.handle(postRideCommand);
      } catch (e) {
        if (e instanceof MyRouteError) {
          thrownError = e;
        }
      }
    },
    thenPostedRideShouldBe(expectedRide: Ride) {
      expect(expectedRide).toEqual(rideRepository.ride);
    },
    thenErrorShouldBe(
      expectedErrorCode: MyRouteErrorCode,
      expectedErrorMessage: string
    ) {
      expect(thrownError).toBeInstanceOf(MyRouteError);
      expect(thrownError.code).toBe(expectedErrorCode);
      expect(thrownError.message).toBe(expectedErrorMessage);
    },
  };
};
