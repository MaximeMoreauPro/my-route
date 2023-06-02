import { Ride } from '../../domain/Ride';
import { DateProvider } from '../DateProvider';
import { RideRepository } from '../RideRepository';

export type PostRideCommand = Pick<
  Ride,
  | 'driver'
  | 'departurePlace'
  | 'departureTime'
  | 'destinationPlace'
  | 'destinationTime'
>;

export class PostRideUseCase {
  constructor(
    private readonly _rideRepository: RideRepository,
    private readonly _dateProvider: DateProvider
  ) {}

  async handle(postRideCommand: PostRideCommand) {
    const ride = Ride.fromData({
      ...postRideCommand,
      postedAt: this._dateProvider.getNow(),
    });

    await this._rideRepository.save(ride);
  }
}
