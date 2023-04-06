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

let ride: {
  driver: string;
  departurePlace: string;
  departureTime: Date;
  destinationPlace: string;
  destinatioTime: Date;
  postedAt: Date;
};

function givenNowIs(datetime: Date) {
  now = datetime;
}

function whenUserPostRide(postRideCommand: {
  driver: string;
  departurePlace: string;
  departureTime: Date;
  destinationPlace: string;
  destinatioTime: Date;
}) {
  ride = { ...postRideCommand, postedAt: now };
}

function thenPostedRideShouldBe(expectedRide: {
  driver: string;
  departurePlace: string;
  departureTime: Date;
  destinationPlace: string;
  destinatioTime: Date;
  postedAt: Date;
}) {
  expect(expectedRide).toEqual(ride);
}
