import { MyRouteError } from '../MyRouteError';
import { Entity } from './Entity';
import { User } from './User';

export class Ride extends Entity {
  private constructor(
    id: string,
    readonly driver: User,
    readonly departurePlace: string,
    readonly departureTime: string,
    readonly destinationPlace: string,
    readonly destinationTime: string,
    readonly postedAt: string
  ) {
    super(id);
  }

  static fromData(data: Ride) {
    checkDatetime(data.departureTime);
    checkDatetime(data.destinationTime);
    checkDatetime(data.postedAt);

    checkPassedDepartureTime(data.departureTime, data.postedAt);

    checkDepartureTimeAfterDestinationTime(
      data.destinationTime,
      data.departureTime
    );

    const trimedDeparturePlace = data.departurePlace.trim();
    const trimedDestinationPlace = data.destinationPlace.trim();

    checkEmptyPlace(trimedDeparturePlace);
    checkEmptyPlace(trimedDestinationPlace);

    checkSameDepartureAndDestinationPlace(
      trimedDeparturePlace,
      trimedDestinationPlace
    );

    return new Ride(
      data.id,
      data.driver,
      trimedDeparturePlace,
      data.departureTime,
      trimedDestinationPlace,
      data.destinationTime,
      data.postedAt
    );
  }
}

function checkDatetime(date: string) {
  if (
    !/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/.test(
      date
    )
  ) {
    throw new MyRouteError('WrongFormatDatetimeError');
  }
}

function checkPassedDepartureTime(departureTime: string, postedAt: string) {
  if (departureTime <= postedAt) {
    throw new MyRouteError('PassedDepartureTimeError');
  }
}

function checkDepartureTimeAfterDestinationTime(
  destinationTime: string,
  departureTime: string
) {
  if (destinationTime <= departureTime) {
    throw new MyRouteError('DepartureTimeAfterDestinationTimeError');
  }
}

function checkEmptyPlace(place: string) {
  if (place.length === 0) {
    throw new MyRouteError('EmptyPlaceError');
  }
}

function checkSameDepartureAndDestinationPlace(
  departurePlace: string,
  destinationPlace: string
) {
  if (departurePlace === destinationPlace) {
    throw new MyRouteError('SameDepartureAndDestinationPlaceError');
  }
}
