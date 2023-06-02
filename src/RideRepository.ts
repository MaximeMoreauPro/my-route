import { Ride } from './Ride';

export interface RideRepository {
  save: (ride: Ride) => Promise<void>;
  getRidesByUser(user: string): Promise<Ride[]>;
}
