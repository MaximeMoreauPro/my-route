import { Ride } from './Ride';
import { RideRepository } from './RideRepository';

export class InMemoryRideRepository implements RideRepository {
  rides: Ride[] = [];

  async save(rideToSave: Ride): Promise<void> {
    this.rides.push(rideToSave);
    return Promise.resolve();
  }

  async getRidesByUser(user: string): Promise<Ride[]> {
    const userRides = this.rides.filter(({ driver }) => driver === user);
    return Promise.resolve(userRides);
  }

  givenTheseRidesExist(exsitingRides: Ride[]): void {
    this.rides = exsitingRides;
  }
}
