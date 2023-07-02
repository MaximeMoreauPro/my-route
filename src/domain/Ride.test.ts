import { Ride } from './Ride';

describe('Rule: the datetime must be in ISO format', () => {
  test('with valid datetime', () => {
    expect(() =>
      Ride.fromData({
        id: '1',
        postedAt: '2023-01-01T10:30:00.000Z',
        driver: {
          id: '1',
          firstName: 'Alex',
          lastName: 'Johnson',
          email: 'alex@johnson.com',
        },
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T14:30:00.000Z',
      })
    ).not.toThrow();
  });

  test('with invalid datetime', () => {
    expect(() =>
      Ride.fromData({
        id: '1',
        postedAt: '2023-01-01-08:00',
        driver: {
          id: '1',
          firstName: 'Alex',
          lastName: 'Johnson',
          email: 'alex@johnson.com',
        },
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T14:30:00.000Z',
      })
    ).toThrow(
      /^the datetime must be in the ISO 8601 format YYYY-MM-DDTHH:mm:ss.sssZ$/
    );

    expect(() =>
      Ride.fromData({
        id: '1',
        postedAt: '2023-01-01T12:30:00.000Z',
        driver: {
          id: '1',
          firstName: 'Alex',
          lastName: 'Johnson',
          email: 'alex@johnson.com',
        },
        departurePlace: 'London',
        departureTime: '2023-01-01-08:00',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T14:30:00.000Z',
      })
    ).toThrow(
      /^the datetime must be in the ISO 8601 format YYYY-MM-DDTHH:mm:ss.sssZ$/
    );

    expect(() =>
      Ride.fromData({
        id: '1',
        postedAt: '2023-01-01T12:30:00.000Z',
        driver: {
          id: '1',
          firstName: 'Alex',
          lastName: 'Johnson',
          email: 'alex@johnson.com',
        },
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01-08:00',
      })
    ).toThrow(
      /^the datetime must be in the ISO 8601 format YYYY-MM-DDTHH:mm:ss.sssZ$/
    );
  });
});
