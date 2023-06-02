import { MyRouteError } from '../MyRouteError';
import { Entity } from './Entity';
import { User } from './User';

export class Ride extends Entity {
  private constructor(
    id: string,
    private readonly _driver: User,
    private readonly _departurePlace: string,
    private readonly _departureTime: Date,
    private readonly _destinationPlace: string,
    private readonly _destinationTime: Date,
    private readonly _postedAt: Date
  ) {
    super(id);
  }

  static fromData(data: Ride['data']) {
    const departureTime = new Date(data.departureTime);
    const destinationTime = new Date(data.destinationTime);
    const postedAt = new Date(data.postedAt);

    checkPassedDepartureTime(departureTime, postedAt);

    checkDepartureTimeAfterDestinationTime(destinationTime, departureTime);

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
      departureTime,
      trimedDestinationPlace,
      destinationTime,
      postedAt
    );
  }

  get data() {
    return {
      id: this.id,
      driver: this.driver,
      departurePlace: this.departurePlace,
      departureTime: this.departureTime.toISOString(),
      destinationPlace: this.destinationPlace,
      destinationTime: this.destinationTime.toISOString(),
      postedAt: this.postedAt.toISOString(),
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
