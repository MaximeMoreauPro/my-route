import { MyRouteError } from '../MyRouteError';
import { User } from './User';

export class Ride {
  private constructor(
    private readonly _driver: User,
    private readonly _departurePlace: string,
    private readonly _departureTime: Date,
    private readonly _destinationPlace: string,
    private readonly _destinationTime: Date,
    private readonly _postedAt: Date
  ) {}

  static fromData(data: Ride['data']) {
    checkPassedDepartureTime(data.departureTime, data.postedAt);

    checkDepartureTimeAfterDestinationTime(
      data.destinationTime,
      data.departureTime
    );

    const trimedDeparturePlace = data.departurePlace.trim();
    const trimedDestinationPlace = data.destinationPlace.trim();

    checkEmptyPlace(trimedDeparturePlace, trimedDestinationPlace);

    checkSameDepartureAndDestinationPlace(
      trimedDeparturePlace,
      trimedDestinationPlace
    );

    return new Ride(
      data.driver,
      trimedDeparturePlace,
      data.departureTime,
      trimedDestinationPlace,
      data.destinationTime,
      data.postedAt
    );
  }

  get data() {
    return {
      driver: this.driver,
      departurePlace: this.departurePlace,
      departureTime: this.departureTime,
      destinationPlace: this.destinationPlace,
      destinationTime: this.destinationTime,
      postedAt: this.postedAt,
    };
  }

  get driver() {
    return this._driver;
  }

  get departurePlace() {
    return this._departurePlace;
  }

  get departureTime() {
    return this._departureTime;
  }

  get destinationPlace() {
    return this._destinationPlace;
  }

  get destinationTime() {
    return this._destinationTime;
  }

  get postedAt() {
    return this._postedAt;
  }
}

function checkPassedDepartureTime(departureTime: Date, postedAt: Date) {
  if (departureTime.getTime() <= postedAt.getTime()) {
    throw new MyRouteError('PassedDepartureTimeError');
  }
}

function checkDepartureTimeAfterDestinationTime(
  destinationTime: Date,
  departureTime: Date
) {
  if (destinationTime.getTime() <= departureTime.getTime()) {
    throw new MyRouteError('DepartureTimeAfterDestinationTimeError');
  }
}

function checkEmptyPlace(departurePlace: string, destinationPlace: string) {
  if (departurePlace.length === 0 || destinationPlace.length === 0) {
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
