import { MyRouteError } from './MyRouteError';

export type PostRideCommand = {
  driver: string;
  departurePlace: string;
  departureTime: Date;
  destinationPlace: string;
  destinationTime: Date;
};

export type Ride = {
  driver: string;
  departurePlace: string;
  departureTime: Date;
  destinationPlace: string;
  destinationTime: Date;
  postedAt: Date;
};

export interface RideRepository {
  save: (ride: Ride) => void;
}

export interface DateProvider {
  getNow: () => Date;
}

export class PostRideUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly dateProvider: DateProvider
  ) {}

  handle(postRideCommand: PostRideCommand) {
    const now = this.dateProvider.getNow();

    if (postRideCommand.departureTime.getTime() <= now.getTime()) {
      throw new MyRouteError('PassedDepartureTimeError');
    }

    if (
      postRideCommand.destinationTime.getTime() <=
      postRideCommand.departureTime.getTime()
    ) {
      throw new MyRouteError('DepartureTimeAfterDestinationTimeError');
    }

    const departurePlace = postRideCommand.departurePlace.trim();
    const destinationPlace = postRideCommand.destinationPlace.trim();

    if (departurePlace.length === 0 || destinationPlace.length === 0) {
      throw new MyRouteError('EmptyPlaceError');
    }

    if (departurePlace === destinationPlace) {
      throw new MyRouteError('SameDepartureAndDestinationPlaceError');
    }

    this.rideRepository.save({
      ...postRideCommand,
      postedAt: now,
    });
  }
}
