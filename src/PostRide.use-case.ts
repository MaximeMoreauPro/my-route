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
    if (
      postRideCommand.departureTime.toUTCString() ===
      postRideCommand.destinationTime.toUTCString()
    ) {
      throw new MyRouteError('SameDepartureAndDestinationTimeError');
    }

    if (
      postRideCommand.departurePlace.trim().length === 0 ||
      postRideCommand.destinationPlace.trim().length === 0
    ) {
      throw new MyRouteError('EmptyPlaceError');
    }

    this.rideRepository.save({
      ...postRideCommand,
      postedAt: this.dateProvider.getNow(),
    });
  }
}
