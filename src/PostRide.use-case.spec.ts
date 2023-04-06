import {
  DateProvider,
  PostRideCommand,
  PostRideUseCase,
  Ride,
  RideRepository,
  SameDepartureAndDestinationTimeError,
} from './PostRide.use-case';

describe('Feature: Post a ride', () => {
  test('Alex can post a ride', () => {
    givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

    whenUserPostRide({
      driver: 'Alex',
      departurePlace: 'London',
      departureTime: new Date('2023-01-01T12:30:00.000Z'),
      destinationPlace: 'Brighton',
      destinationTime: new Date('2023-01-01T14:30:00.000Z'),
    });

    thenPostedRideShouldBe({
      driver: 'Alex',
      departurePlace: 'London',
      departureTime: new Date('2023-01-01T12:30:00.000Z'),
      destinationPlace: 'Brighton',
      destinationTime: new Date('2023-01-01T14:30:00.000Z'),
      postedAt: new Date('2023-01-01T08:00:00.000Z'),
    });
  });

  test('Alex cannot post a ride with the same departure and arrival time', () => {
    givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

    whenUserPostRide({
      driver: 'Alex',
      departurePlace: 'London',
      departureTime: new Date('2023-01-01T12:30:00.000Z'),
      destinationPlace: 'Brighton',
      destinationTime: new Date('2023-01-01T12:30:00.000Z'),
    });

    thenErrorShouldBe(SameDepartureAndDestinationTimeError);
  });
});

let ride: Ride;

class InMemoryRideRepository implements RideRepository {
  save(rideToSave: Ride) {
    ride = rideToSave;
  }
}

const rideRepository = new InMemoryRideRepository();

class StubDateProvider implements DateProvider {
  private now: Date;

  getNow() {
    return this.now;
  }

  setNow(datetime: Date) {
    this.now = datetime;
  }
}

const dateProvider = new StubDateProvider();

const postRideUseCase = new PostRideUseCase(rideRepository, dateProvider);

let thrownError: Error;

function givenNowIs(datetime: Date) {
  dateProvider.setNow(datetime);
}

function whenUserPostRide(postRideCommand: PostRideCommand) {
  try {
    postRideUseCase.handle(postRideCommand);
  } catch (e) {
    if (e instanceof Error) {
      thrownError = e;
    }
  }
}

function thenPostedRideShouldBe(expectedRide: Ride) {
  expect(expectedRide).toEqual(ride);
}

function thenErrorShouldBe(expectedErrorClass: new () => Error) {
  expect(thrownError).toBeInstanceOf(expectedErrorClass);
}
