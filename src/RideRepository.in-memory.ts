import { Ride, RideRepository } from './PostRide.use-case';

export class InMemoryRideRepository implements RideRepository {
  ride!: Ride;

  save(rideToSave: Ride) {
    this.ride = rideToSave;
  }
}
