import { Ride, RideRepository } from './PostRide.use-case';

export class InMemoryRideRepository implements RideRepository {
  ride!: Ride;

  async save(rideToSave: Ride): Promise<void> {
    this.ride = rideToSave;
    return Promise.resolve();
  }
}
