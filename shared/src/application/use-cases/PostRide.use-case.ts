import { Ride } from '../../domain/Ride';
import { DateProvider } from '../providers/DateProvider';
import { IdProvider } from '../providers/IdProvider';
import { RideRepository } from '../repositories/RideRepository';

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
    private readonly rideRepository: RideRepository,
    private readonly dateProvider: DateProvider,
    private readonly idProvider: IdProvider,
  ) {}

  async handle(postRideCommand: PostRideCommand) {
    const ride = Ride.fromData({
      ...postRideCommand,
      id: this.idProvider.getId(),
      postedAt: this.dateProvider.getNow(),
      passengers: [],
    });

    await this.rideRepository.postRide(ride);
  }
}
