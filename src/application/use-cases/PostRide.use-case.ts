import { Ride } from '@/domain/Ride.js';
import { DateProvider } from '@/application/providers/DateProvider.js';
import { IdProvider } from '@/application/providers/IdProvider.js';
import { RideRepository } from '@/application/repositories/RideRepository.js';

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
    private readonly idProvider: IdProvider
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
