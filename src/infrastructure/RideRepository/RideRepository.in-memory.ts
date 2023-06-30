import { Ride } from '../../domain/Ride';
import { RideRepository } from '../../application/RideRepository';

export class InMemoryRideRepository implements RideRepository {
  rides: Ride[] = [];

  async save(rideToSave: Ride): Promise<void> {
    this.rides.push(rideToSave);
    return Promise.resolve();
  }

  async getRidesByUser(user: string): Promise<Ride[]> {
    const userRides = this.rides
      .filter(({ driver }) => driver === user)
      .map(ride => Ride.fromData(ride));
    return Promise.resolve(userRides);
  }

  givenTheseRidesExist(exsitingRides: Ride[]): void {
    this.rides = exsitingRides;
  }
}
