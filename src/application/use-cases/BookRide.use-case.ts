import { RideData } from '@/domain/Ride.js';
import { User } from '@/domain/User.js';
import { RideRepository } from '@/application/repositories/RideRepository.js';

export type BookRideCommand = {
  user: User;
  ride: RideData;
};

export class BookRideUseCase {
  constructor(private readonly rideRepository: RideRepository) {}

  async handle({ user, ride }: BookRideCommand): Promise<void> {
    await this.rideRepository.bookRide({ user, ride });
  }
}
