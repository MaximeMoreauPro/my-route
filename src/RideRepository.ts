import { Ride } from './PostRide.use-case';

export interface RideRepository {
  save: (ride: Ride) => Promise<void>;
  getRidesByUser(user: string): Promise<Ride[]>;
}
