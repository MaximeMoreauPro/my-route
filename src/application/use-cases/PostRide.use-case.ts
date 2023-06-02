import { MyRouteError } from '../../MyRouteError';
import { Ride } from '../../domain/Ride';
import { RideRepository } from './RideRepository';

export type PostRideCommand = Pick<
  Ride,
  | 'driver'
  | 'departurePlace'
  | 'departureTime'
  | 'destinationPlace'
  | 'destinationTime'
>;

export interface DateProvider {
  getNow: () => Date;
}

export class PostRideUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly dateProvider: DateProvider
  ) {}

  async handle(postRideCommand: PostRideCommand) {
    const now = this.dateProvider.getNow();

    this._validateData(postRideCommand, now);

    await this.rideRepository.save({
      ...postRideCommand,
      postedAt: now,
    });
  }

  private _validateData(postRideCommand: PostRideCommand, now: Date) {
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
  }
}
