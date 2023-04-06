import { PostRideCommand, PostRideUseCase, Ride } from './PostRide.use-case';

describe('Feature: Post a ride', () => {
  test('Alex can post a ride', () => {
    givenNowIs(new Date('2023-01-01T08:00:00.000Z'));

    whenUserPostRide({
      driver: 'Alex',
      departurePlace: 'London',
      departureTime: new Date('2023-01-01T12:30:00.000Z'),
      destinationPlace: 'Brighton',
      destinatioTime: new Date('2023-01-01T14:30:00.000Z'),
    });

    thenPostedRideShouldBe({
      driver: 'Alex',
      departurePlace: 'London',
      departureTime: new Date('2023-01-01T12:30:00.000Z'),
      destinationPlace: 'Brighton',
      destinatioTime: new Date('2023-01-01T14:30:00.000Z'),
      postedAt: new Date('2023-01-01T08:00:00.000Z'),
    });
  });
});

let now: Date;

let ride: Ride;

const postRideUseCase = new PostRideUseCase(
  (rideToSave: Ride) => {
    ride = rideToSave;
  },
  () => now
);

function givenNowIs(datetime: Date) {
  now = datetime;
}

function whenUserPostRide(postRideCommand: PostRideCommand) {
  postRideUseCase.handle(postRideCommand);
}

function thenPostedRideShouldBe(expectedRide: Ride) {
  expect(expectedRide).toEqual(ride);
}
