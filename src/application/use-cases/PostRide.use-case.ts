import { Ride } from '../../domain/Ride';
import { DateProvider } from '../DateProvider';
import { IdProvider } from '../IdProvider';
import { RideRepository } from '../RideRepository';

export type PostRideCommand = Pick<
  Ride['data'],
  | 'driver'
  | 'departurePlace'
  | 'departureTime'
  | 'destinationPlace'
  | 'destinationTime'
>;

export class PostRideUseCase {
  constructor(
    private readonly _rideRepository: RideRepository,
    private readonly _dateProvider: DateProvider,
    private readonly _idProvider: IdProvider
  ) {}

  async handle(postRideCommand: PostRideCommand) {
    const ride = Ride.fromData({
      id: this._idProvider.getId(),
      ...postRideCommand,
      postedAt: this._dateProvider.getNow(),
    });

    await this._rideRepository.save(ride);
  }
}
